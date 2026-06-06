import mongoose from "mongoose";
import Booking from "../models/Booking.js";
import Show from "../models/Show.js";
import logger from "../config/logger.js";

// Function to check availability of selected seats for a movie
const checkSeatsAvailability = async (showId, selectedSeats) => {
    try {
        const showData = await Show.findById(showId);
        if (!showData) false;

        const occupiedSeats = showData.occupiedSeats;

        const isAnySeatTaken = selectedSeats.some((seat) => occupiedSeats[seat]);
        return !isAnySeatTaken;
    } catch (error) {
        logger.error({ error }, "Check Seat Availability Error");
        return false;
    };
};

// Create Bookings : POST /api/booking
export const createBooking = async (req, res) => {
    try {
        const { userId } = req.auth;
        const { showId, selectedSeats } = req.body;
        const { origin } = req.headers;

        // Check if the seat is available for the selected show
        const isAvailable = await checkSeatsAvailability(showId, selectedSeats);
        if (!isAvailable) {
            if (shows.length === 0) {
                return res.status(404).json({
                    success: false,
                    message: "Selected seats are not available",
                });
            };
        };

        // Get the show details
        const showData = await Show.findById(showId).populate("movie");

        // Create a new booking
        const booking = await Booking.create({
            user: userId,
            show: showId,
            amount: showData.showPrice * selectedSeats.length,
            bookedSeats: selectedSeats
        });

        selectedSeats.map((seat) => {
            showData.occupiedSeats[seat] = userId;
        });

        showData.markModified("occupiedSeats");
        await showData.save();

        // Stripe Gateway Initialize

        return res.status(200).json({
            success: true,
            message: "Booked your seat successfully"
        });
    } catch (error) {
        logger.error({ error }, "Create Booking Error");

        return res.status(500).json({
            success: false,
            message: "Internal Server Error",
        });
    };
};

// Get Occupied Seats : GET /api/booking/:showId
export const getOccupiedSeats = async (req, res) => {
    try {
        const { showId } = req.params;
        if (!showId || !mongoose.Types.ObjectId.isValid(showId)) {
            return res.status(400).json({
                success: false,
                message: "Invalid show ID",
            });
        };

        // Fetch only required field (performance + security)
        const showData = await Show.findById(showId).select("occupiedSeats");
        if (!showData) {
            return res.status(404).json({
                success: false,
                message: "Show not found",
            });
        };

        const occupiedSeats = Object.keys(showData.occupiedSeats || {});

        return res.status(200).json({
            success: true,
            occupiedSeats
        });
    } catch (error) {
        logger.error({ error }, "Get Occupied Seats Error");

        return res.status(500).json({
            success: false,
            message: "Internal Server Error",
        });
    }
};