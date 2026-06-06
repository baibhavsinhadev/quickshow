import { Router } from "express";
import { addShow, getNowPlayingMovies, getShowById, getShows } from "../controllers/showController.js";
import protectAdmin from "../middleware/authAdmin.js";

const showRouter = Router();

showRouter.post("/", protectAdmin, addShow);
showRouter.get("/", protectAdmin, getNowPlayingMovies);
showRouter.get("/all", getShows);
showRouter.get("/:id", getShowById);

export default showRouter;