# Deploy on Existing EC2 (Default Flow)

This is the default production flow for this repository.

## Goals

- Reuse the existing EC2 in production.
- Preserve domain, HTTPS and Certbot files.
- Preserve PM2 process `emailAPI`.
- Replace only frontend static files.
- Keep Abler authentication only on the server.

## Prerequisites

- SSH access to production EC2.
- Node.js and npm available on your local machine.
- Existing Certbot certificate already present on server.
- Nginx installed and running on server.

## Validate email API protocol first

Run on server before applying Nginx config:

```bash
bash scripts/check-email-api-protocol.sh
```

Then render and install config:

```bash
bash scripts/render-existing-nginx-config.sh
sudo bash scripts/install-nginx-config.sh
```

## Validate contact parser before build

Run on server:

```bash
grep -RniE "express\.json|express\.urlencoded|urlencoded|bodyParser" /usr/share/nodejs/www/emailAPI/emailAPI/src /usr/share/nodejs/www/emailAPI/emailAPI/package.json 2>/dev/null
```

- If JSON parser exists, you may build with `REACT_APP_CONTACT_ENCODING=json`.
- If only urlencoded parser exists, build with `REACT_APP_CONTACT_ENCODING=urlencoded`.
- Default repository setting is conservative for legacy compatibility.

## Prepare Abler token on server

The Abler token must not live in React code or repository files.

Create the local snippet manually after rotating the old token:

```bash
sudo mkdir -p /etc/nginx/snippets
sudo install -o root -g root -m 600 /dev/null /etc/nginx/snippets/abler-auth.conf
sudo sh -c 'printf '%s\n' 'proxy_set_header Authorization "Bearer TOKEN_NOVO_DA_ABLER";' > /etc/nginx/snippets/abler-auth.conf'
```

Allowed Abler proxy endpoint in production config:

- `GET /abler-api/v1/vacancies`
- `HEAD /abler-api/v1/vacancies`

Other `/abler-api/*` paths are intentionally denied.

## Build directory detection

The deploy script auto-detects build output:

- CRA (`react-scripts build`) -> `build`
- Vite (`vite build`) -> `dist`

You can override manually:

```bash
export BUILD_DIR=build
```

## Script

Use:

```bash
chmod +x scripts/deploy-existing-ec2.sh
export REMOTE_HOST=52.206.204.172
export REMOTE_USER=ec2-user
# optional: export SSH_KEY_PATH=~/.ssh/your-key.pem
bash scripts/check-secrets.sh
./scripts/deploy-existing-ec2.sh
```

## What the script does

1. `npm ci`
2. `npm run build`
3. validates `${BUILD_DIR}/index.html`
4. uploads build archive to remote temp folder
5. creates timestamped backup of current published site
6. publishes new build by controlled directory swap
7. runs `nginx -t`
8. reloads Nginx only when validation passes
9. runs HTTP checks on both domains
10. checks Nginx status, PM2 process and listener on `:9200`
11. automatic rollback if `nginx -t` fails

## Important safety rules

- Do not remove `/usr/share/nginx/www/maieuticarh.com.br-backup-20260806`.
- Do not stop PM2 process `emailAPI`.
- Do not restart EC2.
- Do not run `terraform apply` as part of this flow.
- Do not change frontend API endpoint behavior before validating proxy protocol.
- Do not store the Abler token in `.env`, `env`, React source, or repository scripts.

## Post-deploy server checks

Run on server:

```bash
nginx -t
systemctl status nginx --no-pager
sudo env PM2_HOME=/root/.pm2 pm2 describe emailAPI
ss -lntp | grep ':9200'
curl -I https://maieuticarh.com.br
curl -I https://www.maieuticarh.com.br
```
