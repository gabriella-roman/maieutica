# Terraform Optional Module (New EC2)

This Terraform root orchestrates the optional module in `terraform/modules/new-ec2`.

It provisions a new EC2 infrastructure and is not the default production deploy flow.

## Safety rules

- Do not use this for routine deploys to the current production EC2.
- Do not run terraform apply without explicit human approval.
- Do not run terraform destroy in production workflows.

## Guard against accidental creation

`confirm_create_new_infrastructure` defaults to `false` and blocks creation.

You must explicitly set all required values and review plan before any apply.

## Existing production flow

Use existing EC2 scripts and configs:

- `scripts/deploy-existing-ec2.sh`
- `scripts/install-nginx-config.sh`
- `scripts/check-secrets.sh`
- `nginx/existing-ec2/maieuticarh.conf.tftpl`
