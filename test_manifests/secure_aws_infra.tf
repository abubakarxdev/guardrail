provider "aws" {
  region = "us-west-2"
}

# 1. Compliant S3 Bucket (Private, Encrypted)
resource "aws_s3_bucket" "secure_data" {
  bucket = "company-secure-data-2026"
}

resource "aws_s3_bucket_ownership_controls" "secure_data_ownership" {
  bucket = aws_s3_bucket.secure_data.id
  rule {
    object_ownership = "BucketOwnerEnforced"
  }
}

resource "aws_s3_bucket_public_access_block" "secure_data_access" {
  bucket                  = aws_s3_bucket.secure_data.id
  block_public_acls       = true
  block_public_policy     = true
  ignore_public_acls      = true
  restrict_public_buckets = true
}

resource "aws_s3_bucket_server_side_encryption_configuration" "secure_data_encryption" {
  bucket = aws_s3_bucket.secure_data.id
  rule {
    apply_server_side_encryption_by_default {
      sse_algorithm = "AES256"
    }
  }
}

# 2. Compliant RDS Instance (Private)
resource "aws_db_instance" "secure_db" {
  allocated_storage   = 20
  db_name             = "secure_proddb"
  engine              = "postgres"
  engine_version      = "15.4"
  instance_class      = "db.t3.micro"
  username            = "postgres"
  password            = "SuperSecretDBPassword123"
  skip_final_snapshot = true
  publicly_accessible = false  # COMPLIANT
}

# 3. Compliant Security Group (No public SSH/RDP)
resource "aws_security_group" "web_tier" {
  name        = "web_tier_sg"
  description = "Allow HTTPS inbound, deny SSH from public"

  ingress {
    from_port   = 443
    to_port     = 443
    protocol    = "tcp"
    cidr_blocks = ["0.0.0.0/0"] # Public HTTPS is fine
  }

  ingress {
    from_port   = 22
    to_port     = 22
    protocol    = "tcp"
    cidr_blocks = ["10.0.0.0/8"] # SSH restricted to corporate VPN
  }

  egress {
    from_port   = 0
    to_port     = 0
    protocol    = "-1"
    cidr_blocks = ["0.0.0.0/0"]
  }
}

# 4. Compliant IAM Policy (Least Privilege)
resource "aws_iam_policy" "strict_policy" {
  name        = "strict_s3_read"
  description = "Strict read access to specific bucket"

  policy = jsonencode({
    Version = "2012-10-17"
    Statement = [
      {
        Action = [
          "s3:GetObject",
          "s3:ListBucket"
        ]
        Effect   = "Allow"
        Resource = [
          aws_s3_bucket.secure_data.arn,
          "${aws_s3_bucket.secure_data.arn}/*"
        ]
      },
    ]
  })
}
