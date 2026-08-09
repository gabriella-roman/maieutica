# Pre-deploy Validation (Manual)

This checklist must be executed manually before changing Nginx config or running any Terraform apply.

## 1) AWS identity safety check

```bash
aws sts get-caller-identity
```

Confirm that no Terraform operation will target the current production EC2.

## 2) Find current Nginx domain config

```bash
grep -Rnl "server_name maieuticarh.com.br" /etc/nginx 2>/dev/null
```

Expected behavior:

- If result is `/etc/nginx/conf.d/maieuticarh.conf`, the installer can replace it after backup.
- If result is `/etc/nginx/nginx.conf`, stop and move the `server` blocks manually into `/etc/nginx/conf.d/maieuticarh.conf`.
- If multiple files are returned, stop and review manually.

## 3) Verify Nginx include locations

```bash
grep -nE 'include.*(conf\.d|default\.d|sites-enabled|sites-available)' /etc/nginx/nginx.conf
```

## 4) Check email API protocol locally (without sending email)

```bash
curl -sS -o /dev/null -w 'HTTP: %{http_code}\n' --max-time 5 http://127.0.0.1:9200/ || echo 'HTTP falhou'
curl -k -sS -o /dev/null -w 'HTTPS: %{http_code}\n' --max-time 5 https://127.0.0.1:9200/ || echo 'HTTPS falhou'
```

Alternative helper script:

```bash
bash scripts/check-email-api-protocol.sh
```

## 4.1) Check backend parser accepted by emailAPI

```bash
grep -RniE "express\.json|express\.urlencoded|urlencoded|bodyParser" /usr/share/nodejs/www/emailAPI/emailAPI/src /usr/share/nodejs/www/emailAPI/emailAPI/package.json 2>/dev/null
```

If only urlencoded parsing is present, set `REACT_APP_CONTACT_ENCODING=urlencoded` before the production build.
If JSON parsing is confirmed, you may set `REACT_APP_CONTACT_ENCODING=json` explicitly.

Render Nginx config only after protocol detection:

```bash
bash scripts/render-existing-nginx-config.sh
```

## 5) Validate Nginx syntax before reload

```bash
nginx -t
```

## 6) Check Nginx service state

```bash
systemctl status nginx --no-pager
```

## 7) Check PM2 emailAPI health

```bash
sudo env PM2_HOME=/root/.pm2 pm2 describe emailAPI
```

## 8) Confirm API listener on port 9200

```bash
ss -lntp | grep ':9200'
```

## 9) Frontend checks (after publish)

- Open home page over HTTPS.
- Directly refresh a React Router route.
- Verify assets, images and fonts loading.
- Test contact form only after proxy setup.
- Confirm backend failure is never shown as success.
- Confirm job board requests `/abler-api/v1` instead of hitting `api.abler.com.br` directly from the browser.
