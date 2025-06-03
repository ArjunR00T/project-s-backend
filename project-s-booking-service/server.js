import express from "express";
import asynchandler from "express-async-handler";
import bookingRoute from "./src/api/routes/bookingRoute.js";
import connectDb from "./config/db-connect.js";
import dotenv from "dotenv";
import logger from "./src/utils/logger.js";

import "./src/utils/workers/worker.js"; // Import workers to start them

dotenv.config();

const port = process.env.port || 5004;

connectDb().catch((error) => {
  console.error("Database connection failed:", error);
  process.exit(1);
});

const app = express();
app.use(express.json());

app.use("/api/booking", bookingRoute);
app.get(
  "api/booking/ping",
  asynchandler(async (req, res) => {
    res.status(200).json({ message: "Booking service says: PONG!" });
  })
);

app.use((err, req, res, next) => {
  logger.error("Error occurred:", err);
  res.status(500).json({ message: "Internal Server Error" });
});

app.listen(port, () => {
  logger.info(`Server running on port ${port}`);
});
