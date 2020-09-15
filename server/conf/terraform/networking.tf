resource "aws_internet_gateway" "swingify" {
  vpc_id = aws_vpc.swingify.id
}

resource "aws_route_table" "allow-outgoing-access" {
  vpc_id = aws_vpc.swingify.id

  route {
    cidr_block = "0.0.0.0/0"
    gateway_id = aws_internet_gateway.swingify.id
  }

  tags = {
    Name = "Route Table Allowing Outgoing Access"
  }
}

resource "aws_route_table_association" "swingify-subnet-public" {
  subnet_id      = aws_subnet.swingify-subnet-public.id
  route_table_id = aws_route_table.allow-outgoing-access.id
}

resource "aws_route_table_association" "swingify-subnet-private-1" {
  subnet_id      = aws_subnet.swingify-subnet-private-1.id
  route_table_id = aws_route_table.allow-outgoing-access.id
}

resource "aws_security_group" "allow-internal-core" {
  name        = "allow-internal-core"
  description = "Allow internal HTTP requests to Core"
  vpc_id      = aws_vpc.swingify.id

  ingress {
    from_port   = 1337
    to_port     = 1337
    protocol    = "tcp"
    cidr_blocks = [aws_vpc.swingify.cidr_block]
  }
}

resource "aws_security_group" "allow-internal-spotify" {
  name        = "allow-internal-spotify"
  description = "Allow internal HTTP requests to Spotify Manager"
  vpc_id      = aws_vpc.swingify.id

  ingress {
    from_port   = 7200
    to_port     = 7200
    protocol    = "tcp"
    cidr_blocks = [aws_vpc.swingify.cidr_block]
  }
}

resource "aws_security_group" "allow-internal-mongo" {
  name        = "allow-internal-mongo"
  description = "Allow internal MongoDB requests"
  vpc_id      = aws_vpc.swingify.id

  ingress {
    from_port   = 27017
    to_port     = 27017
    protocol    = "tcp"
    cidr_blocks = [aws_vpc.swingify.cidr_block]
  }
}

resource "aws_security_group" "allow-http" {
  name        = "allow-http"
  description = "Allow HTTP inbound traffic"
  vpc_id      = aws_vpc.swingify.id

  ingress {
    from_port   = 80
    to_port     = 80
    protocol    = "tcp"
    cidr_blocks = ["0.0.0.0/0"]
  }
}

resource "aws_security_group" "allow-ssh" {
  name        = "allow-ssh"
  description = "Allow SSH inbound traffic"
  vpc_id      = aws_vpc.swingify.id

  ingress {
    from_port   = 22
    to_port     = 22
    protocol    = "tcp"
    cidr_blocks = ["0.0.0.0/0"]
  }
}

resource "aws_security_group" "allow-all-outbound" {
  name        = "allow-all-outbound"
  description = "Allow all outbound traffic"
  vpc_id      = aws_vpc.swingify.id

  egress {
    from_port   = 0
    to_port     = 0
    protocol    = "-1"
    cidr_blocks = ["0.0.0.0/0"]
  }
}

resource "aws_subnet" "swingify-subnet-public" {
  availability_zone_id = "euw3-az1"
  cidr_block           = "10.0.0.0/24"
  vpc_id               = aws_vpc.swingify.id

  tags = {
    Name = "Swingify Subnet (Public)"
  }
}

resource "aws_subnet" "swingify-subnet-private-1" {
  availability_zone_id = "euw3-az1"
  cidr_block           = "10.0.1.0/24"
  vpc_id               = aws_vpc.swingify.id

  tags = {
    Name = "Swingify Subnet (Private 1)"
  }
}

resource "aws_subnet" "swingify-subnet-private-2" {
  availability_zone_id = "euw3-az2"
  cidr_block           = "10.0.2.0/24"
  vpc_id               = aws_vpc.swingify.id

  tags = {
    Name = "Swingify Subnet (Private 2)"
  }
}

resource "aws_vpc" "swingify" {
  cidr_block           = "10.0.0.0/16"
  enable_dns_hostnames = true

  tags = {
    Name = "Swingify VPC"
  }
}
