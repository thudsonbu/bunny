import publisher from "./services/rabbit-mq/publisher";
import consumer from "./services/rabbit-mq/consumer";
import Job from "./models/job";
import log from "./adapters/log";

async function main() {
  try {
    await publisher.connect();
    await consumer.connect();

    await consumer.consumeJobs();

    const newJob = new Job("First Job");

    await publisher.publishJob(newJob);
    await publisher.publishJob(newJob);

    setTimeout(async () => {
      await publisher.disconnect();
      await consumer.disconnect();
    }, 5000);
  } catch (err) {
    log.error(err);
  }
}

main();
