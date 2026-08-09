# Credential Rotation Report

Date: 2026-08-06

## Exposure summary

Potential Abler credentials were found in local project files and removed from the repository working tree.

Removed files that contained embedded credentials or direct authenticated test calls:

- `env`
- `abler-fetch.js`
- `index.html` at project root

## Rotation required

Rotate the previously exposed Abler token before any new production deployment.

## Safe replacement strategy

- Do not place the new token in React code.
- Do not place the new token in `REACT_APP_*` variables.
- Do not commit the new token into this repository.
- Store the new token only on the server in `/etc/nginx/snippets/abler-auth.conf`.

## Server-side snippet creation

```bash
sudo mkdir -p /etc/nginx/snippets
sudo install -o root -g root -m 600 /dev/null /etc/nginx/snippets/abler-auth.conf
sudo sh -c 'printf '%s\n' 'proxy_set_header Authorization "Bearer TOKEN_NOVO_DA_ABLER";' > /etc/nginx/snippets/abler-auth.conf'
```

Do not copy the real token into logs, shell history shared with third parties, or repository files.
