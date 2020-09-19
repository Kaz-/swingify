resource "aws_eip" "swingify-eip" {
  instance = module.swingify.instance-id
}

module "swingify" {
  source = "./node-server"

  ami-id               = "ami-0697b068b80d79421"
  key-pair             = aws_key_pair.swingify-key.key_name
  name                 = "swingify"
  subnet-id            = aws_subnet.swingify-subnet-public.id
  vpc-security-group-ids = [
    aws_security_group.allow-http.id,
    aws_security_group.allow-ssh.id,
    aws_security_group.allow-all-outbound.id
  ]
}
