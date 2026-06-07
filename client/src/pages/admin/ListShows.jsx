import { useEffect, useState } from "react";
import { useAppContext } from "../../context/AppContext";
import { toast } from "react-toastify";
import Loading from "../../components/Loading";
import Title from "../../components/admin/Title";
import dateFormat from "../../lib/dateFormat";
import api from "../../api/api";

const ListShows = () => {

    const { currency, user } = useAppContext();

    const [shows, setShows] = useState([]);
    const [loading, setLoading] = useState(true);

    // Fetch All Shows
    const fetchAllShows = async () => {
        try {
            const { data } = await api.get("/admin/shows");

            if (data.success) {
                setShows(data.shows);
            } else {
                toast.error(data.message)
            };
        } catch (error) {
            console.log(error);
            toast.error("Internal Server Error");
        } finally {
            setLoading(false)
        };
    };

    useEffect(() => {
        if (user) {
            fetchAllShows();
        }
    }, [user])

    return !loading ? (
        <>
            <Title text1="List" text2="Shows" />

            <div className="max-w-4xl mt-6 overflow-x-auto">
                <table className="w-full border-collapse rounded-md overflow-hidden text-nowrap">
                    <thead>
                        <tr className="bg-primary/20 text-left text-white">
                            <th className="p-2 font-medium pl-5">Movie Name</th>
                            <th className="p-2 font-medium">Show Time</th>
                            <th className="p-2 font-medium">Total Bookings</th>
                            <th className="p-2 font-medium">Earnings</th>
                        </tr>
                    </thead>

                    <tbody className="text-sm font-light">
                        {shows.map((show, index) => (
                            <tr key={show._id} className="border-b border-primary/10 bg-primary/5 even:bg-primary/10">
                                <td className="p-2 min-w-45 pl-5">{show.movie.title}</td>
                                <td className="p-2">{dateFormat(show.showDateTime)}</td>
                                <td className="p-2">{Object.keys(show.occupiedSeats).length}</td>
                                <td className="p-2">{currency}{Object.keys(show.occupiedSeats).length * show.showPrice}</td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        </>
    ) : (
        <Loading />
    );
};

export default ListShows;