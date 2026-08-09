#!/usr/bin/env bash
set -Eeuo pipefail

DOMAIN_NAME="${DOMAIN_NAME:-maieuticarh.com.br}"
WWW_DOMAIN_NAME="${WWW_DOMAIN_NAME:-www.maieuticarh.com.br}"
REMOTE_WEB_ROOT="${REMOTE_WEB_ROOT:-/usr/share/nginx/www/maieuticarh.com.br}"
PROTECTED_BACKUP_DIR="/usr/share/nginx/www/maieuticarh.com.br-backup-20260806"
REMOTE_USER="${REMOTE_USER:-ec2-user}"
REMOTE_HOST="${REMOTE_HOST:-}"
SSH_KEY_PATH="${SSH_KEY_PATH:-}"
BUILD_DIR="${1:-${BUILD_DIR:-}}"
RUN_LOCAL_BUILD="${RUN_LOCAL_BUILD:-true}"

if [[ -z "${REMOTE_HOST}" ]]; then
  echo "ERROR: informe REMOTE_HOST (ex.: export REMOTE_HOST=52.206.204.172)" >&2
  exit 1
fi

ssh_args=("-o" "StrictHostKeyChecking=accept-new")
if [[ -n "${SSH_KEY_PATH}" ]]; then
  ssh_args+=("-i" "${SSH_KEY_PATH}")
fi

log() {
  printf '[deploy] %s\n' "$*"
}

detect_build_dir() {
  if [[ -n "${BUILD_DIR}" ]]; then
    printf '%s\n' "${BUILD_DIR}"
    return 0
  fi

  if grep -Eq '"build"\s*:\s*"react-scripts build"' package.json; then
    printf 'build\n'
    return 0
  fi

  if grep -Eq '"build"\s*:\s*"vite build"' package.json || grep -Eq '"vite"' package.json; then
    printf 'dist\n'
    return 0
  fi

  if [[ -d build ]]; then
    printf 'build\n'
    return 0
  fi

  if [[ -d dist ]]; then
    printf 'dist\n'
    return 0
  fi

  echo "Nao foi possivel detectar BUILD_DIR automaticamente. Defina BUILD_DIR." >&2
  return 1
}

BUILD_DIR="$(detect_build_dir)"
log "BUILD_DIR detectado: ${BUILD_DIR}"

if [[ "${RUN_LOCAL_BUILD}" == "true" ]]; then
  log "Executando npm ci"
  npm ci

  log "Executando npm run build"
  npm run build
fi

if [[ ! -d "${BUILD_DIR}" ]]; then
  echo "ERROR: diretorio de build nao encontrado: ${BUILD_DIR}" >&2
  exit 1
fi

if [[ ! -f "${BUILD_DIR}/index.html" ]]; then
  echo "ERROR: index.html ausente em ${BUILD_DIR}" >&2
  exit 1
fi

if [[ ! -d "${BUILD_DIR}/assets" && ! -d "${BUILD_DIR}/static" ]]; then
  echo "ERROR: pasta de assets nao encontrada em ${BUILD_DIR} (esperado assets/ ou static/)." >&2
  exit 1
fi

stamp="$(date +%Y%m%d-%H%M%S)"
local_archive="/tmp/maieuticarh-${stamp}.tar.gz"
remote_upload_dir="/tmp/maieuticarh-upload-${stamp}"
remote_new_root="${REMOTE_WEB_ROOT}.new-${stamp}"
remote_prev_root="${REMOTE_WEB_ROOT}.prev-${stamp}"
remote_failed_root="${REMOTE_WEB_ROOT}.failed-${stamp}"
remote_backup_root="${REMOTE_WEB_ROOT}-backup-${stamp}"

log "Empacotando build"
tar -C "${BUILD_DIR}" -czf "${local_archive}" .

log "Criando pasta temporaria remota"
ssh "${ssh_args[@]}" "${REMOTE_USER}@${REMOTE_HOST}" "mkdir -p '${remote_upload_dir}'"

log "Enviando build para pasta temporaria remota"
scp "${ssh_args[@]}" "${local_archive}" "${REMOTE_USER}@${REMOTE_HOST}:${remote_upload_dir}/site.tar.gz"

log "Publicando no servidor com validacao e rollback automatico"
ssh "${ssh_args[@]}" "${REMOTE_USER}@${REMOTE_HOST}" bash -s -- \
  "${remote_upload_dir}" "${REMOTE_WEB_ROOT}" "${remote_new_root}" "${remote_prev_root}" "${remote_failed_root}" "${remote_backup_root}" "${PROTECTED_BACKUP_DIR}" <<'EOF'
set -Eeuo pipefail

remote_upload_dir="$1"
remote_web_root="$2"
remote_new_root="$3"
remote_prev_root="$4"
remote_failed_root="$5"
remote_backup_root="$6"
protected_backup_dir="$7"

rollback() {
  echo "Iniciando rollback do frontend..." >&2

  if [[ ! -d "${remote_prev_root}" ]]; then
    echo "Rollback indisponivel: ${remote_prev_root} nao existe." >&2
    return 1
  fi

  if [[ -d "${remote_web_root}" ]]; then
    sudo rm -rf "${remote_failed_root}" || true
    sudo mv "${remote_web_root}" "${remote_failed_root}" || true
  fi

  sudo mv "${remote_prev_root}" "${remote_web_root}"

  if sudo nginx -t; then
    sudo systemctl reload nginx
    echo "Rollback concluido com sucesso." >&2
    return 0
  fi

  echo "ERRO: a configuracao Nginx continua invalida apos o rollback." >&2
  return 1
}

trap 'rollback' ERR

if [[ ! -f "${remote_upload_dir}/site.tar.gz" ]]; then
  echo "Arquivo de build nao encontrado no servidor" >&2
  exit 1
fi

if [[ ! -d "${protected_backup_dir}" ]]; then
  echo "Aviso: backup protegido nao encontrado em ${protected_backup_dir}" >&2
fi

sudo rm -rf "${remote_new_root}"
sudo mkdir -p "${remote_new_root}"
sudo tar -xzf "${remote_upload_dir}/site.tar.gz" -C "${remote_new_root}"

if [[ ! -f "${remote_new_root}/index.html" ]]; then
  echo "Build remoto invalido: index.html ausente" >&2
  sudo rm -rf "${remote_new_root}"
  exit 1
fi

if [[ -d "${remote_web_root}" ]]; then
  sudo cp -a "${remote_web_root}" "${remote_backup_root}"
  sudo mv "${remote_web_root}" "${remote_prev_root}"
fi

sudo mv "${remote_new_root}" "${remote_web_root}"

if id nginx >/dev/null 2>&1; then
  sudo chown -R nginx:nginx "${remote_web_root}"
elif id www-data >/dev/null 2>&1; then
  sudo chown -R www-data:www-data "${remote_web_root}"
fi
sudo find "${remote_web_root}" -type d -exec chmod 755 {} \;
sudo find "${remote_web_root}" -type f -exec chmod 644 {} \;

if ! sudo nginx -t; then
  echo "nginx -t falhou, iniciando rollback automatico" >&2
  rollback
  exit 1
fi

sudo systemctl reload nginx

curl -fsSI \
  --resolve "maieuticarh.com.br:443:127.0.0.1" \
  "https://maieuticarh.com.br/" >/dev/null

sudo env PM2_HOME=/root/.pm2 pm2 describe emailAPI >/dev/null
ss -lntp | grep -q ':9200'

sudo rm -rf "${remote_prev_root}"
sudo rm -rf "${remote_upload_dir}"
trap - ERR
EOF

log "Deploy finalizado com sucesso"
