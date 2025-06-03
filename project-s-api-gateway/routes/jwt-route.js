import { Router } from "express";
import { jwtAuth } from "../controllers/JwtController.js"; // Use named import

const router = Router();

router.route("/").post(jwtAuth);

export default router;
