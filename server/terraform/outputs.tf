output "spotify-manager-private-ip" {
  value = module.spotify-manager.private-ip
}

output "spotify-manager-public-ip" {
  value = aws_eip.spotify-manager-eip.public_ip
}

output "core-private-ip" {
  value = module.core.private-ip
}
