import { Router } from "express";
import { addShow, getNowPlayingMovies } from "../controllers/showController.js";
import protectAdmin from "../middleware/authAdmin.js";

const showRouter = Router();

showRouter.post("/", protectAdmin, addShow);
showRouter.get("/", protectAdmin, getNowPlayingMovies);

export default showRouter;