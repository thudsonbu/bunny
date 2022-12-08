import amqp from "amqplib";
import { connect as create_connection } from "./connect";
import log from "../../adapters/log";
import config from "./config";
import Job from "./../../models/job";

let connection: amqp.Connection;
let channel: amqp.Channel;

/**
 * Connects the consumer to RabbitMQ.
 */
export async function connect() {
  try {
    const rbConn = await create_connection();

    connection = rbConn.connection;
    channel = rbConn.channel;
  } catch (err) {
    log.error(err, "Consumer connection to RabbitMQ failed.");
  }
}

/**
 * Consumes jobs from the 'jobs' queue. The consumer will receive all
 * unacknowledged messages from the queue.
 */
export async function consumeJobs() {
  if (!connection) {
    throw new Error("RabbitMQ connection not yet established.");
  }

  if (!channel) {
    throw new Error("RabbitMQ channel not yet established.");
  }

  // Check if the queue exists. If it does not exist, it will be created.
  await channel.assertQueue(config.jobs_queue_name);

  // The consumer will receive all unacknowledged messages from the queue.
  channel.consume(config.jobs_queue_name, async (message) => {
    if (!message) {
      return;
    }

    let job: Job;

    try {
      job = new Job(message.content.toString());

      log.info(`Consumed job: ${job.message}`);
    } catch (err) {
      log.error(err, "Failed to parse job.");
    }

    if (job) {
      await new Promise((resolve) => setTimeout(resolve, 1000));

      try {
        // Acknowledge the message to remove it from the queue.
        channel.ack(message);
        log.info(`Acknowledged job: ${job.message}`);
      } catch (err) {
        log.error(err, "Failed to acknowledge job.");
      }
    }
  });
}

/**
 * Disconnects the consumer from RabbitMQ.
 */
export async function disconnect() {
  if (!connection) {
    throw new Error("RabbitMQ connection not yet established.");
  }

  try {
    await connection.close();
  } catch (err) {
    log.error(err, "Consumer disconnection from RabbitMQ failed.");
  }
}

export default {
  connect,
  consumeJobs,
  disconnect,
};
