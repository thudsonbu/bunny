import amqp from "amqplib";
import Job from "../../models/job";
import log from "../../adapters/log";

let connection: amqp.Connection;
let channel: amqp.Channel;

export async function connect() {
  try {
    // RabbitMQ uses advanced message queuing protocol (AMQP) to communicate
    // with the client. It is built on top of TCP.
    connection = await amqp.connect("amqp://localhost:5672");

    // A channel is a virtual connection inside a connection. It is used to
    // send and receive messages.
    channel = await connection.createChannel();

    log.info("RabbitMQ publisher connection established.");
  } catch (err) {
    log.error(err);
  }
}

export async function close() {
  try {
    if (!connection) {
      throw new Error("Connection does not exist.");
    }

    await connection.close();
  } catch (err) {
    log.error(err);
  }
}

export async function sendJob(job: Job) {
  if (!connection) {
    throw new Error("Connection must be established before sending a job.");
  }

  if (!channel) {
    throw new Error(
      "Channel must be created before adding a job to to the queue."
    );
  }

  // A queue is a buffer that stores messages. It is created if it does not
  // exist. The queue is bound to the channel.
  await channel.assertQueue("jobs");

  channel.sendToQueue("jobs", Buffer.from(JSON.stringify(job)));

  log.info("Send job successfully!");
}

export default {
  connect,
  close,
  sendJob,
};
