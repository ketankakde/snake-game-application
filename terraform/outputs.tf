output "public_ip" {
  value = module.ec2.public_ip 
}
output "public_dns" { 
  value = module.ec2.public_dns 
}
