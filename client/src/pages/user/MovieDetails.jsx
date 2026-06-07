import { useParams } from "react-router-dom";
import { useAppContext } from "../../context/AppContext";
import { useEffect, useState } from "react";
import { dummyDateTimeData } from "../../assets/assets";
import BlurCircle from "../../components/BlurCircle";
import { HeartIcon, PlayCircleIcon, StarIcon } from "lucide-react";
import timeFormat from "../../lib/timeFormat";
import DateSelect from "../../components/user/DateSelect";
import MovieCard from "../../components/user/MovieCard";
import Loading from "../../components/Loading";
import api from "../../api/api";
import { toast } from "react-toastify";

const MovieDetails = () => {

    const { id } = useParams();
    const { navigate, showsData, user, favoriteMovies, fetchFavoritesMovies } = useAppContext();

    const [show, setShow] = useState(null);

    // Fetch Each Show Details
    const getShow = async () => {
        try {
            const { data } = await api.get(`/show/${id}`);

            if (data.success) {
                setShow(data)
            } else {
                toast.error(data.message)
            };
        } catch (error) {
            console.log(error.message);
            toast.error("Internal Server Error")
        };
    };

    // Handle Favorite
    const handleFavorite = async () => {
        try {
            if (!user) toast.warn("Please login to proceed");

            const { data } = await api.post(`/user/favorite/${id}`);
            if (data.success) {
                await fetchFavoritesMovies();
                toast.success(data.message);
            } else {
                toast.error(data.message);
            }
        } catch (error) {
            console.log(error.message);
            toast.error("Internal Server Error")
        };
    };

    useEffect(() => {
        getShow();
    }, [id]);

    return show ? (
        <div className="px-6 md:px-16 lg:px-40 pt-30 md:pt-40">
            <div className="flex flex-col md:flex-row gap-8 max-w-6xl mx-auto">
                <img src={show?.movie?.poster_path} alt={show?.movie?.title} className="max-md:mx-auto rounded-xl h-104 max-w-70 object-cover" />

                <div className="relative flex flex-col gap-3">
                    <BlurCircle top="-100px" left="-100px" />
                    <p className="text-primary">ENGLISH</p>

                    <h1 className="text-4xl font-semibold max-w-96 text-balance">{show.movie.title}</h1>

                    <div className="flex items-center gap-2 text-gray-300">
                        <StarIcon className="w-5 h-5 text-primary fill-primary" />
                        {show.movie.vote_average.toFixed(1)} User Rating
                    </div>

                    <p className="text-gray-400 mt-2 text-sm leading-tight max-w-xl">{show.movie.overview}</p>

                    <p>
                        {timeFormat(show.movie.runtime)} • {show.movie.genres.map((genre) => genre.name).join(" | ")} • {show.movie.release_date.split("-")[0]}
                    </p>

                    <div className="flex items-center flex-wrap gap-4 mt-4">
                        <button className="flex items-center gap-2 px-7 py-3 text-sm bg-gray-800 hover:bg-gray-900 transition rounded-md font-medium cursor-pointer active:scale-95">
                            <PlayCircleIcon className="w-5 h-5" />
                            Watch Trailer
                        </button>

                        <a href="#dateSelect" className="px-10 py-3 text-sm bg-primary hover:bg-primary-dull transition rounded-md font-medium cursor-pointer active:scale-95">Buy Tickets</a>

                        <button onClick={handleFavorite} className="bg-gray-700 p-2.5 rounded-full transition cursor-pointer active:scale-95">
                            <HeartIcon className={`w-5 h-5 transition-all duration-200 cursor-pointer ${favoriteMovies.some((movie) => movie._id === id)
                                    ? "fill-primary text-primary"
                                    : "text-gray-400 hover:text-primary-dull"
                                }`} />
                        </button>
                    </div>
                </div>
            </div>

            <p className="text-lg font-medium mt-20">Your Favorite Cast</p>

            <div className="overflow-x-auto mt-8 pb-4">
                <div className="flex items-center gap-4 w-max px-4">
                    {show.movie.casts.filter((cast) => cast.profile_path).slice(0, 10).map((cast) => (
                        <div key={cast.name} className="flex flex-col items-center text-center">
                            <img src={cast.profile_path} alt="profile" className="rounded-full  h-20 aspect-square object-cover object-top" />

                            <p className="text-xs font-medium mt-3">{cast.name}</p>
                        </div>
                    ))}
                </div>
            </div>

            <DateSelect dateTime={show.dateTime} id={id} />

            <p className="text-lg font-medium mt-20 mb-8">You may also like</p>

            <div className="flex flex-wrap max-sm:justify-center gap-8">
                {showsData.slice(0, 4).map((show) => (
                    <MovieCard key={show._id} movie={show} />
                ))}
            </div>

            <div className="flex justify-center mt-20">
                <button onClick={() => { navigate("/movies"); scrollTo(0, 0) }} className="px-10 py-3 text-sm bg-primary hover:bg-primary-dull transition rounded-md font-medium cursor-pointer">Show more</button>
            </div>
        </div>
    ) : (
        <Loading />
    );
};

export default MovieDetails;