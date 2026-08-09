#!/usr/bin/env bash
set -Eeuo pipefail

run_case() {
  local case_name="$1"
  local fail_at="$2"

  local tmp
  tmp="$(mktemp -d)"

  local remote_upload_dir="$tmp/upload"
  local remote_web_root="$tmp/web"
  local remote_new_root="$tmp/web.new"
  local remote_prev_root="$tmp/web.prev"
  local remote_failed_root="$tmp/web.failed"
  local remote_backup_root="$tmp/web-backup"
  local protected_backup_dir="$tmp/fixed-backup"
  local events="$tmp/events.log"

  mkdir -p "$remote_upload_dir" "$remote_web_root" "$protected_backup_dir"
  echo old > "$remote_web_root/index.html"
  mkdir -p "$remote_new_root"
  echo new > "$remote_new_root/index.html"
  echo tarball > "$remote_upload_dir/site.tar.gz"
  : > "$events"

  sudo(){ "$@"; }
  nginx(){ echo "nginx -t" >> "$events"; return 0; }
  systemctl(){ echo "systemctl $*" >> "$events"; return 0; }
  curl(){
    echo "curl $*" >> "$events"
    if [[ "$fail_at" == "curl" ]]; then
      return 22
    fi
    return 0
  }
  pm2(){
    echo "pm2 $*" >> "$events"
    if [[ "$fail_at" == "pm2" ]]; then
      return 1
    fi
    return 0
  }
  ss(){
    echo "ss $*" >> "$events"
    if [[ "$fail_at" == "port" ]]; then
      echo "LISTEN 0 128 127.0.0.1:8080" 
      return 0
    fi
    echo "LISTEN 0 128 0.0.0.0:9200"
    return 0
  }

  rollback() {
    echo "rollback_called=yes" >> "$events"
    if [[ -d "${remote_prev_root}" ]]; then
      echo "prev_present_at_rollback=yes" >> "$events"
    else
      echo "prev_present_at_rollback=no" >> "$events"
    fi

    if [[ ! -d "${remote_prev_root}" ]]; then
      return 1
    fi

    if [[ -d "${remote_web_root}" ]]; then
      sudo rm -rf "${remote_failed_root}" || true
      sudo mv "${remote_web_root}" "${remote_failed_root}" || true
    fi

    sudo mv "${remote_prev_root}" "${remote_web_root}"

    if sudo nginx -t; then
      sudo systemctl reload nginx
      return 0
    fi

    return 1
  }

  set +e
  (
    set -Eeuo pipefail
    trap 'rollback' ERR

    if [[ ! -f "${remote_upload_dir}/site.tar.gz" ]]; then
      exit 1
    fi

    if [[ -d "${remote_web_root}" ]]; then
      sudo cp -a "${remote_web_root}" "${remote_backup_root}"
      sudo mv "${remote_web_root}" "${remote_prev_root}"
    fi

    sudo mv "${remote_new_root}" "${remote_web_root}"

    sudo find "${remote_web_root}" -type d -exec chmod 755 {} \;
    sudo find "${remote_web_root}" -type f -exec chmod 644 {} \;

    sudo nginx -t
    sudo systemctl reload nginx

    curl -fsSI --resolve "maieuticarh.com.br:443:127.0.0.1" "https://maieuticarh.com.br/" >/dev/null
    PM2_HOME=/root/.pm2 pm2 describe emailAPI >/dev/null
    ss -lntp | grep -q ':9200'

    if [[ -d "${remote_prev_root}" ]]; then
      echo "prev_exists_before_cleanup=yes" >> "$events"
    else
      echo "prev_exists_before_cleanup=no" >> "$events"
    fi

    sudo rm -rf "${remote_prev_root}"
    sudo rm -rf "${remote_upload_dir}"
    trap - ERR
  )
  rc=$?
  set -e

  local prev_exists_end="no"
  [[ -d "$remote_prev_root" ]] && prev_exists_end="yes"
  local web_payload="missing"
  [[ -f "$remote_web_root/index.html" ]] && web_payload="$(cat "$remote_web_root/index.html")"
  local before_cleanup="not_recorded"
  if grep -q '^prev_exists_before_cleanup=' "$events"; then
    before_cleanup="$(grep '^prev_exists_before_cleanup=' "$events" | tail -n1 | cut -d= -f2)"
  fi

  local rollback_called="no"
  if grep -q '^rollback_called=yes$' "$events"; then
    rollback_called="yes"
  fi

  local prev_at_rollback="not_recorded"
  if grep -q '^prev_present_at_rollback=' "$events"; then
    prev_at_rollback="$(grep '^prev_present_at_rollback=' "$events" | tail -n1 | cut -d= -f2)"
  fi

  echo "CASE=${case_name};RC=${rc};ROLLBACK_CALLED=${rollback_called};PREV_PRESENT_AT_ROLLBACK=${prev_at_rollback};PREV_EXISTS_END=${prev_exists_end};PREV_EXISTS_BEFORE_CLEANUP=${before_cleanup};WEB_INDEX=${web_payload}"

  rm -rf "$tmp"
}

run_case "fail_curl" "curl"
run_case "fail_pm2" "pm2"
run_case "fail_port_9200" "port"
run_case "success" "none"