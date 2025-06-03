import { Worker } from "bullmq";
import connection from "../bull-mq-client.js";
import {
  bookingServiceNotifyQueue,
  bookingServiceStausQueue,
} from "../booking-service-queue.js";
import logger from "../logger.js";

const preNotifyWorker = new Worker(
  bookingServiceNotifyQueue.name,
  async (job) => {
    try {
      logger.info(`Processing pre-notify job: ${job.id}`);
      logger.info(`Pre-notify job completed successfully: ${job.id}`);

      return {};
    } catch (error) {
      logger.error(`Error processing pre-notify job: ${job.id}`, error);
      throw error; // Rethrow to mark the job as failed
    }
  },
  {
    connection: connection,
    concurrency: 5, // Adjust concurrency as needed
  }
);

const statusWorker = new Worker(
  bookingServiceStausQueue.name,
  async (job) => {
    try {
      logger.info(`Processing status job: ${job.id}`);
      logger.info(`Status job completed successfully: ${job.id}`);
      return {}; // Return appropriate result
    } catch (error) {
      logger.error(`Error processing status job: ${job.id}`, error);
      throw error; // Rethrow to mark the job as failed
    }
  },
  {
    connection: connection,
    concurrency: 5, // Adjust concurrency as needed
  }
);
