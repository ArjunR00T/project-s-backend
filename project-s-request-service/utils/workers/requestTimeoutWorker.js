import { Worker } from "bullmq";
import connection from "../bullMqClient.js";
import redisClient from "../redis-client.js";
import logger from "../logger.js";

const worker = new Worker(
  "partner-timeout",
  async (job) => {
    const { partnerId, customerId } = job.data;
    logger.info(`[BullMQ] Handling timeout for ${customerId} at ${partnerId}`);

    const coolOffKey = `coolOff:${partnerId}:${customerId}`;
    const queueKey = `queue:${partnerId}`;

    try {
      const queue = await redisClient.lRange(queueKey, 0, -1);

      if (queue.includes(customerId)) {
        await redisClient.lRem(queueKey, 0, customerId);
        logger.info(
          `[requestTimeout] Removed ${customerId} from ${partnerId}'s queue due to timeout`
        );
      } else {
        logger.info(
          `[requestTimeout] ${customerId} for ${partnerId}' was not in the queue`
        );
      }

      await redisClient.del(coolOffKey);
      logger.info(
        `[requestTimeout] Cleared coolOff key for ${customerId} at ${partnerId}`
      );

      // TODO: Trigger Firebase update to refresh UI if needed
    } catch (error) {
      logger.error(
        `[requestTimeout] Error handling timeout for ${customerId} at ${partnerId}`,
        error
      );
    }
  },
  { connection }
);

worker.on("failed", (job, err) => {
  logger.error(`[BullMQ] Job failed: ${job?.id}`, err);
});
