import { Router } from "express";
import proxy from "../services/proxy.js";

const router = Router();
// Proxy all requests to the shop service
router.use("/", proxy(process.env.BOOKING_SERVICE_URL));
// Export the router to be used in the main server file
export default router;
// This router will handle all booking-related requests and forward them to the booking service
