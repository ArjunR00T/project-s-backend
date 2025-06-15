import logger from "../utils/logger.js";
import redisClient from "../utils/redis-client.js";
import { requestTimeoutQueue } from "../utils/requetsTimoutQueue.js";
import axios from "axios";
import retry from "async-retry";

const COOL_OFF_TIME = 60;

export async function handleIncomingRequest(partnerId, customerId) {
  // TODO: Handle situation when request is taking longer than usual, when partner is not responding
  // Use BullMQ to schedule auto-cancel for unhandled partner requests after 10 mins.

  logger.info(
    `[handleIncomingRequest] Received ${customerId} for partner ${partnerId}`
  );
  const cacheKey = `queue:${partnerId}`;
  const coolOffKey = `coolOff:${partnerId}:${customerId}`;

  const coolOffExists = await redisClient.exists(coolOffKey);
  const ttl = await redisClient.ttl(coolOffKey);

  if (coolOffExists) {
    logger.info(
      `[handleIncomingRequest] Cool off period active for ${customerId} for partner ${partnerId}`
    );
    throw new Error(`COOL_OFF`);
  }

  await redisClient.rPush(cacheKey, customerId);
  await redisClient.setEx(coolOffKey, COOL_OFF_TIME, "active");

  await requestTimeoutQueue.add(
    "partner-timeout",
    { partnerId, customerId },
    {
      delay: 5 * 60 * 1000, // 10 minutes
      removeOnComplete: true,
      removeOnFail: true,
    }
  );

  logger.info(
    `[handleIncomingRequest] Scheduled timeout for ${customerId} at ${partnerId}`
  );

  logger.info(
    `[handleIncomingRequest] Added ${customerId} to queue for partner ${partnerId}`
  );
  const length = await redisClient.lLen(cacheKey);
  if (length === 1) {
    await sendRequest(partnerId); // Call to internal function
  }

  const queue = await redisClient.lRange(cacheKey, 0, -1);
  const position = queue.indexOf(customerId) + 1;
  return { position };
}

export async function softCancelRequest(partnerId, customerId) {
  logger.info("Received soft cancellation request", { partnerId, customerId });
  const cacheKey = `queue:${partnerId}`;
  const coolOffKey = `coolOff:${partnerId}:${customerId}`;

  try {
    await redisClient.lRem(cacheKey, 0, customerId);
    redisClient.del(coolOffKey);

    logger.info(
      `[softCancelRequest] Soft cancelled ${customerId} for partner ${partnerId}`
    );
  } catch (error) {
    logger.error(
      `[softCancelRequest] Error soft cancelling ${customerId} for partner ${partnerId}`,
      error
    );
  }
}

export async function completeRequest(bookingData) {
  const partnerId = bookingData.partnerId;
  const customerId = bookingData.customerId;

  logger.info("Received completed request");
  logger.info(`Req body: ${JSON.stringify(bookingData)}`);
  const coolOffKey = `coolOff:${partnerId}:${customerId}`;
  const queueKey = `queue:${partnerId}`;

  try {
    await redisClient.lRem(queueKey, 0, customerId);
    await redisClient.del(coolOffKey);

    logger.info(`Creating booking for ${customerId} at partner ${partnerId}`);

    const booking = await createBooking(bookingData);

    logger.info(
      `[completeRequest] Completed ${customerId} for partner ${partnerId}`
    );
    logger.info("continue checking for next customer");
    await sendRequest(partnerId);
  } catch (error) {
    logger.error(
      `[completeRequest] Error completing ${customerId} for partner ${partnerId}`,
      error
    );
  }
}

async function sendRequest(partnerId) {
  const queueKey = `queue:${partnerId}`;

  const queueLength = await redisClient.lLen(queueKey);
  if (queueLength === 0) {
    logger.info(`[sendRequest] No customers in queue for partner ${partnerId}`);
    return;
  }

  const customerId = await redisClient.lIndex(queueKey, 0);
  logger.info("Sending request", { partnerId });

  logger.info(
    `[sendRequest] Processing ${customerId} for partner ${partnerId}`
  );
  // Notification, analytics, etc. can be called here
}

export async function getQueue(partnerId) {
  const queueKey = `queue:${partnerId}`;
  logger.info(`[getQueue] Fetching queue for partner ${partnerId}`);
  return await redisClient.lRange(queueKey, 0, -1);
}

async function createBooking(bookingData) {
  return await retry(
    async (bail) => {
      try {
        const response = await axios.post(
          "http://book-service:5004/api/booking/create",
          bookingData
        );

        // If response is not retryable
        if (response.status >= 400 && response.status < 500) {
          bail(new Error(`Non-retryable error: ${response.status}`));
          return;
        }

        return response.data;
      } catch (err) {
        // Optionally bail if error is not retryable
        if (err.response?.status >= 400 && err.response?.status < 500) {
          bail(new Error(`Client error: ${err.response.status}`));
        }
        throw err;
      }
    },
    {
      retries: 3,
      minTimeout: 500,
      maxTimeout: 2000,
      factor: 2,
    }
  );
}
