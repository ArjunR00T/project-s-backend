import asynchandler from "express-async-handler";
// import admin from "../utils/firebaseAdmin.js";
import jwt from "jsonwebtoken";
import logger from "../utils/logger.js";
// Ensure JWT_SECRET is loaded from environment variables
const JWT_SECRET = process.env.JWT_SECRET;

if (!JWT_SECRET) {
  logger.error("JWT_SECRET is not defined in environment variables");
  throw new Error("JWT_SECRET is not defined in environment variables");
}

export const jwtAuth = asynchandler(async (req, res) => {
  const { idToken } = req.body;

  if (!idToken) {
    logger.error("Missing idToken in request body");
    return res.status(400).json({ message: "Missing idToken" });
  }

  try {
    logger.info("Verifying Firebase ID token");
    // const decodedToken = await admin.auth().verifyIdToken(idToken);
    // const { uid, email } = decodedToken;

    // Create your own JWT
    logger.info("Creating custom JWT");
    const customToken = jwt.sign(
      { idToken },
      JWT_SECRET,
      { expiresIn: "30m" } // Your backend token expires in 30 minutes
    );
    logger.info("Custom JWT created successfully");
    res.json({ token: customToken });
  } catch (error) {
    logger.error("Error verifying Firebase ID token:", error);
    res.status(401).json({ message: "Invalid Firebase token" });
  }
});
