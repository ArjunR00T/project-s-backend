import mongoose from "mongoose";

const bookingSchema = new mongoose.Schema({
  customerId: {
    type: String,
    required: true,
    ref: "User",
  },
  partnerId: {
    type: String,
    required: true,
    ref: "Partner",
  },
  serviceType: {
    type: String,
    default: "general",
  },
  bookingTime: {
    type: Date,
    required: true,
  },
  date: {
    type: String,
    required: true, // format: YYYY-MM-DD
  },
  status: {
    type: String,
    enum: ["confirmed", "completed", "cancelled", "no-show"],
    default: "confirmed",
  },
  lateBumpCount: {
    type: Number,
    default: 0,
  },
  isRunningLate: {
    type: Boolean,
    default: false,
  },
  runningLateNotifiedAt: {
    type: Date,
    default: null,
  },
  createdAt: {
    type: Date,
    default: () => new Date(),
  },
  updatedAt: {
    type: Date,
    default: () => new Date(),
  },
});

bookingSchema.index({ partnerId: 1, date: 1 });
bookingSchema.index({ customerId: 1, date: -1 });

export const BookingModel = mongoose.model("Booking", bookingSchema);
