terraform {
  backend "s3" {
    # Update this bucket name to your own S3 bucket before running terraform init
    # The bucket must already exist in your AWS account
    bucket         = "your-terraform-state-bucket"
    key            = "terraform.tfstate"
    region         = "us-east-1"
  }
}
