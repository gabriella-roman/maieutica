# Terraform Audit (Read-Only)

Date: 2026-08-06
Region target: us-east-1

## Scope and safety

- This audit is static (file review only).
- No AWS API mutation was executed.
- No `terraform apply`, `terraform import`, or `terraform destroy` was executed.

## Files audited

- `terraform/main.tf`
- `terraform/variables.tf`
- `terraform/security-group.tf`
- `terraform/ec2.tf`
- `terraform/eip.tf`
- `terraform/outputs.tf`
- `terraform/user-data.sh`
- `terraform/terraform.tfvars.example`
- `terraform/.terraform.lock.hcl`
- Historical local state files moved to external safe backup:
  - `terraform/terraform.tfstate`
  - `terraform/terraform.tfstate.backup`

## Terraform resources declared by current code

Managed resources:

- `aws_security_group.maieutica_web_sg`
  - Opens ports 80 and 443 to the internet.
  - Opens port 22 only to `var.admin_cidr`.
- `aws_instance.maieutica_web_server`
  - Creates a new EC2 instance from Ubuntu 22.04 AMI.
  - Uses first subnet from default VPC subnets data source.
- `aws_eip.maieutica_web_eip`
  - Allocates a new Elastic IP in VPC scope.
- `aws_eip_association.maieutica_web_eip_assoc`
  - Associates allocated Elastic IP to created EC2 instance.

Data sources:

- `data.aws_vpc.default`
- `data.aws_subnets.default`
- `data.aws_ami.ubuntu_2204`

Outputs:

- `instance_id`
- `public_ip` (from Elastic IP)
- `public_dns` (from instance)
- `ssh_command`
- `nginx_status_command`
- `elastic_ip_allocation_id`

## Risk assessment

1. Current Terraform is an optional "new infrastructure" module.
2. It is not bound to the current production EC2 (`52.206.204.172`) by default.
3. Running `terraform apply` in this folder would create a separate EC2 + EIP + SG unless manually reconciled.
4. Therefore, the existing production EC2 must not be replaced by this module in the current migration plan.

## State findings

- `terraform.tfstate` was empty in resources.
- `terraform.tfstate.backup` contained historical resource addresses and account metadata from a prior environment.
- Keeping state files in repository is unsafe and can leak infrastructure metadata.
- Both state files were moved outside repository to:
  - `e:/Projetos/maieutica-safe-state-backups/<timestamp>/`

## Recommendation

- Default operational path: deploy to existing EC2 using `scripts/deploy-existing-ec2.sh`.
- Keep Terraform as optional module for isolated future environments.
- Creation guard is explicit: `confirm_create_new_infrastructure` defaults to `false` and blocks accidental new EC2 creation.
- Before any Terraform command against AWS, verify account/identity:

```bash
aws sts get-caller-identity
terraform init
terraform plan
```

- Only proceed with human approval after plan review.

## Port 9200 hardening (after proxy validation)

- Keep current exposure during migration validation window.
- After `/api/contact` is fully validated, remove inbound public `9200` rule from production Security Group in a controlled change.
- Prefer Node service binding to localhost (`127.0.0.1`) in a future maintenance window.
