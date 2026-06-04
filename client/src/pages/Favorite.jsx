import { useEffect, useState } from "react";
import { useAppContext } from "../context/AppContext";
import { dummyShowsData } from "../assets/assets";
import MovieCard from "../components/MovieCard";
import BlurCircle from "../components/BlurCircle";
import { toast } from "react-toastify";

const Favorite = () => {

    const { user, navigate } = useAppContext();
    const [favoriteShow, setFavoriteShow] = useState([]);

    // Fetch Favorite Show
    const fetchFavoriteShow = async () => {
        setFavoriteShow(dummyShowsData);
    };

    useEffect(() => {
        if (user) {
            fetchFavoriteShow();
        };
    }, [user]);

    return favoriteShow.length > 0 ? (
        <div className="relative my-40 mb-60 px-6 md:px-16 lg:px-40 xl:px-44 overflow-hidden min-h-[80vh]">
            <BlurCircle top="150px" left="0px" />
            <BlurCircle bottom="50px" right="50px" />

            <h1 className="text-lg font-medium my-4">Your Favorite Movies</h1>

            <div className="flex flex-wrap max-sm:justify-center gap-8">
                {favoriteShow.map((favorite) => (
                    <MovieCard key={favorite._id} movie={favorite} />
                ))}
            </div>
        </div>
    ) : (
        <div>
            <h1 className="text-3xl font-bold text-center">No Movies Available</h1>
        </div>
    );
};

export default Favorite;