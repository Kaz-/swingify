data "template_file" "userdata" {
  template = <<EOF
    #!/bin/bash
    echo ${base64encode(file("../docker/docker_credentials.txt"))} | base64 --decode > /tmp/docker_credentials.txt
    cd /tmp
    echo '#!/bin/bash
    source ~/.bashrc
    sudo yum update -y
    sudo amazon-linux-extras install docker
    sudo systemctl start docker 
    sudo usermod -a -G docker ec2-user
    sudo curl -L "https://github.com/docker/compose/releases/download/1.27.1/docker-compose-$(uname -s)-$(uname -m)" -o /usr/local/bin/docker-compose
    sudo chmod +x /usr/local/bin/docker-compose
    sudo amazon-linux-extras install nginx1
    sudo systemctl start nginx
    sudo yum install -y https://dl.fedoraproject.org/pub/epel/epel-release-latest-7.noarch.rpm
    sudo yum install -y certbot python2-certbot-nginx' >> init.sh
    chmod +x init.sh
    /bin/su -c "/tmp/init.sh" - ec2-user
    cat /tmp/docker_credentials.txt | docker login --username nohanna --password-stdin
    docker pull nohanna/swingify:core
    docker pull nohanna/swingify:spotify-manager
    rm docker_credentials.txt init.sh
  EOF
}

resource "aws_instance" "default" {
  ami                    = var.ami-id
  iam_instance_profile   = var.iam-instance-profile
  instance_type          = var.instance-type
  key_name               = var.key-pair
  private_ip             = var.private-ip
  subnet_id              = var.subnet-id
  vpc_security_group_ids = var.vpc-security-group-ids

  user_data = data.template_file.userdata.rendered

  tags = {
    Name = var.name
  }
}


