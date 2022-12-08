import amqp from "amqplib";
import Job from "../../models/job";
import log from "../../adapters/log";
import { connect as create_connection } from "./connect";

let connection: amqp.Connection;
let channel: amqp.Channel;

/**
 * Connects the publisher to RabbitMQ.
 */
export async function connect() {
  try {
    const rbConn = await create_connection();

    connection = rbConn.connection;
    channel = rbConn.channel;
  } catch (err) {
    log.error(err, "Publisher connection to RabbitMQ failed.");
  }
}

/**
 * Publishes a job to the 'jobs' queue.
 */
export async function publishJob(job: Job) {
  if (!connection) {
    throw new Error("RabbitMQ connection not yet established.");
  }

  if (!channel) {
    throw new Error("RabbitMQ channel not yet established.");
  }

  // A queue is a buffer that stores messages. It is created if it does not
  // exist. The queue is bound to the channel.
  await channel.assertQueue("jobs");

  channel.sendToQueue("jobs", Buffer.from(JSON.stringify(job)));

  log.info("Send job successfully!");
}

/**
 * Disconnects the publisher from RabbitMQ.
 */
export async function disconnect() {
  if (!connection) {
    throw new Error("RabbitMQ connection not yet established.");
  }

  try {
    await connection.close();
  } catch (err) {
    log.error(err, "Publisher disconnection from RabbitMQ failed.");
  }
}

export default {
  connect,
  publishJob,
  disconnect,
};
