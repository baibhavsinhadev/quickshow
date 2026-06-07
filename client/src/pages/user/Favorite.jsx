import { useEffect, useState } from "react";
import { useAppContext } from "../../context/AppContext";
import { toast } from "react-toastify";
import { Link } from "react-router-dom";
import { ArrowRight, Film } from "lucide-react";
import MovieCard from "../../components/user/MovieCard";
import BlurCircle from "../../components/BlurCircle";
import api from "../../api/api";

const Favorite = () => {

    const { user, navigate, favoriteMovies } = useAppContext();

    return favoriteMovies.length > 0 ? (
        <div className="relative my-40 mb-60 px-6 md:px-16 lg:px-40 xl:px-44 overflow-hidden min-h-[80vh]">
            <BlurCircle top="150px" left="0px" />
            <BlurCircle bottom="50px" right="50px" />

            <h1 className="text-lg font-medium my-4">Your Favorite Movies</h1>

            <div className="flex flex-wrap max-sm:justify-center gap-8">
                {favoriteMovies.map((favorite) => (
                    <MovieCard key={favorite._id} movie={favorite} />
                ))}
            </div>
        </div>
    ) : (
        <div className="min-h-screen flex flex-col items-center justify-center">
            <div className="bg-white/5 p-6 rounded-full mb-6 shadow-lg border border-white/10">
                <Film size={48} className="text-white/80" />
            </div>

            <h1 className="text-3xl md:text-4xl font-bold text-center mb-3">No Movies Available</h1>

            <p className="text-gray-400 text-center max-w-md mb-8">You haven't added any favorite movies yet. Explore and save the ones you love.</p>

            <Link to="/movies" className="flex items-center gap-2 bg-primary px-6 py-3 rounded-full font-medium text-white hover:bg-primary-dull transition-all duration-200">
                Go to Movies
                <ArrowRight size={18} />
            </Link>
        </div>
    );
};

export default Favorite;