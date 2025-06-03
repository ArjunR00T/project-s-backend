import { BookingModel } from "../api/models/bookingModel.js";
import logger from "../utils/logger.js";
import redisClient from "../utils/redis-client.js";
import cacheQuery from "../utils/cacheQuery.js";
import {
  bookingServiceNotifyQueue,
  bookingServiceStausQueue,
} from "../utils/booking-service-queue.js";

// Utility function to invalidate related cache
async function invalidateBookingCache(booking) {
  logger.info("Invalidating booking cache");
  if (!booking) return;
  await Promise.all([
    redisClient.del(`booking:byId:${booking._id}`),
    redisClient.del(`booking:byCustomer:${booking.customerId}`),
    redisClient.del(`booking:byPartner:${booking.partnerId}`),
  ]);
}

export async function getBookingById(bookingId) {
  logger.info("Fetching booking by ID");
  return cacheQuery({
    key: `booking:byId:${bookingId}`,
    queryFn: () => BookingModel.findById(bookingId),
  });
}

export async function getCustomerBookingsById(customerId) {
  logger.info("Fetching customer bookings");
  return cacheQuery({
    key: `booking:byCustomer:${customerId}`,
    queryFn: () => BookingModel.find({ customerId }),
  });
}

export async function getPartnerBookingsById(partnerId) {
  logger.info("Fetching partner bookings");
  return cacheQuery({
    key: `booking:byPartner:${partnerId}`,
    queryFn: () => BookingModel.find({ partnerId }),
  });
}

export async function setBookingStatusById(bookingId, status) {
  logger.info("Setting booking status");
  try {
    const booking = await BookingModel.findByIdAndUpdate(
      bookingId,
      { status },
      { new: true }
    );
    logger.info(`Booking status updated: ${booking}`);
    await invalidateBookingCache(booking);
    return booking;
  } catch (error) {
    logger.error(`Error updating booking status: ${error.message}`);
    throw new Error(`Error updating booking status: ${error.message}`);
  }
}

export async function createNewBooking(bookingData) {
  logger.info("Creating new booking", bookingData);
  try {
    const booking = await BookingModel.create(bookingData);
    logger.info(`New booking created: ${booking}`);

    await invalidateBookingCache(booking);

    // Schedule jobs for notifications and status updates
    const bookingTime = new Date(booking.bookingTime);
    const preNotifyDelay = Math.max(
      bookingTime.getTime() - 5 * 60 * 1000 - Date.now(),
      0
    );
    const statusUpdateDelay = Math.max(bookingTime.getTime() - Date.now(), 0);

    logger.info(
      `Pre-notify delay: ${Math.floor(preNotifyDelay / 60000)}m ${Math.floor(
        (preNotifyDelay % 60000) / 1000
      )}s`
    );

    logger.info(
      `Status update delay: ${Math.floor(
        statusUpdateDelay / 60000
      )}m ${Math.floor((statusUpdateDelay % 60000) / 1000)}s`
    );

    await bookingServiceNotifyQueue.add(
      "booking-service-preNotify",
      {
        bookingId: booking._id,
        partnerId: booking.partnerId,
        customerId: booking.customerId,
      },
      {
        delay: preNotifyDelay,
        jobId: `preNotify:${booking._id}`,
      }
    );

    await bookingServiceStausQueue.add(
      "booking-service-status",
      {
        bookingId: booking._id,
      },
      {
        delay: statusUpdateDelay,
        jobId: `statusUpdate:${booking._id}`,
      }
    );

    logger.info(
      `Booking created and scheduled for notifications: ${booking._id}`
    );

    return booking;
  } catch (error) {
    logger.error(`Error creating booking: ${error.message}`);
    throw new Error(`Error creating booking: ${error.message}`);
  }
}

export async function setBookingLateStatusById(bookingId, lateStatus) {
  logger.info("Setting booking late status");
  try {
    const updated = await BookingModel.findByIdAndUpdate(
      bookingId,
      { isRunningLate: lateStatus, runningLateNotifiedAt: new Date() },
      { new: true }
    );
    logger.info(`Booking late status updated: ${updated}`);
    await invalidateBookingCache(updated);
    return updated;
  } catch (error) {
    logger.error(`Error updating booking late status: ${error.message}`);
    throw new Error(`Error updating booking late status: ${error.message}`);
  }
}

export async function setBookingLateBumpCountById(bookingId, lateBumpCount) {
  logger.info("Setting booking late bump count");
  try {
    const updated = await BookingModel.findByIdAndUpdate(
      bookingId,
      { lateBumpCount },
      { new: true }
    );
    logger.info(`Booking late bump count updated: ${updated}`);
    await invalidateBookingCache(updated);
    return updated;
  } catch (error) {
    logger.error(`Error updating booking late bump count: ${error.message}`);
    throw new Error(`Error updating booking late bump count: ${error.message}`);
  }
}

export async function setBookingCompleteStatusById(bookingId, status) {
  logger.info("Setting booking complete status");
  try {
    const booking = await BookingModel.findByIdAndUpdate(
      bookingId,
      { status },
      { new: true }
    );
    logger.info(`Booking complete status updated: ${booking}`);
    await invalidateBookingCache(booking);
    return booking;
  } catch (error) {
    logger.error(`Error updating booking status: ${error.message}`);
    throw new Error(`Error updating booking status: ${error.message}`);
  }
}

export async function setBookingCancelStatusById(bookingId, status) {
  logger.info("Setting booking cancel status");
  try {
    const booking = await BookingModel.findByIdAndUpdate(
      bookingId,
      { status },
      { new: true }
    );
    logger.info(`Booking cancel status updated: ${booking}`);
    await invalidateBookingCache(booking);
    return booking;
  } catch (error) {
    logger.error(`Error updating booking status: ${error.message}`);
    throw new Error(`Error updating booking status: ${error.message}`);
  }
}
