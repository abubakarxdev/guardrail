provider "aws" {
  region = "us-east-1"
}

# VIOLATION: IAM Policy allowing wildcard Actions
resource "aws_iam_policy" "admin_policy" {
  name        = "super_admin_policy"
  description = "Allows everything"

  policy = jsonencode({
    Version = "2012-10-17"
    Statement = [
      {
        Action   = "*"
        Effect   = "Allow"
        Resource = "*"
      },
    ]
  })
}

# VIOLATION: IAM Policy allowing wildcard Resources
resource "aws_iam_policy" "read_all_data" {
  name        = "read_all_data_policy"
  description = "Allows reading from any resource"

  policy = jsonencode({
    Version = "2012-10-17"
    Statement = [
      {
        Action = [
          "s3:GetObject",
          "dynamodb:GetItem",
          "rds:DescribeDBInstances"
        ]
        Effect   = "Allow"
        Resource = ["*"]
      },
    ]
  })
}

# Inline JSON representation (testing fallback string parser)
resource "aws_iam_role" "test_role" {
  name = "test_role"

  assume_role_policy = <<EOF
{
  "Version": "2012-10-17",
  "Statement": [
    {
      "Action": "sts:AssumeRole",
      "Principal": {
        "Service": "ec2.amazonaws.com"
      },
      "Effect": "Allow"
    }
  ]
}
EOF
}

resource "aws_iam_role_policy" "inline_wildcard" {
  name = "inline_wildcard"
  role = aws_iam_role.test_role.id

  # VIOLATION: wildcard action in inline JSON
  policy = <<EOF
{
  "Version": "2012-10-17",
  "Statement": [
    {
      "Action": ["*"],
      "Effect": "Allow",
      "Resource": "arn:aws:s3:::my-bucket/*"
    }
  ]
}
EOF
}
