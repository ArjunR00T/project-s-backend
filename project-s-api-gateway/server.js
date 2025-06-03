// Description: This is the entry point for the API Gateway service.
// This service acts as a gateway to other microservices, handling routing and authentication.

import "./utils/env-config.js"; // Load environment variables from .env file
import express from "express";
import cors from "cors";
import { jwtAuth } from "./controllers/jwt-controller.js";
import logger from "./utils/logger.js";
import { limiter } from "./utils/limiter.js";
import morgan from "morgan";

import userRoutes from "./routes/user-route.js";
import shopRoutes from "./routes/shop-route.js";
import requestRoutes from "./routes/request-route.js";
import bookingRoutes from "./routes/booking-route.js";
import authenticateToken from "./middleware/auth.js";

const app = express();
const PORT = process.env.PORT;

// Middleware setup
app.use(limiter);
app.use(cors());
app.use(morgan("dev"));

// Mount service routes
// app.use("/api/user", authenticateToken, userRoutes);
// app.use("/api/shop", authenticateToken, shopRoutes);
// app.use("/api/request", authenticateToken, requestRoutes);
// app.use("/api/booking", authenticateToken, bookingRoutes);

app.use("/api/user", userRoutes);
app.use("/api/shop", shopRoutes);
app.use("/api/request", requestRoutes);
app.use("/api/booking", bookingRoutes);
app.use("/auth", express.json(), jwtAuth);

// Health check route
app.get("/ping", (req, res) => {
  res.status(200).send("API Gateway says: PONG!");
});

// Entry point
app.listen(PORT, () => {
  logger.info(`API Gateway is running on port ${PORT}`);
});
