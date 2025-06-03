// geoBucketUtil.js

const getGeoBucketId = (lat, lng, precision = 2) => {
  const multiplier = Math.pow(10, precision);
  const latBucket = Math.floor(lat * multiplier);
  const lngBucket = Math.floor(lng * multiplier);
  return `geo_${latBucket}_${lngBucket}`;
};

/**
 * Returns a list of neighboring geoBucketIds around a given lat/lng
 * @param {number} lat - Latitude
 * @param {number} lng - Longitude
 * @param {number} precision - Bucket precision (default 2 → ~1.1km)
 * @param {number} radius - Bucket radius (1 → 3x3 grid, 2 → 5x5 grid, etc.)
 */
const getNeighborBuckets = (lat, lng, precision = 2, radius = 1) => {
  const multiplier = Math.pow(10, precision);
  const latBase = Math.floor(lat * multiplier);
  const lngBase = Math.floor(lng * multiplier);

  const buckets = [];

  for (let dLat = -radius; dLat <= radius; dLat++) {
    for (let dLng = -radius; dLng <= radius; dLng++) {
      const latBucket = latBase + dLat;
      const lngBucket = lngBase + dLng;
      buckets.push(`geo_${latBucket}_${lngBucket}`);
    }
  }

  return buckets;
};

/**
 * Converts search radius in km to bucket radius for the given precision.
 * @param {number} rangeInKm
 * @param {number} precision
 * @returns {number} bucketRadius
 */
const getBucketRadiusForRange = (rangeInKm, precision = 2) => {
  const approxKmPerBucket = 111 / Math.pow(10, precision); // ~111 km per degree
  return Math.ceil(rangeInKm / approxKmPerBucket);
};

export default {
  getGeoBucketId,
  getNeighborBuckets,
  getBucketRadiusForRange,
};
