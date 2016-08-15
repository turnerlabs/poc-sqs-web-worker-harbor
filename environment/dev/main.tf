provider "aws" {
  region = "us-east-1"
  profile = "corp-sandbox"
}

resource "aws_sqs_queue" "queue" {  
  name = "poc-sqs-web-worker-harbor"
  visibility_timeout_seconds = 120
  delay_seconds = 0
  max_message_size = 262144
  message_retention_seconds = 86400
  receive_wait_time_seconds = 20 
}

# we need a service account user for queue access
resource "aws_iam_user" "user" {
  name = "srv_dev_poc-sqs-web-worker-harbor"
}

# generate keys for service account user
resource "aws_iam_access_key" "user_keys" {
  user = "${aws_iam_user.user.name}"
}

# grant queue access to service account user
resource "aws_iam_user_policy" "sqs_access_policy" {
  name = "poc-sqs-web-worker-harbor"
  user = "${aws_iam_user.user.name}"
    policy = <<EOF
{
  "Version": "2012-10-17",
  "Statement": [
    {
      "Effect": "Allow",
      "Action": [
        "SQS:SendMessage",
        "SQS:ReceiveMessage",
        "SQS:DeleteMessage"
      ],
      "Resource": "${aws_sqs_queue.queue.arn}"
    }
  ]
}
EOF
}
