import logger from "../config/logger.js";
import Booking from "../models/Booking.js";

// API Controller Function to Get User Bookings : GET /api/user/bookings
export const getUserBookings = async (req, res) => {
    try {
        const userId = req.auth.userId;
        const limit = Math.min(Number(req.query.limit) || 10, 50);

        const bookings = await Booking.find({ user: userId }).populate({
            path: "show",
            populate: {
                path: "movie"
            }
        }).sort({ createdAt: -1 }).limit(limit).lean();

        res.status(200).json({
            success: true,
            bookings
        })
    } catch (error) {
        logger.error({ error }, "Getting User Bookings Error");

        return res.status(500).json({
            success: false,
            message: "Internal Server Error",
        });
    }
};