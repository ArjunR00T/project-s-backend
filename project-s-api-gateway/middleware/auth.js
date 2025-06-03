import pkg from "jsonwebtoken";
import logger from "../utils/logger.js";
const { verify } = pkg;

const authenticateToken = (req, res, next) => {
  const authHeader = req.headers["authorization"];
  const token = authHeader && authHeader.split(" ")[1];

  if (!token) {
    logger.warn("Access token is missing or invalid");
    return res
      .status(401)
      .json({ message: "Access token is missing or invalid" });
  }

  verify(token, process.env.JWT_SECRET, (err, user) => {
    if (err) {
      logger.error("JWT verification failed", err);
      return res.status(403).json({ message: "Invalid or expired token" });
    }
    req.user = user;
    next();
  });
};

export default authenticateToken;

// 6th May TODO: implement route, attach middleware
