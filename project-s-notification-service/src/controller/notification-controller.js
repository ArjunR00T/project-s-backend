// controllers/notification-controller.js

import admin from 'firebase-admin';

const getFcmToken = async (userId) => {
    const response = await axios.get(`http://192.168.29.217:5000/api/user/getfcm/${userId}`);
    if (!response.data.fcmToken) throw new Error(`FCM token not found for user: ${userId}`);
    return response.data.fcmToken;
};

const sendNotificationToPartner = async (req, res) => {
    const { customerId, partnerId } = req.body;

    try {
        const partnerFcmToken = await getFcmToken(partnerId);

        // // Save booking with 'pending' status
        // const booking = await Booking.create({
        //   customerId,
        //   partnerId,
        //   serviceType,
        //   bookingTime,
        //   status: 'pending',
        // });

        // Send FCM to partner
        const message = {
            token: partnerFcmToken,
            notification: {
                title: 'New Booking Request',
                body: `${serviceType} requested by customer`
            },
            data: {
                bookingId: booking._id.toString(),
                customerId,
                serviceType,
                type: 'booking_request'
            }
        };

        await admin.messaging().send(message);
        res.json({ success: true, bookingId: booking._id });
    } catch (error) {
        console.error('Error sending to partner:', error.message);
        res.status(500).json({ error: error.message });
    }
};


const handlePartnerResponse = async (req, res) => {
    const { partnerId, customerId, response } = req.body;

    try {

        // Send notification to customer
        const customerFcmToken = await getFcmToken(customerId);

        const message = {
            token: customerFcmToken,
            notification: {
                title: 'Booking Response',
                body: `Your booking was ${response} by the partner`
            },
            data: {
                partnerId,
                type: 'booking_response'
            }
        };

        await admin.messaging().send(message);
        res.json({ success: true });
    } catch (error) {
        console.error('Error handling partner response:', error.message);
        res.status(500).json({ error: error.message });
    }
};

export default {
    sendNotificationToPartner,
    handlePartnerResponse
};