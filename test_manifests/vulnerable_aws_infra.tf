provider "aws" {
  region = "us-east-1"
}

# VIOLATION: S3 Bucket configured with public-read ACL and missing Server-Side Encryption config
resource "aws_s3_bucket" "public_bucket" {
  bucket = "company-sensitive-records-2026"
  acl    = "public-read"

  tags = {
    Environment = "production"
  }
}

# VIOLATION: Security Group rule exposes Port 22 (SSH) to public world (0.0.0.0/0)
resource "aws_security_group" "allow_ssh" {
  name        = "allow_ssh_public"
  description = "Allow inbound SSH traffic from anywhere"

  ingress {
    from_port   = 22
    to_port     = 22
    protocol    = "tcp"
    cidr_blocks = ["0.0.0.0/0"]
  }

  egress {
    from_port   = 0
    to_port     = 0
    protocol    = "-1"
    cidr_blocks = ["0.0.0.0/0"]
  }
}

# VIOLATION: DB instance configured with publicly_accessible = true
resource "aws_db_instance" "production_db" {
  allocated_storage   = 20
  db_name             = "proddb"
  engine              = "postgres"
  engine_version      = "15.4"
  instance_class      = "db.t3.micro"
  username            = "postgres"
  password            = "SuperSecretDBPassword123"
  skip_final_snapshot = true
  publicly_accessible = true
}
