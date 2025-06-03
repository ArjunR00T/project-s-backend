import dotenv from "dotenv";
dotenv.config();
import express from "express";
import logger from "./src/utils/logger.js";
import shopRoute from "./src/routes/shop-route.js";
import conectDB from "./src/configs/dbConnection.js";

conectDB(); // Connect to MongoDB Atlas

const app = express();
const port = process.env.PORT || 5002;

app.use(express.json());
app.use("/api/shop", shopRoute);

app.listen(port, () => {
  logger.info(`Server is running on port ${port}`);
});
