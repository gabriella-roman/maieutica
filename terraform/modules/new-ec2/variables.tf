variable "confirm_create_new_infrastructure" {
  description = "Confirma a criacao de infraestrutura AWS nova"
  type        = bool
}

variable "instance_type" {
  description = "Tipo da instancia EC2"
  type        = string
}

variable "key_name" {
  description = "Key Pair para acesso SSH"
  type        = string
}

variable "domain_name" {
  description = "Dominio principal"
  type        = string
}

variable "www_domain_name" {
  description = "Dominio WWW"
  type        = string
}

variable "admin_cidr" {
  description = "CIDR administrativo para SSH"
  type        = string
}

variable "contact_api_url" {
  description = "URL opcional para proxy de /api/contact na EC2 nova"
  type        = string
  default     = ""
}

variable "common_tags" {
  description = "Tags padrao"
  type        = map(string)
}
