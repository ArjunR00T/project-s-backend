import geoBucketUtil from "./geoBucketUtil.js";
import shopModel from "../models/shop-model.js";

const precision = 2;

const backfillGeoBuckets = async () => {
  const shops = await shopModel.find({ geoBucketId: { $exists: false } });

  for (const shop of shops) {
    const { coordinates } = shop.location;
    const lng = coordinates[0];
    const lat = coordinates[1];
    const geoBucketId = geoBucketUtil.getGeoBucketId(lat, lng, precision);

    shop.geoBucketId = geoBucketId;
    await shop.save();
  }

  console.log(`✅ Updated ${shops.length} shops with geoBucketId`);
};

backfillGeoBuckets().catch(console.error);
// Export the function if needed elsewhere
export default backfillGeoBuckets;
