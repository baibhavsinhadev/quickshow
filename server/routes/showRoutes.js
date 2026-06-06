import { Router } from "express";
import { addShow, getNowPlayingMovies } from "../controllers/showController.js";

const showRouter = Router();

showRouter.post("/", addShow);
showRouter.get("/", getNowPlayingMovies);

export default showRouter;