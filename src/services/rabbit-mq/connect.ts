import amqp from "amqplib";
import log from "../../adapters/log";
import config from "./config";

export async function connect(): Promise<{
  connection: amqp.Connection;
  channel: amqp.Channel;
}> {
  // RabbitMQ uses advanced message queuing protocol (AMQP) to communicate
  // with the client. It is built on top of TCP.
  const connection = await amqp.connect(config.rabbit_mq_host);

  // A channel is a virtual connection inside a connection. It is used to
  // send and receive messages.
  const channel = await connection.createChannel();

  log.info("RabbitMQ publisher connection established.");

  return {
    connection,
    channel,
  };
}
