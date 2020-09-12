output "swingify-private-ip" {
  value = module.swingify.private-ip
}

output "swingify-public-ip" {
  value = aws_eip.swingify-eip.public_ip
}
