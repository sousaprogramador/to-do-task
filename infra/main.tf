provider "aws" {
  region = var.aws_region
}

variable "aws_region" {
  description = "The AWS region to deploy resources in"
  default     = "sa-east-1"
}

variable "vpc_id" {
  description = "ID of an existing VPC"
}

variable "subnet_ids" {
  description = "List of Subnet IDs in the existing VPC"
  type        = list(string)
}

data "aws_vpc" "existing_vpc" {
  id = var.vpc_id
}

data "aws_subnet_ids" "existing_subnets" {
  vpc_id = var.vpc_id
}

# Verifica se o repositório ECR já existe e cria se necessário
data "aws_ecr_repository" "nestjs_app" {
  name = "nestjs-app-repo"
}

resource "null_resource" "create_ecr_if_not_exists" {
  provisioner "local-exec" {
    command = <<EOT
      if aws ecr describe-repositories --repository-names nestjs-app-repo --region ${var.aws_region} >/dev/null 2>&1; then
        echo "ECR repository already exists, skipping creation."
      else
        echo "ECR repository does not exist, creating..."
        aws ecr create-repository --repository-name nestjs-app-repo --region ${var.aws_region}
      fi
    EOT
  }

  triggers = {
    ecr_exists = data.aws_ecr_repository.nestjs_app.id != "" ? "true" : "false"
  }
}

# Cria um Security Group
resource "aws_security_group" "ecs_security_group" {
  vpc_id      = data.aws_vpc.existing_vpc.id
  name        = "ecs-security-group"
  description = "Allow traffic to ECS tasks"

  ingress {
    from_port   = 3333
    to_port     = 3333
    protocol    = "tcp"
    cidr_blocks = ["0.0.0.0/0"]
  }

  egress {
    from_port   = 0
    to_port     = 0
    protocol    = "-1"
    cidr_blocks = ["0.0.0.0/0"]
  }

  tags = {
    Name = "ecs-security-group"
  }
}

# Cria um ECS Cluster
resource "aws_ecs_cluster" "this" {
  name = "my-nestjs-cluster"
}

# Verifica se a IAM Role já existe
data "aws_iam_role" "existing_iam_role" {
  name = "ecsTaskExecutionRole"
}

resource "aws_iam_role" "ecs_task_execution_role" {
  count = length(data.aws_iam_role.existing_iam_role.id) == 0 ? 1 : 0

  name = "ecsTaskExecutionRole"

  assume_role_policy = jsonencode({
    Version = "2012-10-17",
    Statement = [
      {
        Action = "sts:AssumeRole"
        Effect = "Allow"
        Principal = {
          Service = "ecs-tasks.amazonaws.com"
        }
      }
    ]
  })
}

# Cria uma Task Definition
resource "aws_ecs_task_definition" "this" {
  family                   = "my-nestjs-task"
  network_mode             = "awsvpc"
  requires_compatibilities = ["FARGATE"]
  cpu                      = "256"
  memory                   = "512"
  execution_role_arn       = length(data.aws_iam_role.existing_iam_role.id) == 0 ? aws_iam_role.ecs_task_execution_role[0].arn : data.aws_iam_role.existing_iam_role.arn

  container_definitions = jsonencode([
    {
      name      = "nestjs-app"
      image     = "${data.aws_ecr_repository.nestjs_app.repository_url}:latest"
      essential = true
      portMappings = [
        {
          containerPort = 3333
          hostPort      = 3333
        }
      ]
    }
  ])
}

# Cria um ECS Service
resource "aws_ecs_service" "this" {
  name            = "my-nestjs-service"
  cluster         = aws_ecs_cluster.this.id
  task_definition = aws_ecs_task_definition.this.arn
  desired_count   = 1
  launch_type     = "FARGATE"

  network_configuration {
    subnets         = var.subnet_ids
    security_groups = [aws_security_group.ecs_security_group.id]
  }

  lifecycle {
    ignore_changes = [
      desired_count,
      task_definition,
    ]
  }

  depends_on = [
    aws_ecs_task_definition.this,
    aws_ecs_cluster.this,
    aws_security_group.ecs_security_group,
  ]
}

output "ecr_repository_uri" {
  value       = data.aws_ecr_repository.nestjs_app.repository_url
  description = "URI do repositório ECR"
}

output "security_group_id" {
  value       = aws_security_group.ecs_security_group.id
  description = "ID do Security Group para a aplicação ECS"
}
