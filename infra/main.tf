provider "aws" {
  region = "sa-east-1"
}

# Declaração da variável aws_region
variable "aws_region" {
  type    = string
  default = "sa-east-1"
}

# Tenta obter o repositório ECR se ele existir
data "aws_ecr_repository" "nestjs_app" {
  name = "nestjs-app-repo"
}

# Recurso condicional que cria o ECR somente se ele não existir
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

  # Executa apenas se o repositório não for encontrado
  triggers = {
    ecr_exists = data.aws_ecr_repository.nestjs_app.repository_url == "" ? "false" : "true"
  }
}

# Utilize o repositório ECR que já existe ou foi criado
resource "aws_ecr_repository" "nestjs_app" {
  count = data.aws_ecr_repository.nestjs_app.repository_url == "" ? 1 : 0

  name = "nestjs-app-repo"

  lifecycle {
    prevent_destroy = true
  }
}

output "ecr_repository_uri" {
  value = data.aws_ecr_repository.nestjs_app.repository_url != "" ? data.aws_ecr_repository.nestjs_app.repository_url : aws_ecr_repository.nestjs_app[0].repository_url
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

  container_definitions = jsonencode([
    {
      name      = "nestjs-app"
      image     = "${data.aws_ecr_repository.nestjs_app.repository_url != "" ? data.aws_ecr_repository.nestjs_app.repository_url : aws_ecr_repository.nestjs_app[0].repository_url}:latest"
      essential = true
      portMappings = [
        {
          containerPort = 3333
          hostPort      = 3333
        }
      ]
    }
  ])

  execution_role_arn = aws_iam_role.ecs_task_execution_role.arn
}

resource "aws_ecs_service" "this" {
  name            = "my-nestjs-service"
  cluster         = aws_ecs_cluster.this.id
  task_definition = aws_ecs_task_definition.this.arn
  desired_count   = 1
  launch_type     = "FARGATE"

  network_configuration {
    subnets         = ["subnet-12345678", "subnet-87654321"]
    security_groups = [aws_security_group.ecs_security_group.id]
  }
}

resource "aws_iam_role" "ecs_task_execution_role" {
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

resource "aws_security_group" "ecs_security_group" {
  name        = "ecs-security-group"
  description = "Allow traffic to ECS tasks"
  vpc_id      = "vpc-12345678"

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
