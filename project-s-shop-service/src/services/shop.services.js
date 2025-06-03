import shopModel from "../models/shop-model.js";
import logger from "../utils/logger.js";
import geoBucketUtil from "../utils/geoBucketUtil.js";

const { find, create, findById, findByIdAndDelete } = shopModel;

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

  const shop = await create({
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

const getShopsByOwner = async (ownerId) => {
  const shops = await find({ ownerId });

  if (!shops || shops.length === 0) {
    logger.warn(`No shops found for ownerId: ${ownerId}`);
  }

  return shops;
};

const deleteShopById = async (id) => {
  const shop = await findById(id);

  if (!shop) {
    logger.warn(`No shop found with ID: ${id}`);
    throw new Error("Shop not found");
  }

  await findByIdAndDelete(id);
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
  getShopsByOwner,
  deleteShopById,
  findShopsInRange,
};
