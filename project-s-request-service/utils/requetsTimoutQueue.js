import { Queue } from "bullmq";
import connection from "./bullMqClient.js"; // Adjust the import path as necessary

export const requestTimeoutQueue = new Queue("partner-timeout", { connection });
