#!/usr/bin/env bash
set -Eeuo pipefail

HOST="${HOST:-127.0.0.1}"
PORT="${PORT:-9200}"
TIMEOUT="${TIMEOUT:-5}"

http_url="http://${HOST}:${PORT}/"
https_url="https://${HOST}:${PORT}/"

reachable_http_code() {
  local url="$1"
  shift

  local code
  code="$(curl -sS -o /dev/null -w "%{http_code}" --max-time "${TIMEOUT}" "$@" "${url}" 2>/dev/null || true)"
  if [[ "${code}" =~ ^[0-9]{3}$ && "${code}" != "000" ]]; then
    printf '%s\n' "${code}"
    return 0
  fi

  return 1
}

http_ok=0
https_ok=0
http_code=""
https_code=""

if http_code="$(reachable_http_code "${http_url}")"; then
  http_ok=1
fi

if https_code="$(reachable_http_code "${https_url}" -k)"; then
  https_ok=1
fi

if [[ "${http_ok}" -eq 1 && "${https_ok}" -eq 0 ]]; then
  printf 'http\n'
  exit 0
fi

if [[ "${http_ok}" -eq 0 && "${https_ok}" -eq 1 ]]; then
  printf 'https\n'
  exit 0
fi

if [[ "${http_ok}" -eq 1 && "${https_ok}" -eq 1 ]]; then
  echo "ERROR: ambos protocolos responderam (http=${http_code}, https=${https_code}). Resolva manualmente antes de renderizar o Nginx." >&2
  exit 1
fi

echo "ERROR: nenhum protocolo respondeu em ${HOST}:${PORT}. Verifique PM2/emailAPI antes de prosseguir." >&2
exit 1
