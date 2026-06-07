import { inngest } from "./client.js";
import Booking from "../models/Booking.js";
import Show from "../models/Show.js";
import User from "../models/User.js";
import sendEmail from "../config/nodemailer.js";

// Inngest Functions to save user data to a database
const syncUserCreation = inngest.createFunction(
    { id: "sync-user-from-clerk", triggers: [{ event: "clerk/user.created" }] },
    async ({ event }) => {
        const { id, first_name, last_name, email_addresses, image_url } = event.data;
        const fullName = (first_name + " " + (last_name || "")).trim();

        const userData = {
            _id: id,
            email: email_addresses?.[0]?.email_address || "",
            name: fullName,
            image: image_url
        };

        await User.create(userData);
    }
);

// Inngest Functions to update user data
const syncUserUpdate = inngest.createFunction(
    { id: "update-user-from-clerk", triggers: [{ event: "clerk/user.updated" }] },
    async ({ event }) => {
        const { id, first_name, last_name, email_addresses, image_url } = event.data;
        const fullName = (first_name + " " + (last_name || "")).trim();

        const updatedData = {
            email: email_addresses?.[0]?.email_address || "",
            name: fullName,
            image: image_url,
        };

        await User.findByIdAndUpdate(id, updatedData, { upsert: true });
    }
);

// Inngest Functions to delete user data
const syncUserDeletion = inngest.createFunction(
    { id: "delete-user-from-clerk", triggers: [{ event: "clerk/user.deleted" }] },
    async ({ event }) => {
        const { id } = event.data;
        await User.findByIdAndDelete(id);
    }
);

// Inngest Functions to cancel booking and release seats of show after 10 minutes of booking created if payment is not made
const releaseSeatsAndDeleteBooking = inngest.createFunction(
    { id: "release-seats-delete-booking", triggers: [{ event: "app/checkpayment" }] },
    async ({ event, step }) => {
        const tenMinutesLater = new Date(Date.now() + 10 * 60 * 1000);

        await step.sleepUntil("wait-for-10-minutes", tenMinutesLater);
        await step.run("check-payment-status", async () => {
            const bookingId = event.data.bookingId;
            const booking = await Booking.findById(bookingId);

            // If payment is not made, release seats and delete booking
            if (!booking.isPaid) {
                const show = await Show.findById(booking.show);

                booking.bookedSeats.forEach((seat) => {
                    delete show.occupiedSeats[seat]
                });

                show.markModified("occupiedSeats");
                await show.save();
                await Booking.findByIdAndDelete(booking._id);
            };
        });
    }
);

// Inngest Function to send email when user books a show
const sendBookingConfirmationEmail = inngest.createFunction(
    { id: "send-booking-confirmation-email", triggers: [{ event: "app/show.booked" }] },
    async ({ event, step }) => {
        const { bookingId } = event.data;
        const booking = await Booking.findById(bookingId).populate({
            path: "show",
            populate: {
                path: "movie",
                model: "movie"
            }
        }).populate("user");

        await sendEmail({
            to: booking.user.email,
            subject: `Payment Confirmation: "${booking.show.movie.title}" booked`,
            body: `
                <div>
                    <div style="background:#F84565; padding:18px; text-align:center; font-size:20px; font-weight:bold;">
                        Booking Confirmed
                    </div>

                    <div style="padding:25px;">
                        <h2 style="margin-top:0;">Hi ${booking.user.name},</h2>

                        <p style="color:#ccc; font-size:14px;">
                            Your booking for 
                            <strong style="color:#F84565;">"${booking.show.movie.title}"</strong> 
                            has been successfully confirmed.
                        </p>

                        <div style="background:#1a1a1d; border-radius:10px; padding:15px; margin-top:20px;">
                            <p style="margin:8px 0; font-size:14px;">
                                <strong>Date:</strong>
                                ${new Date(booking.show.showDateTime).toLocaleDateString("en-US", { timeZone: "Asia/Kolkata" })}
                            </p>
                            
                            <p style="margin:8px 0; font-size:14px;">
                                <strong>Time:</strong>
                                ${new Date(booking.show.showDateTime).toLocaleTimeString("en-US", { timeZone: "Asia/Kolkata" })}
                            </p>

                            <p style="margin:8px 0; font-size:14px;">
                                <strong>Seats:</strong> ${booking.bookedSeats.join(", ")}
                            </p>

                            <p style="margin:8px 0; font-size:14px;">
                                <strong>Amount:</strong> ₹${booking.amount}
                            </p>
                        </div>

                        <div style="text-align:center; margin-top:25px;">
                            <a href="${process.env.CLIENT_URL}/my-bookings" style="background:#F84565; color:white; text-decoration:none; padding:12px 24px; border-radius:25px; font-size:14px; display:inline-block;"> 
                                View My Bookings → 
                            </a>
                        </div>

                        <p style="margin-top:30px; font-size:13px; color:#aaa;"> 
                            Enjoy your movie <br/><br/> 
                            Thanks for booking with us!<br/> 
                            <strong> - QuickShow Team</strong> 
                        </p>
                    </div>
                </div>
            `
        })
    }
)

export const functions = [
    syncUserCreation,
    syncUserUpdate,
    syncUserDeletion,
    releaseSeatsAndDeleteBooking,
    sendBookingConfirmationEmail
];