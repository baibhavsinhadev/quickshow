import { Router } from "express";
import { createBooking, getOccupiedSeats } from "../controllers/bookingController.js";

const bookingRouter = Router();

bookingRouter.post("/", createBooking);
bookingRouter.get("/:showId", getOccupiedSeats);

export default bookingRouter;