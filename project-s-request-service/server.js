import express from "express";
import asynhandler from "express-async-handler";
import requestRoute from "./api/routes/requestRoute.js";
import redisClient from "./utils/redis-client.js";
import logger from "./utils/logger.js";
// server.js
import "./utils/workers/requestTimeoutWorker.js"; // Adjust path as needed
import dotenv from "dotenv";

dotenv.config();

const app = express();
const port = process.env.port || 5003;

app.use(express.json());

app.use("/api/request", requestRoute);

async function deleteStaleCoolOffKeys() {
  const keys = await redisClient.keys("*");
  if (keys.length > 0) {
    await redisClient.del(keys);
    console.log(`Deleted ${keys.length} keys`);
  } else {
    console.log("No keys to delete");
  }

  const keysi = await redisClient.keys("*");
  console.log("Current keys in Redis:", keysi);
}
deleteStaleCoolOffKeys().catch((err) => {
  logger.error("Error deleting stale coolOff keys:", err);
});

app.listen(port, () => {
  logger.info(`Server is running on port ${port}`);
});
