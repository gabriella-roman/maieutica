#!/usr/bin/env bash
set -Eeuo pipefail

SCRIPT_DIR="$(cd -- "$(dirname -- "${BASH_SOURCE[0]}")" && pwd)"
PROJECT_ROOT="$(cd -- "${SCRIPT_DIR}/.." && pwd)"

cd "${PROJECT_ROOT}"

PATTERN='Bearer[[:space:]]+[A-Za-z0-9._-]{20,}|Authorization["'"'"']?[[:space:]]*[:=][[:space:]]*["'"'"']?Bearer[[:space:]]+[A-Za-z0-9._-]{20,}|(ABLER_TOKEN|REACT_APP_API_TOKEN)[[:space:]]*[:=][[:space:]]*["'"'"']?[A-Za-z0-9._-]{20,}|accessKeyId[[:space:]]*[:=][[:space:]]*["'"'"']?[A-Za-z0-9/_+=-]{8,}|secretAccessKey[[:space:]]*[:=][[:space:]]*["'"'"']?[A-Za-z0-9/_+=-]{16,}|AKIA[0-9A-Z]{16}|-----BEGIN (RSA |EC |OPENSSH |)?PRIVATE KEY-----'
TARGETS=(src public scripts nginx terraform proxy package.json package-lock.json .env .env.example env abler-fetch.js index.html)

mapfile -t hits < <(grep -RInE --exclude-dir=node_modules --exclude-dir=build --exclude-dir=dist --exclude-dir=.git --exclude-dir=.terraform --exclude='*.md' "${PATTERN}" "${TARGETS[@]}" 2>/dev/null | grep -Ev 'TOKEN_NOVO_DA_ABLER|__ABLER_TOKEN__|process\.env\.(ABLER_TOKEN|REACT_APP_API_TOKEN)' || true)

if [[ "${#hits[@]}" -eq 0 ]]; then
  echo "No potential secrets found."
  exit 0
fi

echo "Potential secrets found:" >&2
for hit in "${hits[@]}"; do
  file_part="${hit%%:*}"
  rest="${hit#*:}"
  line_part="${rest%%:*}"
  echo "- ${file_part#./}:${line_part}" >&2
done

exit 1
