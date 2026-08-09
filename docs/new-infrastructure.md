# New Infrastructure (Optional)

This path provisions a brand new EC2 and must not be used for routine updates of the current production EC2.

## Critical warning

- Do not use Terraform apply to update the existing EC2 frontend.
- Existing EC2 deploy flow remains the default:
  - `scripts/deploy-existing-ec2.sh`
  - `scripts/install-nginx-config.sh`

## Safety checks before any Terraform command

```bash
aws sts get-caller-identity
```

Confirm account and environment before any plan/apply.

## Terraform behavior

- Root Terraform instantiates `terraform/modules/new-ec2`.
- `confirm_create_new_infrastructure=false` blocks resource creation.
- Module creates only new resources (EC2, SG, EIP).
- SSH is restricted to `admin_cidr`.
- Public ports are only 80 and 443.
- Port 9200 is not exposed.

## Contact API on new EC2

- New EC2 does not provision emailAPI locally.
- `contact_api_url` is optional and external.
- If `contact_api_url` is empty, `/api/contact` location is not generated.

## Abler API on new EC2

- Frontend traffic should use `/abler-api/v1`.
- Authentication must come from a local Nginx snippet on the server, never from React code.
- Expose only the exact upstream routes required by the frontend.

## User-data behavior

- Installs Nginx and static web root only.
- Installs rendered Nginx config from template files.
- Does not run Certbot automatically.
- Certbot must run only after DNS points to the new EC2.

## Terraform local validation commands

```bash
terraform fmt -check -recursive
terraform init -backend=false
terraform validate
```

## Rollback strategy

- Existing production rollback (frontend): use backup directory `/usr/share/nginx/www/maieuticarh.com.br-backup-20260806`.
- Full infrastructure rollback if needed: AMI `ami-0e482c001e60934fc`.
