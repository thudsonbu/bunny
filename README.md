# bunny

A quick example of RabbitMQ and AMQP. The `publisher` adds `Job`s to the `jobs`
queue which are then acknowledged by the `consumer`.

# Development

## Setup

You will need a rabbit mq instance running locally. Start a rabbit mq docker
container with the following command:

```bash
docker run --name rabbitmq -p 5672:5672 rabbitmq
```

This project runs on node and typescript. To install the required dependencies
and types for development use:

```bash
nvm use

npm i
```
