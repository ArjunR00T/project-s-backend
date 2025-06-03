import asyncHandler from "express-async-handler";
import logger from "../utils/logger.js";
import shopService from "../services/shop.services.js";
// Add a new shop
export const addShop = asyncHandler(async (req, res) => {
  logger.info("→ addShop called");

  const shop = await shopService.createShop(req.body);
  res.status(201).json({ shop });
});

// Get all shops by a specific owner
export const getUserShops = asyncHandler(async (req, res) => {
  logger.info("→ getUserShops called");

  const { ownerId } = req.body;
  if (!ownerId) {
    res.status(400);
    throw new Error("Owner ID is required.");
  }

  const shops = await shopService.getShopsByOwner(ownerId);
  res.status(200).json({ shops });
});

// Delete a shop by ID
export const delUserShop = asyncHandler(async (req, res) => {
  logger.info("→ delUserShop called");

  const { id } = req.body;
  if (!id) {
    res.status(400);
    throw new Error("Shop ID is required.");
  }

  await shopService.deleteShopById(id);
  res.status(200).json({ message: "Deleted successfully" });
});

// Get shops in geo range
export const getShopsInRange = asyncHandler(async (req, res) => {
  logger.info("→ getShopsInRange called");

  const { range, location } = req.body;
  if (!range || !location?.latitude || !location?.longitude) {
    res.status(400);
    throw new Error("Range and valid location are required.");
  }

  const shops = await shopService.findShopsInRange(range, location);
  res.status(200).json(shops);
});

export default {
  addShop,
  getUserShops,
  delUserShop,
  getShopsInRange,
};
