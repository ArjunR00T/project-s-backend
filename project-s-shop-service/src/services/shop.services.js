import shopModel from "../models/shop-model.js";
import logger from "../utils/logger.js";
import geoBucketUtil from "../utils/geoBucketUtil.js";

const createShop = async (shopData) => {
  const {
    shopName,
    locality,
    ownerId,
    salonType,
    serviceType,
    homeService,
    isActive,
    location,
  } = shopData;

  if (
    !shopName ||
    !locality ||
    !ownerId ||
    !salonType ||
    !serviceType ||
    homeService === undefined ||
    isActive === undefined ||
    !location?.latitude ||
    !location?.longitude
  ) {
    logger.warn("Validation failed in createShop");
    throw new Error("All fields are required.");
  }

  const geoLocation = {
    type: "Point",
    coordinates: [location.longitude, location.latitude],
  };

  const bucketID = geoBucketUtil.getGeoBucketId(
    location.latitude,
    location.longitude,
    2 // Precision of 2 for ~1.1km resolution
  );

  logger.info(`Creating shop with bucketID ${bucketID}`);

  const shop = await shopModel.create({
    shopName,
    locality,
    ownerId,
    salonType,
    serviceType,
    homeService,
    isActive,
    location: geoLocation,
    geoBucketId: bucketID,
  });

  return shop;
};

const updateShop = async (shopId, shopData) => {
  const {
    shopName,
    locality,
    salonType,
    serviceType,
    homeService,
    isActive,
    location,
  } = shopData;

  if (
    !shopId ||
    !shopName ||
    !locality ||
    !salonType ||
    !serviceType ||
    homeService === undefined ||
    isActive === undefined ||
    !location?.latitude ||
    !location?.longitude
  ) {
    logger.warn("Validation failed in updateShop");
    throw new Error("All fields are required.");
  }

  const geoLocation = {
    type: "Point",
    coordinates: [location.longitude, location.latitude],
  };

  const bucketID = geoBucketUtil.getGeoBucketId(
    location.latitude,
    location.longitude,
    2 // Precision of 2 for ~1.1km resolution
  );

  logger.info(`Updating shop ${shopId} with bucketID ${bucketID}`);

  const updatedShop = await shopModel.findByIdAndUpdate(
    shopId,
    {
      shopName,
      locality,
      salonType,
      serviceType,
      homeService,
      isActive,
      location: geoLocation,
      geoBucketId: bucketID,
    },
    { new: true }
  );

  if (!updatedShop) {
    logger.warn(`Shop with id ${shopId} not found for update`);
    throw new Error("Shop not found");
  }

  return updatedShop;
};


const getShopsByOwner = async (ownerId) => {
  const shops = await shopModel.find({ ownerId });

  if (!shops || shops.length === 0) {
    logger.warn(`No shops found for ownerId: ${ownerId}`);
  }

  return shops;
};

const deleteShopById = async (id) => {
  const shop = await shopModel.findById(id);

  if (!shop) {
    logger.warn(`No shop found with ID: ${id}`);
    throw new Error("Shop not found");
  }

  await shopModel.findByIdAndDelete(id);
  logger.info(`Shop with ID ${id} deleted`);
};

const findShopsInRange = async (range, location) => {
  const center = [location.longitude, location.latitude];
  const rangeInRadians = range / 6378.1;

  const bucketRadius = geoBucketUtil.getBucketRadiusForRange(range, 2);

  const nearbyBuckets = geoBucketUtil.getNeighborBuckets(
    location.latitude,
    location.longitude,
    2, // Precision of 2 for ~1.1km resolution
    bucketRadius
  );

  // logger.info(`Geo search buckets: ${nearbyBuckets.join(", ")}`);

  const shops = await shopModel.find({
    geoBucketId: { $in: nearbyBuckets },
    location: {
      $geoWithin: {
        $centerSphere: [center, rangeInRadians],
      },
    },
  });

  const shops2 = await shopModel.find({
    // geoBucketId: { $in: nearbyBuckets },
    location: {
      $geoWithin: {
        $centerSphere: [center, rangeInRadians],
      },
    },
  });

  if (shops != shops2) {
    logger.warn(
      "Shops found with geoBucketId filter do not match those found without it."
    );
  }

  logger.info(`Found ${shops.length} shops within ${range}km`);
  console.log(shops);
  console.log(shops2);
  return shops;
};

export default {
  createShop,
  updateShop,
  getShopsByOwner,
  deleteShopById,
  findShopsInRange,
};
