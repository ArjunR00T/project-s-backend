import express from "express";
import dotenv from "dotenv";
import userroute from "./src/routes/user-route.js";
import logger from "./src/utils/logger.js";
import connectDb from "./src/config/dbConnection.js";

dotenv.config();

connectDb().catch((error) => {
  logger.error(`Database connection failed: ${error.message}`);
});

const app = express();
const port = process.env.PORT || 5001;

app.use(express.json());

app.use("/api/user", userroute);

app.listen(process.env.PORT, () => {
  logger.info(`Server is running on port ${process.env.PORT}`);
});
