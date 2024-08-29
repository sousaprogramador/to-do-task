provider "aws" {
  region = "sa-east-1"
}

# Criação da VPC
resource "aws_vpc" "main" {
  cidr_block = "10.0.0.0/16"

  tags = {
    Name = "main-vpc"
  }
}

# Criação de um Internet Gateway para a VPC
resource "aws_internet_gateway" "main" {
  vpc_id = aws_vpc.main.id

  tags = {
    Name = "main-igw"
  }
}

# Criação de uma rota principal para a VPC
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

# Criação de duas subnets públicas
resource "aws_subnet" "subnet_1" {
  vpc_id            = aws_vpc.main.id
  cidr_block        = "10.0.1.0/24"
  availability_zone = "sa-east-1a"

  tags = {
    Name = "main-subnet-1"
  }
}

resource "aws_subnet" "subnet_2" {
  vpc_id            = aws_vpc.main.id
  cidr_block        = "10.0.2.0/24"
  availability_zone = "sa-east-1b"

  tags = {
    Name = "main-subnet-2"
  }
}

# Associação das subnets à tabela de rotas
resource "aws_route_table_association" "subnet_1_association" {
  subnet_id      = aws_subnet.subnet_1.id
  route_table_id = aws_route_table.main.id
}

resource "aws_route_table_association" "subnet_2_association" {
  subnet_id      = aws_subnet.subnet_2.id
  route_table_id = aws_route_table.main.id
}

# Criação do Security Group utilizando a VPC criada
resource "aws_security_group" "ecs_security_group" {
  name        = "ecs-security-group"
  description = "Allow traffic to ECS tasks"
  vpc_id      = aws_vpc.main.id

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

# Verifica se o IAM Role já existe
data "aws_iam_role" "existing_iam_role" {
  name = "ecsTaskExecutionRole"
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

# Criação do IAM Role condicionalmente
resource "aws_iam_role" "ecs_task_execution_role" {
  count = length(data.aws_iam_role.existing_iam_role.name) > 0 ? 0 : 1

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

# Criação do cluster ECS
resource "aws_ecs_cluster" "this" {
  name = "my-nestjs-cluster"
}

# Criação da task definition ECS
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

  execution_role_arn = length(aws_iam_role.ecs_task_execution_role) > 0 ? aws_iam_role.ecs_task_execution_role[0].arn : data.aws_iam_role.existing_iam_role.arn
}

# Criação do serviço ECS com subnets válidas
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
}
