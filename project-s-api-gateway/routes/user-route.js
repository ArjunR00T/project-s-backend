import { Router } from "express";
import proxy from "../services/proxy.js";

const router = Router();

console.log("User service URL:", process.env.USER_SERVICE_URL);
router.use("/", proxy(process.env.USER_SERVICE_URL));
export default router;
