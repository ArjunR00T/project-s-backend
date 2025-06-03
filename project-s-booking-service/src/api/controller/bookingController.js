import asyncHandler from "express-async-handler";
import * as bookingService from "../../service/booking.service.js";
import { set } from "mongoose";
import logger from "../../utils/logger.js";

const getBookings = asyncHandler(async (req, res) => {
  logger.info("Fetching all bookings");
  const { bookingId } = req.params;

  if (!bookingId) {
    logger.warn("Booking ID is required");
    return res.status(400).json({ message: "Booking ID is required" });
  }

  console.log(bookingId);
  const booking = await bookingService.getBookingById(bookingId);
  if (!booking) {
    logger.warn("Booking not found");
    return res.status(404).json({ message: "Booking not found" });
  }
  return res.status(200).json(booking);
});

const getCustomerBookings = asyncHandler(async (req, res) => {
  logger.info("Fetching customer bookings");
  const { customerId } = req.params;
  console.log(req.params, customerId);
  if (!customerId) {
    logger.warn("Customer ID is required");
    return res.status(400).json({ message: "Customer ID is required" });
  }

  const bookings = await bookingService.getCustomerBookingsById(customerId);
  if (!bookings) {
    logger.warn("Bookings not found");
    return res.status(404).json({ message: "Bookings not found" });
  }
  return res.status(200).json(bookings);
});

const getPartnerBookings = asyncHandler(async (req, res) => {
  logger.info("Fetching partner bookings");
  const { partnerId } = req.params;

  if (!partnerId) {
    logger.warn("Partner ID is required");
    return res.status(400).json({ message: "Partner ID is required" });
  }

  const bookings = await bookingService.getPartnerBookingsById(partnerId);
  if (!bookings) {
    logger.warn("Bookings not found");
    return res.status(404).json({ message: "Bookings not found" });
  }
  return res.status(200).json(bookings);
});

const setBookingStatus = asyncHandler(async (req, res) => {
  logger.info("Setting booking status");
  const { bookingId } = req.params;
  const { status } = req.body;

  if (!bookingId) {
    logger.warn("Booking ID is required");
    return res.status(400).json({ message: "Booking ID is required" });
  }
  if (!status) {
    logger.warn("Status is required");
    return res.status(400).json({ message: "Status is required" });
  }

  const booking = await bookingService.setBookingStatusById(bookingId, status);
  if (!booking) {
    logger.warn("Booking not found");
    return res.status(404).json({ message: "Booking not found" });
  }
  return res.status(200).json(booking);
});

const createBooking = asyncHandler(async (req, res) => {
  logger.info("Creating new booking");
  const { customerId, partnerId, serviceType, bookingTime, date, status } =
    req.body;

  if (
    !customerId ||
    !partnerId ||
    !serviceType ||
    !bookingTime ||
    !date ||
    !status
  ) {
    logger.warn("All fields are required");
    return res.status(400).json({ message: "All fields are required" });
  }

  const booking = await bookingService.createNewBooking({
    customerId,
    partnerId,
    serviceType,
    bookingTime,
    date,
    status,
  });
  return res.status(201).json(booking);
});

const setBookingLateStatus = asyncHandler(async (req, res) => {
  logger.info("Setting booking late status");
  const { bookingId } = req.params;
  const { isRunningLate } = req.body;

  if (!bookingId) {
    logger.warn("Booking ID is required");
    return res.status(400).json({ message: "Booking ID is required" });
  }
  if (isRunningLate === undefined) {
    logger.warn("isRunningLate is required");
    return res.status(400).json({ message: "isRunningLate is required" });
  }

  const booking = await bookingService.setBookingLateStatusById(
    bookingId,
    isRunningLate
  );
  if (!booking) {
    logger.warn("Booking not found");
    return res.status(404).json({ message: "Booking not found" });
  }
  return res.status(200).json(booking);
});

const setBookingLateBumpCount = asyncHandler(async (req, res) => {
  logger.info("Setting booking late bump count");
  const { bookingId } = req.params;
  const { lateBumpCount } = req.body;

  if (!bookingId) {
    logger.warn("Booking ID is required");
    return res.status(400).json({ message: "Booking ID is required" });
  }
  if (lateBumpCount === undefined) {
    logger.warn("lateBumpCount is required");
    return res.status(400).json({ message: "lateBumpCount is required" });
  }

  const booking = await bookingService.setBookingLateBumpCountById(
    bookingId,
    lateBumpCount
  );
  if (!booking) {
    logger.warn("Booking not found");
    return res.status(404).json({ message: "Booking not found" });
  }
  return res.status(200).json(booking);
});

const setBookingCompleteStatus = asyncHandler(async (req, res) => {
  logger.info("Setting booking complete status");
  const { bookingId } = req.params;
  const { status } = req.body;

  if (!bookingId) {
    logger.warn("Booking ID is required");
    return res.status(400).json({ message: "Booking ID is required" });
  }
  if (!status) {
    logger.warn("Status is required");
    return res.status(400).json({ message: "Status is required" });
  }

  const booking = await bookingService.setBookingCompleteStatusById(
    bookingId,
    status
  );
  if (!booking) {
    logger.warn("Booking not found");
    return res.status(404).json({ message: "Booking not found" });
  }
  return res.status(200).json(booking);
});

const setBookingCancelStatus = asyncHandler(async (req, res) => {
  logger.info("Setting booking cancel status");
  const { bookingId } = req.params;
  const { status } = req.body;

  if (!bookingId) {
    logger.warn("Booking ID is required");
    return res.status(400).json({ message: "Booking ID is required" });
  }
  if (!status) {
    logger.warn("Status is required");
    return res.status(400).json({ message: "Status is required" });
  }

  const booking = await bookingService.setBookingCancelStatusById(
    bookingId,
    status
  );
  if (!booking) {
    logger.warn("Booking not found");
    return res.status(404).json({ message: "Booking not found" });
  }
  return res.status(200).json(booking);
});

export default {
  getBookings,
  getCustomerBookings,
  getPartnerBookings,
  setBookingStatus,
  createBooking,
  setBookingLateStatus,
  setBookingLateBumpCount,
  setBookingCompleteStatus,
  setBookingCancelStatus,
};
