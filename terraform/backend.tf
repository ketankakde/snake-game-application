terraform {
  backend "s3" {
    bucket         = "ketan-ki-s3-bucket"
    key            = "teraform.tfstate"
    region         = "us-east-1"
  }
}
