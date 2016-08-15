### poc-sqs-web-worker-harbor

A proof-of-concept/reference app written in node.js that demonstrates a queue-based architecture.

Characteristics:

- written in node
- web app writes messages to an SQS queue
- worker app polls and processes SQS queue messages
- use docker-compose to run/test app locally in Docker
- use harbor-compose to deploy a single "app" to Harbor made up of two separate shipments that can be scaled independently

Usage:

- Create an SQS queue and a service account user with least privilege access.

```
$ cd environment/dev
$ terraform apply
```

- Obtain `AWS_ACCESS_KEY_ID` and `AWS_SECRET_ACCESS_KEY` from `.tfstate` file and add to `docker-compose.yml`.

- Build, test, and push docker images

```
$ docker-compose build
$ docker-compose up
$ docker-compose down
$ docker-compose push
```

- Deploy to Harbor

```
$ harbor-compose up
```