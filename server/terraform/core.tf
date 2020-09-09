resource "aws_eip" "core-eip" {
  instance = module.core.instance-id
}

module "core" {
  source = "./node-server"

  ami-id               = "ami-0697b068b80d79421"
  # iam-instance-profile = module.core-codedeploy.iam-instance-profile
  key-pair             = aws_key_pair.swingify-key.key_name
  name                 = "core"
  private-ip           = "10.0.1.5"
  subnet-id            = aws_subnet.swingify-subnet-private-1.id
  vpc-security-group-ids = [
    aws_security_group.allow-internal-http.id,
    aws_security_group.allow-ssh.id,
    aws_security_group.allow-all-outbound.id
  ]
}

# module "core-codedeploy" {
#   source = "./codedeploy-app"

#   app-name          = "core"
#   ec2-instance-name = module.core.name
# }
