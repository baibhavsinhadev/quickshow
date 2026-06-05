import { useEffect, useState } from "react";
import { useAppContext } from "../../context/AppContext";
import Loading from "../../components/Loading";
import Title from "../../components/admin/Title";
import dateFormat from "../../lib/dateFormat";

const ListShows = () => {

    const { currency, showsData, user } = useAppContext();

    const [shows, setShows] = useState([]);
    const [loading, setLoading] = useState(true);

    // Fetch All Shows
    const fetchAllShows = async () => {
        try {
            setShows([
                {
                    movie: showsData[0],
                    showDateTime: "2025-06-30T02:30:00.000Z",
                    showPrice: 59,
                    occupiedSeats: {
                        A1: "user_1",
                        B1: "user_2",
                        C1: "user_3",
                    }
                },
                {
                    movie: showsData[1],
                    showDateTime: "2025-08-30T02:30:00.000Z",
                    showPrice: 59,
                    occupiedSeats: {
                        A1: "user_1",
                        B1: "user_2",
                        C1: "user_3",
                        D1: "user_1",
                        E1: "user_2",
                        F1: "user_3",
                    }
                },
                {
                    movie: showsData[2],
                    showDateTime: "2025-12-30T02:30:00.000Z",
                    showPrice: 59,
                    occupiedSeats: {
                        A1: "user_1",
                        B1: "user_2",
                        C1: "user_3",
                        D1: "user_1",
                        E1: "user_2"
                    }
                },
            ]);

            setTimeout(() => {
                setLoading(false);
            }, 2000);
        } catch (error) {
            console.log(error)
        }
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