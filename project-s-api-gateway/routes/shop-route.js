import { Router } from "express";
import proxy from "../services/proxy.js";

const router = Router();
// Proxy all requests to the shop service
router.use("/", proxy(process.env.SHOP_SERVICE_URL));
// Export the router to be used in the main server file
export default router;
