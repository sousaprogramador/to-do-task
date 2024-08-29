provider "aws" {
  region = var.aws_region
}

variable "aws_region" {
  description = "AWS region"
  default     = "sa-east-1"
}

data "aws_vpcs" "all" {}

data "aws_vpc" "existing_vpc" {
  id = data.aws_vpcs.all.ids[0] # Seleciona a primeira VPC encontrada
}

data "aws_subnets" "all" {
  filter {
    name   = "vpc-id"
    values = [data.aws_vpc.existing_vpc.id]
  }
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
}

data "aws_iam_role" "existing_iam_role" {
  name = "ecsTaskExecutionRole"
}

resource "aws_iam_role" "ecs_task_execution_role" {
  count = length([for id in [data.aws_iam_role.existing_iam_role.arn] : id if id != "" ? 1 : 0])

  name = "ecsTaskExecutionRole"

  assume_role_policy = jsonencode({
    Version = "2012-10-17",
    Statement = [{
      Action = "sts:AssumeRole"
      Effect = "Allow"
      Principal = {
        Service = "ecs-tasks.amazonaws.com"
      }
    }]
  })
}

resource "aws_ecs_cluster" "this" {
  name = "my-nestjs-cluster"
}

resource "aws_ecs_task_definition" "this" {
  family                   = "my-nestjs-task"
  network_mode             = "awsvpc"
  requires_compatibilities = ["FARGATE"]
  cpu                      = "256"
  memory                   = "512"

  container_definitions = jsonencode([{
    name      = "nestjs-app"
    image     = "${aws_ecr_repository.nestjs_app.repository_url}:latest"
    essential = true
    portMappings = [{
      containerPort = 3333
      hostPort      = 3333
    }]
  }])

  execution_role_arn = aws_iam_role.ecs_task_execution_role[0].arn
}

resource "aws_ecs_service" "this" {
  name            = "my-nestjs-service"
  cluster         = aws_ecs_cluster.this.id
  task_definition = aws_ecs_task_definition.this.arn
  desired_count   = 1
  launch_type     = "FARGATE"

  network_configuration {
    subnets         = data.aws_subnets.all.ids
    security_groups = [aws_security_group.ecs_security_group.id]
  }
}

resource "aws_security_group" "ecs_security_group" {
  name        = "ecs-security-group"
  description = "Allow traffic to ECS tasks"
  vpc_id      = data.aws_vpc.existing_vpc.id

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
}

output "ecr_repository_uri" {
  value = aws_ecr_repository.nestjs_app.repository_url
}

output "security_group_id" {
  value = aws_security_group.ecs_security_group.id
}
