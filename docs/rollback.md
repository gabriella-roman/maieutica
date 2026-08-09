# Rollback Procedures

## Fast frontend rollback

Use this first when deployment introduces site issues.

1. Move or remove problematic published directory.
2. Restore backup directory:

```bash
sudo mv /usr/share/nginx/www/maieuticarh.com.br /usr/share/nginx/www/maieuticarh.com.br-failed-$(date +%Y%m%d-%H%M%S)
sudo cp -a /usr/share/nginx/www/maieuticarh.com.br-backup-20260806 /usr/share/nginx/www/maieuticarh.com.br
```

3. Validate and reload Nginx:

```bash
sudo nginx -t
sudo systemctl reload nginx
```

## Full rollback with AMI (last resort)

AMI backup available:

- `ami-0e482c001e60934fc`
- Name: `backup-maieuticarh-antes-novo-site`

Use only when local web backup recovery is insufficient.

## API preservation checks after rollback

```bash
pm2 describe emailAPI
ss -lntp | grep ':9200'
```

## Abler token rollback note

- Do not restore an old exposed token.
- If a token was previously committed or shared, rotate it before re-enabling Abler traffic.
