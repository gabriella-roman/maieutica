resource "terraform_data" "creation_guard" {
  lifecycle {
    precondition {
      condition     = var.confirm_create_new_infrastructure
      error_message = "Este projeto cria uma EC2 nova. Defina confirm_create_new_infrastructure=true somente apos revisao humana."
    }
  }
}

data "aws_vpc" "default" {
  default = true
}

data "aws_subnets" "default" {
  filter {
    name   = "vpc-id"
    values = [data.aws_vpc.default.id]
  }
}

data "aws_ami" "ubuntu_2204" {
  most_recent = true
  owners      = ["099720109477"]

  filter {
    name   = "name"
    values = ["ubuntu/images/hvm-ssd/ubuntu-jammy-22.04-amd64-server-*"]
  }

  filter {
    name   = "virtualization-type"
    values = ["hvm"]
  }
}

resource "aws_security_group" "web" {
  depends_on = [terraform_data.creation_guard]

  name        = "maieutica-web-sg"
  description = "Security group para nova infraestrutura web"
  vpc_id      = data.aws_vpc.default.id

  ingress {
    description = "HTTP"
    from_port   = 80
    to_port     = 80
    protocol    = "tcp"
    cidr_blocks = ["0.0.0.0/0"]
  }

  ingress {
    description = "HTTPS"
    from_port   = 443
    to_port     = 443
    protocol    = "tcp"
    cidr_blocks = ["0.0.0.0/0"]
  }

  ingress {
    description = "SSH"
    from_port   = 22
    to_port     = 22
    protocol    = "tcp"
    cidr_blocks = [var.admin_cidr]
  }

  egress {
    from_port   = 0
    to_port     = 0
    protocol    = "-1"
    cidr_blocks = ["0.0.0.0/0"]
  }

  tags = merge(var.common_tags, {
    Name = "maieutica-web-sg"
  })
}

resource "aws_instance" "web" {
  depends_on = [terraform_data.creation_guard]

  ami                    = data.aws_ami.ubuntu_2204.id
  instance_type          = var.instance_type
  subnet_id              = data.aws_subnets.default.ids[0]
  vpc_security_group_ids = [aws_security_group.web.id]
  key_name               = var.key_name

  root_block_device {
    volume_type           = "gp3"
    volume_size           = 20
    delete_on_termination = true
  }

  user_data = templatefile("${path.module}/user-data.sh.tftpl", {
    security_headers_conf = file("${path.root}/../nginx/new-ec2/security-headers.conf")
    nginx_site_conf = templatefile("${path.root}/../nginx/new-ec2/maieuticarh.conf.tftpl", {
      domain_name     = var.domain_name
      www_domain_name = var.www_domain_name
      contact_api_url = var.contact_api_url
    })
  })

  tags = merge(var.common_tags, {
    Name = "maieutica-web-server"
  })
}

resource "aws_eip" "web" {
  depends_on = [terraform_data.creation_guard]
  domain     = "vpc"

  tags = merge(var.common_tags, {
    Name = "maieutica-web-eip"
  })
}

resource "aws_eip_association" "web" {
  depends_on = [terraform_data.creation_guard]

  instance_id   = aws_instance.web.id
  allocation_id = aws_eip.web.id
}
