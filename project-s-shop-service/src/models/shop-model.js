import { Schema, model } from "mongoose";

const ShopSchema = new Schema(
  {
    shopName: {
      type: String,
      required: true,
    },
    locality: {
      type: String,
      required: true,
    },
    ownerId: {
      type: String,
      required: true,
    },
    salonType: {
      type: String,
      required: true,
    },
    serviceType: {
      type: String,
      required: true,
    },
    homeService: {
      type: Boolean,
      required: true,
    },
    isActive: {
      type: Boolean,
      default: true,
    },
    location: {
      type: {
        type: String,
        enum: ["Point"],
        required: true,
      },
      coordinates: {
        type: [Number], // [longitude, latitude]
        required: true,
      },
    },

    geoBucketId: {
      type: String,
      required: true,
    },
  },
  { timestamps: true }
);

// Add geospatial index for location
ShopSchema.index({ geoBucketId: 1 });
// Add 2dsphere index for geospatial queries
ShopSchema.index({ location: "2dsphere" });

export default model("Shop", ShopSchema);
