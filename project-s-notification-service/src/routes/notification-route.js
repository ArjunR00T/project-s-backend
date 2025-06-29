// routes/notification-route.js

import { Router } from 'express';
import notificationController from '../controller/notification-controller.js';
const route = Router();

// Ping route for health check
route.route("/ping").get((req, res) => {
    res.status(200).json({ message: "User service says: PONG!" });
});
// Send request to partner
route.route("/sendrequest/").post(notificationController.sendNotificationToPartner);
// Handle response from partner (accept/reject)
route.route("/partnerresponse/").post(notificationController.handlePartnerResponse);

export default route;
