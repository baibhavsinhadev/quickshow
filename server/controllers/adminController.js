import logger from "../config/logger.js";
import Booking from "../models/Booking.js";
import Show from "../models/Show.js";
import User from "../models/User.js";

// API to check if user id Admin : GET /api/admin/is-admin
export const isAdmin = async (req, res) => {
    res.status(200).json({
        success: true,
        isAdmin: true
    });
};

// API to get dashboard data : GET /api/admin/dashboard
export const getDashboardData = async (req, res) => {
    try {
        const bookings = await Booking.find({ isPaid: true });
        const activeShows = await Show.find({ showDateTime: { $gte: new Date() } }).populate("movie");

        const totalUser = await User.countDocuments();

        const dashboardData = {
            totalBookings: bookings.length,
            totalRevenue: bookings.reduce((acc, booking) => acc + booking.amount, 0),
            activeShows,
            totalUser
        };

        res.status(200).json({
            success: true,
            dashboardData
        });
    } catch (error) {
        logger.error({ error }, "Getting Dashboard Data Error");

        return res.status(500).json({
            success: false,
            message: "Internal Server Error",
        });
    };
};

// API to get all shows : GET /api/admin/shows
export const getAllShows = async (req, res) => {
    try {
        const shows = await Show.find({ showDateTime: { $gte: new Date() } }).populate("movie").sort();
        if (!shows) {
            return res.status(400).json({
                success: false,
                message: "Shows Not Found"
            });
        };

        res.status(200).json({
            success: true,
            shows
        });
    } catch (error) {
        logger.error({ error }, "Getting All Shows Error");

        return res.status(500).json({
            success: false,
            message: "Internal Server Error",
        });
    };
};

// API to get bookings : GET /api/admin/bookings
export const getAllBookings = async (req, res) => {
    try {
        const bookings = await Booking.find({}).populate("user").populate({
            path: "show",
            populate: {
                path: "movie"
            }
        }).sort({ createdAt: -1 });

        if (!bookings) {
            return res.status(400).json({
                success: false,
                message: "Bookings Not Found"
            });
        };

        res.status(200).json({
            success: true,
            bookings
        });
    } catch (error) {
        logger.error({ error }, "Getting All Bookings Error");

        return res.status(500).json({
            success: false,
            message: "Internal Server Error",
        });
    };
};