import IORedis from "ioredis";
import logger from "./logger.js";

const connection = new IORedis({
  host: "redis", // your Redis host
  port: 6379,
  maxRetriesPerRequest: null, // disables built-in retry limit
  enableReadyCheck: true, // checks if Redis is ready before sending commands
});

// Connection error handling
connection.on("error", (err) => {
  logger.error("[Redis BullMQ] Connection error:", err);
});

// Connection ready event
connection.on("ready", () => {
  logger.info("[Redis BullMQ] Connected and ready");
});

// Connection close event
connection.on("close", () => {
  logger.warn("[Redis BullMQ] Connection closed");
});

// Connection reconnecting event
connection.on("reconnecting", (delay) => {
  logger.info(`[Redis BullMQ] Reconnecting in ${delay}ms`);
});

// Connection end event
connection.on("end", () => {
  logger.warn("[Redis BullMQ] Connection ended");
});

// Optional: catch unhandled promise rejections related to Redis
process.on("unhandledRejection", (reason, promise) => {
  logger.error("[Unhandled Rejection] Promise:", promise, "Reason:", reason);
});

export default connection;
