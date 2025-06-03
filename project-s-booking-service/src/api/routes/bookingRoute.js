import express from "express";
import bookingController from "../controller/bookingController.js";

const router = express.Router();
// Define the routes for booking

router.route("/ping").get((req, res) => {
  res.status(200).json({ message: "Booking service says: PONG!" });
});

router.route("/create").post(bookingController.createBooking); // working
router.route("/:bookingId").get(bookingController.getBookings); // working
router
  .route("/customer/:customerId")
  .get(bookingController.getCustomerBookings); //working
router.route("/partner/:partnerId").get(bookingController.getPartnerBookings); //working
router.route("/update/:bookingId").post(bookingController.setBookingStatus); //working
router.route("/late/:bookingId").post(bookingController.setBookingLateStatus); // working
router
  .route("/bump/:bookingId")
  .post(bookingController.setBookingLateBumpCount);
router
  .route("/markComplete/:bookingId")
  .post(bookingController.setBookingCompleteStatus); //wokring, not so useful, its same as set status
router
  .route("/cancel/:bookingId")
  .post(bookingController.setBookingCancelStatus); // same as set status, but with cancel status

// Keep calcel and markcomplete if we have to do somethin special in future, like sending speicif notification or something

export default router;
