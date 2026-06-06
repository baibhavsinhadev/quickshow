import { clerkClient } from "@clerk/express";
import logger from "../config/logger.js";
import Booking from "../models/Booking.js";
import Movie from "../models/Movie.js";

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

// API Controller Function to Add Favorite Movie in Clerk User Meta Data : POST /api/user/favorite
export const addFavorite = async (req, res) => {
    try {
        const { movieId } = req.body;
        const userId = req.auth.userId;

        const user = await clerkClient.users.getUser(userId);

        if (!user.privateMetadata.favorites) {
            user.privateMetadata.favorites = []
        };

        if (!user.privateMetadata.favorites.includes(movieId)) {
            user.privateMetadata.favorites.push(movieId);
        };

        await clerkClient.users.updateUserMetadata(userId, {
            privateMetadata: user.privateMetadata
        });

        res.status(200).json({
            success: true,
            message: "Favorite added successfully"
        });
    } catch (error) {
        logger.error({ error }, "Add Favorite Movie Error");

        return res.status(500).json({
            success: false,
            message: "Internal Server Error",
        });
    };
};

// API Controller Function to Update Favorite Movie in Clerk User Meta Data : POST /api/user/favorite/:movieId
export const updateFavorite = async (req, res) => {
    try {
        const { movieId } = req.params;
        const userId = req.auth.userId;

        const user = await clerkClient.users.getUser(userId);

        if (!user.privateMetadata.favorites) {
            user.privateMetadata.favorites = []
        };

        if (!user.privateMetadata.favorites.includes(movieId)) {
            user.privateMetadata.favorites.push(movieId);
        } else {
            user.privateMetadata.favorites = user.privateMetadata.favorites.filter((item) => item !== movieId);
        };

        await clerkClient.users.updateUserMetadata(userId, {
            privateMetadata: user.privateMetadata
        });

        res.status(200).json({
            success: true,
            message: "Favorite movies updated"
        });
    } catch (error) {
        logger.error({ error }, "Update Favorite Movie Error");

        return res.status(500).json({
            success: false,
            message: "Internal Server Error",
        });
    };
};

// API Controller Function to Get Favorite Movie in Clerk User Meta Data : GET /api/user/favorite
export const getFavorite = async (req, res) => {
    try {
        const userId = req.auth.userId;

        const user = await clerkClient.users.getUser(userId);
        const favorites = user.privateMetadata.favorites;

        // Get movies from database
        const movies = await Movie.find({ _id: { $in: favorites } });

        res.status(200).json({
            success: true,
            movies
        });
    } catch (error) {
        logger.error({ error }, "Get Favorite Movies Error");

        return res.status(500).json({
            success: false,
            message: "Internal Server Error",
        });
    };
};