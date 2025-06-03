import { createProxyMiddleware } from "http-proxy-middleware";
import logger from "../utils/logger.js";
/**
 * This module exports a function that creates a proxy middleware for forwarding requests
 * to a specified target service URL. It uses the `http-proxy-middleware` package.
 *
 * @module services/proxy
 */

const proxy = (target) => {
  logger.info(`redirecting to ${target}`);
  if (!target) {
    logger.error("Target URL is required for proxy middleware");
    throw new Error("Target URL is required for proxy middleware");
  }
  return createProxyMiddleware(
    {
      target,
      changeOrigin: true,
      pathRewrite: (path, req) => {
        console.log(`Rewriting path: ${path}`);
        return path;
      },
    },

    (error, req, res) => {
      if (error) {
        logger.error(`Proxy error: ${error.message}`);
        res.status(500).json({ error: "Proxy error occurred" });
      } else {
        logger.info(`Proxying request to ${target}`);
      }
    }
  );
};

export default proxy;
