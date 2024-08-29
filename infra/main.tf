provider "aws" {
  region = var.aws_region
}

variable "aws_region" {
  description = "The AWS region to deploy resources in"
  default     = "sa-east-1"
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

# Cria um VPC
resource "aws_vpc" "main" {
  cidr_block           = "10.0.0.0/16"
  enable_dns_support   = true
  enable_dns_hostnames = true

  tags = {
    Name = "main-vpc"
  }
}

# Cria uma Internet Gateway
resource "aws_internet_gateway" "main" {
  vpc_id = aws_vpc.main.id

  tags = {
    Name = "main-igw"
  }
}

# Cria uma Route Table
resource "aws_route_table" "main" {
  vpc_id = aws_vpc.main.id

  route {
    cidr_block = "0.0.0.0/0"
    gateway_id = aws_internet_gateway.main.id
  }

  tags = {
    Name = "main-route-table"
  }
}

# Cria Subnet 1
resource "aws_subnet" "subnet_1" {
  vpc_id            = aws_vpc.main.id
  cidr_block        = "10.0.1.0/24"
  availability_zone = "${var.aws_region}a"

  tags = {
    Name = "main-subnet-1"
  }
}

# Cria Subnet 2
resource "aws_subnet" "subnet_2" {
  vpc_id            = aws_vpc.main.id
  cidr_block        = "10.0.2.0/24"
  availability_zone = "${var.aws_region}b"

  tags = {
    Name = "main-subnet-2"
  }
}

# Associa Subnet 1 com a Route Table
resource "aws_route_table_association" "subnet_1_association" {
  subnet_id      = aws_subnet.subnet_1.id
  route_table_id = aws_route_table.main.id
}

# Associa Subnet 2 com a Route Table
resource "aws_route_table_association" "subnet_2_association" {
  subnet_id      = aws_subnet.subnet_2.id
  route_table_id = aws_route_table.main.id
}

# Cria um Security Group
resource "aws_security_group" "ecs_security_group" {
  vpc_id      = aws_vpc.main.id
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
    subnets         = [aws_subnet.subnet_1.id, aws_subnet.subnet_2.id]
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
