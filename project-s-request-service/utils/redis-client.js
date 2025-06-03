// redisClient.js
import { createClient } from "redis";
import logger from "./logger.js";

const redisClient = createClient({
  url: "redis://redis:6379", // or your Docker container host and port
});

redisClient.on("error", (err) => logger.error("Redis Client Error", err));
redisClient.on("connect", () => logger.info("Redis Client Connected"));

await redisClient.connect();

export default redisClient;
