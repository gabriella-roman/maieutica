# Maieutica RH Website

Frontend React for maieuticarh.com.br.

This repository has two distinct flows:

- Default flow: existing EC2 deployment.
- Optional flow: provision a new EC2 with Terraform (explicit confirmation required).

## Default production strategy

Use existing EC2 and replace only static frontend files.

- Keep current domain and HTTPS (Certbot paths already in use).
- Keep PM2 process `emailAPI` running.
- Do not create new AWS resources in routine deployments.
- Rotate any previously exposed Abler token before publishing.

Main guide: `docs/deploy-existing-ec2.md`
Validation checklist: `docs/pre-deploy-validation.md`

## Local development

```bash
npm install
npm run dev
```

## Production build

```bash
bash scripts/check-secrets.sh
npm ci
npm run build
CI=true npm run build
```

Build output is auto-detected by deploy script:

- CRA -> `build`
- Vite -> `dist`

## Deploy to existing EC2

```bash
chmod +x scripts/deploy-existing-ec2.sh
export REMOTE_HOST=52.206.204.172
export REMOTE_USER=ec2-user
./scripts/deploy-existing-ec2.sh
```

## Nginx production config

Reference files:

- `nginx/existing-ec2/maieuticarh.conf.tftpl`
- `nginx/existing-ec2/security-headers.conf`
- `nginx/new-ec2/maieuticarh.conf.tftpl`

Server root expected in production:

- `/usr/share/nginx/www/maieuticarh.com.br`

## Contact API integration

Frontend endpoint:

- `/api/contact`

Nginx proxies internally to:

- `__EMAIL_API_PROTOCOL__://127.0.0.1:9200/postmsg`
- `/abler-api/v1/vacancies` -> `https://api.abler.com.br/v1/vacancies`

Do not assume protocol. Render config from template after protocol detection:

```bash
scripts/check-email-api-protocol.sh
scripts/render-existing-nginx-config.sh
```

Install Nginx config manually (no automatic deploy):

```bash
sudo bash scripts/install-nginx-config.sh
```

Before installation, create `/etc/nginx/snippets/abler-auth.conf` manually with the rotated token.

The Abler proxy is intentionally restricted to read-only vacancy queries used by the frontend.

Temporary compatibility fallback is available by env variables:

- `REACT_APP_ENABLE_LEGACY_EMAIL_FALLBACK`
- `REACT_APP_LEGACY_EMAIL_API_URL`

See `.env.example`.

## Validation checklist

Local:

```bash
npm ci
npm run build
test -f "${BUILD_DIR}/index.html"
terraform fmt -check -recursive
terraform validate
```

Server:

```bash
nginx -t
systemctl status nginx --no-pager
sudo env PM2_HOME=/root/.pm2 pm2 describe emailAPI
ss -lntp | grep ':9200'
curl -I https://maieuticarh.com.br
curl -I https://www.maieuticarh.com.br
```

Frontend and API:

- Home page opens with HTTPS.
- Refresh in React Router routes does not return 404.
- Assets load correctly.
- `index.html` is not long cached.
- Versioned assets are cached long.
- CRA assets under `/static/` are cached long.
- Contact form calls `/api/contact`.
- Job board calls `/abler-api/v1` in production.
- Real API failures show error (no false success).
- Browser requests do not carry Abler Authorization directly.

If the domain is configured directly in `/etc/nginx/nginx.conf` or appears in multiple Nginx files, stop and migrate manually before running the installer.

## Rollback

Quick rollback and AMI fallback:

- `docs/rollback.md`

Protected backup directory that must not be removed:

- `/usr/share/nginx/www/maieuticarh.com.br-backup-20260806`

## Terraform module (optional only)

Terraform in `terraform/` is for optional isolated infrastructure creation.

- Do not bind existing production EC2 automatically.
- Do not run `terraform apply` without explicit human approval.
- Never run `terraform destroy` in production workflows.
- New EC2 creation is blocked by default with `confirm_create_new_infrastructure=false`.

Always verify AWS account first:

```bash
aws sts get-caller-identity
```

Audit report:

- `docs/terraform-audit.md`
