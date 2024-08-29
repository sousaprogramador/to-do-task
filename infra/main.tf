provider "aws" {
  region = "sa-east-1"
}

resource "aws_ecr_repository" "nestjs_app" {
  name = "nestjs-app-repo"

  lifecycle {
    prevent_destroy = true
  }
}

output "ecr_repository_uri" {
  value = aws_ecr_repository.nestjs_app.repository_url
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
      image     = "${aws_ecr_repository.nestjs_app.repository_url}:latest"
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

output "ecr_repository_uri" {
  value = aws_ecr_repository.nestjs_app.repository_url
}
