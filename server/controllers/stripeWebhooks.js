import stripe from "stripe";
import logger from "../config/logger.js";
import Booking from "../models/Booking.js";

const stripeWebhooks = async (request, response) => {
    const stripeInstance = new stripe(process.env.STRIPE_SECRET_KEY);
    const sig = request.headers["stripe-signature"];

    let event;

    try {
        event = stripeInstance.webhooks.constructEvent(request.body, sig, process.env.STRIPE_WEBHOOK_SECRET);
    } catch (error) {
        logger.error({ error }, "Stripe Webhooks Error");
        return response.status(400).send("Internal Server Error");
    };

    try {
        switch (event.type) {
            case "payment_intent.succeeded": {
                const paymentIntent = event.data.object;

                const sessionList = await stripeInstance.checkout.sessions.list({
                    payment_intent: paymentIntent.id
                });

                const session = sessionList.data[0];
                const { bookingId } = session.metadata;

                await Booking.findByIdAndUpdate(bookingId, {
                    isPaid: true,
                    paymentLink: ""
                });

                break;
            }

            default:
                console.error("Unhandled event type: ", event.type)
                break;
        };

        response.status(200).json({ success: true });
    } catch (error) {
        logger.error({ error }, "Stripe Webhooks Error");
        return response.status(400).send("Internal Server Error");
    };
};

export default stripeWebhooks;