import rateLimit from "express-rate-limit";

// Read from environment or fallback
const windowMs = parseInt(process.env.RATE_LIMIT_WINDOW) || 15 * 60 * 1000; // 15 mins
const maxRequests = parseInt(process.env.RATE_LIMIT_MAX) || 100;

export const limiter = rateLimit({
  windowMs,
  max: maxRequests,
  standardHeaders: true,
  legacyHeaders: false,
  message: {
    success: false,
    message: "Too many requests. Please try again later.",
  },
});
