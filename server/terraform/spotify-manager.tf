resource "aws_eip" "spotify-manager-eip" {
  instance = module.spotify-manager.instance-id
}

module "spotify-manager" {
  source = "./node-server"

  ami-id               = "ami-0697b068b80d79421"
  # iam-instance-profile = module.spotify-manager-codedeploy.iam-instance-profile
  key-pair             = aws_key_pair.swingify-key.key_name
  name                 = "spotify-manager"
  subnet-id            = aws_subnet.swingify-subnet-public.id
  vpc-security-group-ids = [
    aws_security_group.allow-http.id,
    aws_security_group.allow-ssh.id,
    aws_security_group.allow-all-outbound.id
  ]
}

# module "spotify-manager-codedeploy" {
#   source = "./codedeploy-app"

#   app-name          = "spotify-manager"
#   ec2-instance-name = module.spotify-manager.name
# }