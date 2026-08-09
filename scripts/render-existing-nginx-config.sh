#!/usr/bin/env bash
set -Eeuo pipefail

SCRIPT_DIR="$(cd -- "$(dirname -- "${BASH_SOURCE[0]}")" && pwd)"
PROJECT_ROOT="$(cd -- "${SCRIPT_DIR}/.." && pwd)"
TEMPLATE_PATH="${PROJECT_ROOT}/nginx/existing-ec2/maieuticarh.conf.tftpl"
OUTPUT_PATH="${PROJECT_ROOT}/build/nginx/maieuticarh.conf"
CHECK_SCRIPT="${PROJECT_ROOT}/scripts/check-email-api-protocol.sh"

if [[ ! -f "${TEMPLATE_PATH}" ]]; then
  echo "ERROR: template nao encontrado em ${TEMPLATE_PATH}" >&2
  exit 1
fi
if [[ ! -f "${CHECK_SCRIPT}" ]]; then
  echo "ERROR: script de checagem nao encontrado: ${CHECK_SCRIPT}" >&2
  exit 1
fi

EMAIL_API_PROTOCOL="$(bash "${CHECK_SCRIPT}")"
if [[ "${EMAIL_API_PROTOCOL}" != "http" && "${EMAIL_API_PROTOCOL}" != "https" ]]; then
  echo "ERROR: protocolo invalido retornado por check-email-api-protocol.sh: ${EMAIL_API_PROTOCOL}" >&2
  exit 1
fi

mkdir -p "$(dirname -- "${OUTPUT_PATH}")"
sed "s/\${email_api_protocol}/${EMAIL_API_PROTOCOL}/g" "${TEMPLATE_PATH}" > "${OUTPUT_PATH}"

if grep -Eq "\${email_api_protocol}|__EMAIL_API_PROTOCOL__|\${[A-Za-z_][A-Za-z0-9_]*}" "${OUTPUT_PATH}"; then
  echo "ERROR: arquivo renderizado ainda contem placeholders: ${OUTPUT_PATH}" >&2
  exit 1
fi

echo "${OUTPUT_PATH}"
