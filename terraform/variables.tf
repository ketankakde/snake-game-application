variable "region" { 
  default = "us-east-1" 
}
variable "vpc_cidr" { 
  default = "10.0.0.0/16" 
}
variable "subnet_cidr" { 
  default = "10.0.1.0/24" 
}
variable "availability_zone" { 
  default = "us-east-1a" 
}
variable "ami_id" {
  default = "ami-0b6d9d3d33ba97d99" 
}

variable "instance_type" { 
  default = "t3.micro" 
}
variable "key_name" {
  default = "new-key" 
}   
