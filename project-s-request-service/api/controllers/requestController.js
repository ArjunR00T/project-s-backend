import asyncHandler from "express-async-handler";
import * as requestService from "../../services/request.service.js";
import logger from "../../utils/logger.js";

const requestController = asyncHandler(async (req, res) => {
  logger.info("Received customer request", req.body);
  const { partnerId, customerId } = req.body;
  if (!partnerId || !customerId) {
    logger.warn("partnerId and customerId are required");
    return res
      .status(400)
      .json({ message: "partnerId and customerId are required" });
  }

  try {
    const result = await requestService.handleIncomingRequest(
      partnerId,
      customerId
    );
    res.status(200).json({
      message: "Request received successfully",
      position: result.position,
    });
  } catch (err) {
    if (err.message === "COOL_OFF") {
      logger.info("Request is in cool-off period", err);
      return res.status(429).json({ message: "Request is in cool-off period" });
    }
    logger.error("Error processing request", err);
    throw err;
  }
});

const softCancelRequest = asyncHandler(async (req, res) => {
  logger.info("Received soft cancellation request", req.body);

  if (!req.body.partnerId || !req.body.customerId) {
    logger.warn("partnerId and customerId are required");
    return res
      .status(400)
      .json({ message: "partnerId and customerId are required" });
  }
  const { partnerId, customerId } = req.body;
  requestService.softCancelRequest(partnerId, customerId);
  res.status(200).json({ message: "Soft cancellation successful" });
});

const completedRequest = asyncHandler(async (req, res) => {
  if (!req.body.partnerId || !req.body.customerId) {
    logger.warn("partnerId and customerId are required");
    return res
      .status(400)
      .json({ message: "partnerId and customerId are required" });
  }
  await requestService.completeRequest(req.body);
  res.status(200).json({ message: "Queue completed" });
});

const getQueue = asyncHandler(async (req, res) => {
  logger.info("Received getQueue request", req.body);
  const { partnerId } = req.body;
  if (!partnerId) {
    logger.warn("partnerId is required");
    // Log the error message
    return res.status(400).json({ message: "partnerId is required" });
  }

  try {
    logger.info("Fetching queue for partnerId:", partnerId);
    const queue = await requestService.getQueue(partnerId);
    res.status(200).json({
      queue,
    });
  } catch (err) {
    logger.error("Error fetching queue", err);
    throw err;
  }
});

export default {
  completedRequest,
  softCancelRequest,
  requestController,
  getQueue,
};
