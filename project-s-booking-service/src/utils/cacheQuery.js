import logger from "./logger.js";
import redisClient from "./redis-client.js";

const cacheQuery = async ({ key, ttl = 300, queryFn }) => {
  try {
    const cached = await redisClient.get(key);
    if (cached) {
      logger.info(`Cache hit for key: ${key}`);
      logger.debug(`Cached data: ${cached}`);
      return JSON.parse(cached);
    }

    logger.info(`Cache miss for key: ${key}`);
    logger.info(`Executing query function for key: ${key}`);
    const result = await queryFn();
    await redisClient.setEx(key, ttl, JSON.stringify(result));

    return result;
  } catch (err) {
    console.error("Cache error:", err);
    return await queryFn(); // fallback
  }
};

export default cacheQuery;
