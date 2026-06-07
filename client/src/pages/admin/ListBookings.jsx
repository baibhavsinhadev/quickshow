import { useEffect, useState } from "react";
import { useAppContext } from "../../context/AppContext";
import Loading from "../../components/Loading";
import Title from "../../components/admin/Title";
import dateFormat from "../../lib/dateFormat";
import api from "../../api/api";
import { toast } from "react-toastify";

const ListBookings = () => {

    const { currency, user } = useAppContext();

    const [bookings, setBookings] = useState([]);
    const [loading, setLoading] = useState(true);

    // Fetch All Bookings
    const fetchAllBookings = async () => {
        try {
            const { data } = await api.get("/admin/bookings");

            if (data.success) {
                setBookings(data.bookings);
            } else {
                toast.error(data.message)
            };
        } catch (error) {
            console.log(error.message);
        } finally {
            setLoading(false)
        }
    };

    useEffect(() => {
        if (user) {
            fetchAllBookings();
        };
    }, [user])

    return !loading ? (
        <>
            <Title text1="List" text2="Bookings" />

            <div className="max-w-4xl mt-6 overflow-x-auto">
                <table className="w-full border-collapse rounded-md overflow-hidden text-nowrap">
                    <thead>
                        <tr className="bg-primary/20 text-left text-white">
                            <th className="p-2 font-medium pl-5">User Name</th>
                            <th className="p-2 font-medium">Movie Name</th>
                            <th className="p-2 font-medium">Show Time</th>
                            <th className="p-2 font-medium">Seats</th>
                            <th className="p-2 font-medium">Amount</th>
                        </tr>
                    </thead>

                    <tbody className="text-sm font-light">
                        {bookings.length === 0 ? (
                            <tr className="border-b border-primary/10 bg-primary/5 even:bg-primary/10">
                                <td colSpan="5" className="text-center text-lg font-semibold p-4 text-white">
                                    No Bookings Yet
                                </td>
                            </tr>
                        ) : (
                            bookings.map((booking, index) => (
                                <tr key={booking._id} className="border-b border-primary/10 bg-primary/5 even:bg-primary/10">
                                    <td className="p-2 min-w-45 pl-5">{booking.user.name}</td>
                                    <td className="p-2">{booking.show.movie.title}</td>
                                    <td className="p-2">{dateFormat(booking.show.showDateTime)}</td>
                                    <td className="p-2">{Object.keys(booking.bookedSeats).map((seat) => booking.bookedSeats[seat]).join(", ")}</td>
                                    <td className="p-2">{currency}{booking.amount}</td>
                                </tr>
                            ))
                        )}
                    </tbody>
                </table>
            </div>
        </>
    ) : (
        <Loading />
    );
};

export default ListBookings;