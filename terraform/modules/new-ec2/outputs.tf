output "instance_id" {
  description = "ID da instancia EC2 criada"
  value       = aws_instance.web.id
}

output "public_ip" {
  description = "Elastic IP publico associado"
  value       = aws_eip.web.public_ip
}

output "public_dns" {
  description = "DNS publico da instancia"
  value       = aws_instance.web.public_dns
}

output "elastic_ip_allocation_id" {
  description = "Allocation ID do Elastic IP"
  value       = aws_eip.web.id
}

output "security_group_id" {
  description = "ID do Security Group da nova infraestrutura"
  value       = aws_security_group.web.id
}
