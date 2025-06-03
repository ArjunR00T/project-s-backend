import { Queue } from "bullmq";
import connection from "./bull-mq-client.js";

export const bookingServiceNotifyQueue = new Queue(
  "booking-service-preNotify",
  { connection }
);

export const bookingServiceStausQueue = new Queue("booking-service-status", {
  connection,
});

export const bookingServiceQueueEventsNotify = bookingServiceNotifyQueue.on(
  "error",
  (error) => {
    console.error("Booking Service pre notify Queue Error:", error);
  }
);

export const bookingServiceQueueEventsStatus = bookingServiceStausQueue.on(
  "error",
  (error) => {
    console.error("Booking Service status Queue Error:", error);
  }
);
