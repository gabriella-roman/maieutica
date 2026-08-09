variable "aws_region" {
  description = "Região AWS"
  type        = string
  default     = "us-east-1"
}

variable "instance_type" {
  description = "Tipo de instância EC2 (usar t3.micro para Free Tier)"
  type        = string
  default     = "t3.micro"
}

variable "confirm_create_new_infrastructure" {
  description = "Confirma a criacao de infraestrutura AWS nova"
  type        = bool
  default     = false
}

variable "key_name" {
  description = "Nome da chave SSH para acesso à instância (Key Pair da AWS)"
  type        = string
}

variable "domain_name" {
  description = "Domínio principal da aplicação"
  type        = string
  default     = "maieuticarh.com.br"
}

variable "www_domain_name" {
  description = "Domínio WWW da aplicação"
  type        = string
  default     = "www.maieuticarh.com.br"
}

variable "admin_cidr" {
  description = "CIDR administrativo autorizado para SSH (ex.: 203.0.113.10/32)"
  type        = string

  validation {
    condition = (
      can(regex("^([0-9]{1,3}\\.){3}[0-9]{1,3}/32$", var.admin_cidr)) &&
      can(cidrhost(var.admin_cidr, 0)) &&
      var.admin_cidr != "0.0.0.0/0"
    )
    error_message = "admin_cidr deve ser um IPv4 CIDR /32 valido (ex.: 203.0.113.10/32) e nao pode ser 0.0.0.0/0."
  }
}

variable "contact_api_url" {
  description = "URL externa opcional para proxy de /api/contact na EC2 nova"
  type        = string
  default     = ""

  validation {
    condition = (
      var.contact_api_url == "" ||
      can(regex("^https?://[^[:space:];]+$", var.contact_api_url))
    )
    error_message = "contact_api_url deve ser vazia ou uma URL HTTP/HTTPS valida, sem espacos ou ponto e virgula."
  }
}

variable "project_name" {
  description = "Nome do projeto"
  type        = string
  default     = "maieutica"
}
