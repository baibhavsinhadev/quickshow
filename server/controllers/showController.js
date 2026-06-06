import api from "../config/api.js";
import logger from "../config/logger.js";
import Movie from "../models/Movie.js";
import Show from "../models/Show.js";

// Get Now Playing Movies : GET /api/show
export const getNowPlayingMovies = async (req, res) => {
    try {
        const token = process.env.TMDP_READ_ACCESS_TOKEN;
        if (!token) {
            logger.error("TMDB token missing");

            return res.status(500).json({
                success: false,
                message: "Server configuration error",
            });
        };

        const { data } = await api.get("/movie/now_playing", {
            params: {
                language: "en-US",
                page: 1,
            },
        });

        const movies = data.results;
        return res.status(200).json({
            success: true,
            movies,
        });
    } catch (error) {
        logger.error({ error }, "Getting Playing Movies Error");

        res.status(500).json({
            success: false,
            message: "Internal Server Error",
        });
    };
};

// Add a new show : POST /api/show
export const addShow = async (req, res) => {
    try {
        const { movieId, showsInput, showPrice } = req.body;
        if (!showsInput) {
            return res.status(400).json({
                success: false,
                message: "Shows Input is required",
            });
        };

        if (!showPrice) {
            return res.status(400).json({
                success: false,
                message: "Show Price is required",
            });
        };

        let movie = await Movie.findById(movieId);
        if (!movie) {
            // Fetch movie details and credits from TMDB API
            const [movieDetailsResponse, movieCreditsResponse] = await Promise.all([
                api.get(`/movie/${movieId}`),
                api.get(`/movie/${movieId}/credits`)
            ]);

            const movieAPIDate = movieDetailsResponse.data;
            const movieCreditsDate = movieCreditsResponse.data;

            const movieDetails = {
                _id: movieId,
                title: movieAPIDate.title,
                overview: movieAPIDate.overview,
                poster_path: movieAPIDate.poster_path,
                backdrop_path: movieAPIDate.backdrop_path,
                genres: movieAPIDate.genres,
                casts: movieAPIDate.cast,
                release_date: movieAPIDate.release_date,
                original_language: movieAPIDate.original_language,
                tagline: movieAPIDate.tagline || "",
                vote_average: movieAPIDate.vote_average,
                runtime: movieAPIDate.runtime
            };

            // Add movie to the database
            movie = await Movie.create(movieDetails);
        };

        const showsToCreate = [];
        showsInput.forEach((show) => {
            const showDate = show.date;

            show.time.forEach((time) => {
                const dateTimeString = `${showDate}T${time}`;
               
                showsToCreate.push({
                    movie: movieId,
                    showDateTime: new Date(dateTimeString),
                    showPrice,
                    occupiedSeats: {}
                });
            });
        });

        if (showsToCreate.length > 0) {
            await Show.insertMany(showsToCreate);
        };

        return res.status(200).json({
            success: true,
            message: "Show Added Successfully",
        });
    } catch (error) {
        logger.error({ error }, "Adding New Movies Error");

        res.status(500).json({
            success: false,
            message: "Internal Server Error",
        });
    };
};