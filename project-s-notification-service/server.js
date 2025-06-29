import express from "express";
import dotenv from "dotenv";
import notificationRoutes from "./src/routes/notification-route.js";
import logger from "./src/utils/logger.js";
import connectDb from "./src/config/dbConnection.js";

dotenv.config();

connectDb().catch((error) => {
  logger.error(`Database connection failed: ${error.message}`);
});

const app = express();
const port = process.env.PORT || 5005;

app.use(express.json());

app.use("/api/notification", notificationRoutes);

app.listen(port, () => {
  logger.info(`Server is running on port ${port}`);
});
