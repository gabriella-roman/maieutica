terraform {
  required_version = ">= 1.4.0"

  required_providers {
    aws = {
      source  = "hashicorp/aws"
      version = "~> 5.0"
    }
  }
}

provider "aws" {
  region = var.aws_region
}

locals {
  common_tags = {
    Project     = var.project_name
    Environment = "production"
  }
}

module "new_ec2" {
  source = "./modules/new-ec2"

  confirm_create_new_infrastructure = var.confirm_create_new_infrastructure
  instance_type                     = var.instance_type
  key_name                          = var.key_name
  domain_name                       = var.domain_name
  www_domain_name                   = var.www_domain_name
  admin_cidr                        = var.admin_cidr
  contact_api_url                   = var.contact_api_url
  common_tags                       = local.common_tags
}
