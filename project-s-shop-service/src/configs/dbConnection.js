import { connect } from "mongoose";
import logger from "../utils/logger.js";

const connectDb = async () => {
  if (!process.env.DB_USERNAME || !process.env.DB_PASS) {
    logger.error("Database credentials are not set in environment variables");
    process.exit(1);
  }
  logger.info("Connecting to MongoDB Atlas");
  logger.info("DB_USERNAME", process.env.DB_USERNAME);
  const uri = `mongodb+srv://${process.env.DB_USERNAME}:${process.env.DB_PASS}@project-salon.rwppb.mongodb.net/?retryWrites=true&w=majority&appName=project-salon`;

  try {
    const connection = await connect(uri, {});
    logger.info(`Database connected: ${connection.connection.host}`);
  } catch (error) {
    logger.error(`Error connecting to database: ${error.message}`);
    process.exit(1);
  }
};

export default connectDb;
