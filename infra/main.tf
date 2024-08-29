provider "aws" {
  region = "sa-east-1"
}

data "aws_availability_zones" "available" {
  state = "available"
}

resource "aws_ecr_repository" "app_repo" {
  name                 = "my-app-repo"
  image_tag_mutability = "MUTABLE"
  tags = {
    Name = "my-app-repo"
  }
}

data "aws_ecr_image" "latest_image" {
  repository_name = aws_ecr_repository.app_repo.name
  most_recent     = true
}

data "aws_iam_role" "existing_ecs_task_execution_role" {
  name = "ecsTaskExecutionRole"
}

resource "aws_vpc" "main" {
  cidr_block = "10.0.0.0/16"
  tags = {
    Name = "main-vpc"
  }
}

resource "aws_subnet" "public" {
  count                   = 2
  vpc_id                  = aws_vpc.main.id
  cidr_block              = cidrsubnet(aws_vpc.main.cidr_block, 8, count.index)
  map_public_ip_on_launch = true
  availability_zone       = data.aws_availability_zones.available.names[count.index]
  tags = {
    Name = "main-subnet-${count.index}"
  }
}

resource "aws_internet_gateway" "gw" {
  vpc_id = aws_vpc.main.id
  tags = {
    Name = "main-gw"
  }
}

resource "aws_route_table" "public" {
  vpc_id = aws_vpc.main.id
  route {
    cidr_block = "0.0.0.0/0"
    gateway_id = aws_internet_gateway.gw.id
  }
  tags = {
    Name = "main-rt-public"
  }
}

resource "aws_route_table_association" "public" {
  count          = length(aws_subnet.public)
  subnet_id      = element(aws_subnet.public.*.id, count.index)
  route_table_id = aws_route_table.public.id
}

resource "aws_ecs_cluster" "main" {
  name = "main-ecs-cluster"
}

resource "aws_iam_role" "ecs_task_execution_role" {
  count = length(data.aws_iam_role.existing_ecs_task_execution_role.arn) == 0 ? 1 : 0
  name  = "ecsTaskExecutionRole"
  assume_role_policy = jsonencode({
    Version = "2012-10-17"
    Statement = [
      {
        Effect = "Allow"
        Principal = {
          Service = "ecs-tasks.amazonaws.com"
        }
        Action = "sts:AssumeRole"
      }
    ]
  })
  tags = {
    Name = "ecsTaskExecutionRole"
  }
  lifecycle {
    prevent_destroy = true
  }
}

resource "aws_iam_role_policy_attachment" "ecs_task_execution_role_policy" {
  count      = length(data.aws_iam_role.existing_ecs_task_execution_role.arn) == 0 ? 1 : 0
  role       = aws_iam_role.ecs_task_execution_role[0].name
  policy_arn = "arn:aws:iam::aws:policy/service-role/AmazonECSTaskExecutionRolePolicy"
}

resource "aws_ecs_task_definition" "app" {
  family                   = "app-task"
  network_mode             = "awsvpc"
  requires_compatibilities = ["FARGATE"]
  cpu                      = "256"
  memory                   = "512"
  execution_role_arn       = length(data.aws_iam_role.existing_ecs_task_execution_role.arn) > 0 ? data.aws_iam_role.existing_ecs_task_execution_role.arn : aws_iam_role.ecs_task_execution_role[0].arn
  container_definitions = jsonencode([{
    name      = "app-container"
    image     = "${aws_ecr_repository.app_repo.repository_url}:${coalesce(data.aws_ecr_image.latest_image.image_tag, "latest")}"
    essential = true
    portMappings = [{
      containerPort = 80
      hostPort      = 80
    }]
  }])
}

resource "aws_security_group" "ecs_sg" {
  vpc_id = aws_vpc.main.id
  ingress {
    from_port   = 80
    to_port     = 80
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
    Name = "ecs-sg"
  }
}

resource "aws_lb" "app" {
  name               = "app-lb"
  internal           = false
  load_balancer_type = "application"
  security_groups    = [aws_security_group.ecs_sg.id]
  subnets            = aws_subnet.public.*.id
  tags = {
    Name = "app-lb"
  }
}

resource "aws_lb_target_group" "app" {
  name        = "app-tg"
  port        = 80
  protocol    = "HTTP"
  vpc_id      = aws_vpc.main.id
  target_type = "ip"
  health_check {
    path                = "/"
    interval            = 30
    timeout             = 5
    healthy_threshold   = 2
    unhealthy_threshold = 2
  }
  tags = {
    Name = "app-tg"
  }
}

resource "aws_lb_listener" "app" {
  load_balancer_arn = aws_lb.app.arn
  port              = "80"
  protocol          = "HTTP"
  default_action {
    type             = "forward"
    target_group_arn = aws_lb_target_group.app.arn
  }
}

resource "aws_ecs_service" "app" {
  name            = "app-service"
  cluster         = aws_ecs_cluster.main.id
  task_definition = aws_ecs_task_definition.app.arn
  desired_count   = 1
  launch_type     = "FARGATE"
  network_configuration {
    subnets         = aws_subnet.public.*.id
    security_groups = [aws_security_group.ecs_sg.id]
  }
  load_balancer {
    target_group_arn = aws_lb_target_group.app.arn
    container_name   = "app-container"
    container_port   = 80
  }
  depends_on = [aws_lb_listener.app]
}
