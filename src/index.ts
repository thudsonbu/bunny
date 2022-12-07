import publisher from "./services/rabbit-mq/publisher";
import Job from "./models/job";
import log from "./adapters/log";

async function main() {
  try {
    await publisher.connect();

    const newJob = new Job("First Job");

    await publisher.sendJob(newJob);

    await publisher.close();
  } catch (err) {
    log.error(err);
  }
}

main();
