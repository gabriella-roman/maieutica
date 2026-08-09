output "instance_id" {
  description = "ID da instância EC2"
  value       = module.new_ec2.instance_id
}

output "public_ip" {
  description = "Elastic IP público associado à instância"
  value       = module.new_ec2.public_ip
}

output "public_dns" {
  description = "DNS público da instância"
  value       = module.new_ec2.public_dns
}

output "ssh_command" {
  description = "Comando SSH para conectar na instância"
  value       = "ssh -i ~/.ssh/${var.key_name}.pem ubuntu@${module.new_ec2.public_ip}"
}

output "nginx_status_command" {
  description = "Verificar status do Nginx"
  value       = "ssh -i ~/.ssh/${var.key_name}.pem ubuntu@${module.new_ec2.public_ip} 'sudo systemctl status nginx'"
}

output "elastic_ip_allocation_id" {
  description = "Allocation ID do Elastic IP"
  value       = module.new_ec2.elastic_ip_allocation_id
}
