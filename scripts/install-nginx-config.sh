#!/usr/bin/env bash
set -Eeuo pipefail

if [[ "${EUID}" -ne 0 ]]; then
  echo "ERROR: execute como root." >&2
  exit 1
fi

DOMAIN_NAME="maieuticarh.com.br"
WEB_ROOT="/usr/share/nginx/www/maieuticarh.com.br"
CERT_FILE="/etc/letsencrypt/live/maieuticarh.com.br/fullchain.pem"
KEY_FILE="/etc/letsencrypt/live/maieuticarh.com.br/privkey.pem"
SNIPPETS_DIR="/etc/nginx/snippets"
SNIPPET_DEST="${SNIPPETS_DIR}/security-headers.conf"
ABLER_AUTH_SNIPPET="${SNIPPETS_DIR}/abler-auth.conf"

SCRIPT_DIR="$(cd -- "$(dirname -- "${BASH_SOURCE[0]}")" && pwd)"
PROJECT_ROOT="$(cd -- "${SCRIPT_DIR}/.." && pwd)"
SNIPPET_SOURCE="${PROJECT_ROOT}/nginx/existing-ec2/security-headers.conf"
RENDER_SCRIPT="${PROJECT_ROOT}/scripts/render-existing-nginx-config.sh"
RENDERED_CONF_PATH="${PROJECT_ROOT}/build/nginx/maieuticarh.conf"

if [[ ! -f "${SNIPPET_SOURCE}" ]]; then
  echo "ERROR: arquivo nao encontrado: ${SNIPPET_SOURCE}" >&2
  exit 1
fi
if [[ ! -f "${RENDER_SCRIPT}" ]]; then
  echo "ERROR: script nao encontrado: ${RENDER_SCRIPT}" >&2
  exit 1
fi
if [[ ! -f "${CERT_FILE}" || ! -f "${KEY_FILE}" ]]; then
  echo "ERROR: certificados nao encontrados em ${CERT_FILE} e ${KEY_FILE}" >&2
  exit 1
fi
if [[ ! -d "${WEB_ROOT}" ]]; then
  echo "ERROR: diretorio de publicacao nao encontrado: ${WEB_ROOT}" >&2
  exit 1
fi

mkdir -p "${SNIPPETS_DIR}"
install -m 0644 "${SNIPPET_SOURCE}" "${SNIPPET_DEST}"

if [[ ! -f "${ABLER_AUTH_SNIPPET}" ]]; then
  echo "ERROR: snippet local da Abler nao encontrado em ${ABLER_AUTH_SNIPPET}" >&2
  echo "Crie o arquivo manualmente com o novo token rotacionado antes de instalar o Nginx." >&2
  exit 1
fi

bash "${RENDER_SCRIPT}" >/dev/null
if [[ ! -f "${RENDERED_CONF_PATH}" ]]; then
  echo "ERROR: configuracao renderizada nao encontrada em ${RENDERED_CONF_PATH}" >&2
  exit 1
fi

if grep -Eq "__EMAIL_API_PROTOCOL__|\${[A-Za-z_][A-Za-z0-9_]*}" "${RENDERED_CONF_PATH}"; then
  echo "ERROR: configuracao renderizada contem placeholders nao resolvidos." >&2
  exit 1
fi

mapfile -t conf_matches < <(
  grep -Rnl "server_name ${DOMAIN_NAME}" /etc/nginx 2>/dev/null |
    grep -Ev '\.(bak|new)-[0-9]{8}-[0-9]{6}$|\.disabled$|~$' ||
    true
)

if [[ "${#conf_matches[@]}" -eq 0 ]]; then
  echo "ERROR: nenhuma configuracao ativa encontrada para ${DOMAIN_NAME}." >&2
  exit 1
fi

if [[ "${#conf_matches[@]}" -gt 1 ]]; then
  echo "ERROR: multiplas configuracoes ativas encontradas para ${DOMAIN_NAME}:" >&2
  printf ' - %s\n' "${conf_matches[@]}" >&2
  exit 1
fi

current_conf="${conf_matches[0]}"

if [[ "${current_conf}" == "/etc/nginx/nginx.conf" ]]; then
  echo "ERROR: o dominio esta configurado no nginx.conf principal." >&2
  echo "Mova os blocos server para /etc/nginx/conf.d/maieuticarh.conf antes de continuar." >&2
  exit 1
fi

stamp="$(date +%Y%m%d-%H%M%S)"
backup_conf="${current_conf}.bak-${stamp}"
temp_conf="${current_conf}.new-${stamp}"

cp -a "${current_conf}" "${backup_conf}"
cp -f "${RENDERED_CONF_PATH}" "${temp_conf}"
cp -f "${temp_conf}" "${current_conf}"
rm -f "${temp_conf}"

if nginx -t; then
  systemctl reload nginx
  echo "Configuracao aplicada com sucesso em ${current_conf}"
  echo "Backup: ${backup_conf}"
  exit 0
fi

echo "nginx -t falhou, restaurando backup..." >&2
cp -f "${backup_conf}" "${current_conf}"
nginx -t
exit 1
