import { Router } from "express";
import { addFavorite, getFavorite, getUserBookings, updateFavorite } from "../controllers/userController.js";

const userRouter = Router();

userRouter.post("/favorite", addFavorite);
userRouter.post("/favorite/:movieId", updateFavorite);
userRouter.get("/favorite", getFavorite);
userRouter.get("/bookings", getUserBookings);

export default userRouter;