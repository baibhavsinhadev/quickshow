import { useEffect, useState } from "react";
import { useAppContext } from "../../context/AppContext";
import { dummyBookingData } from "../../assets/assets";
import Loading from "../../components/Loading";
import BlurCircle from "../../components/BlurCircle";
import timeFormat from "../../lib/timeFormat";
import dateFormat from "../../lib/dateFormat";
import api from "../../api/api";
import { toast } from "react-toastify";

const MyBookings = () => {

    const { currency, user } = useAppContext();

    const [bookings, setBookings] = useState([]);
    const [loading, setLoading] = useState(true);

    // Fetch My Bookings
    const getMyBookings = async () => {
        try {
            const { data } = await api.get("/user/bookings");

            if (data.success) {
                setBookings(data.bookings);
            } else {
                toast.error(data.message);
            };
        } catch (error) {
            console.log(error);
            toast.error("Internal Server Error");
        } finally {
            setLoading(false)
        }
    };

    useEffect(() => {
        if (user) {
            getMyBookings();
        }
    }, [user])

    return !loading ? (
        <div className="relative px-6 md:px-16 lg:px-40 pt-30 md:pt-40 min-h-[80vh]">
            <BlurCircle top="100px" left="100px" />

            <div>
                <BlurCircle bottom="0" left="600px" />
            </div>

            {bookings.length !== 0 && <h1 className="text-lg font-semibold mb-4">My Bookings</h1>}

            {bookings.length === 0 ? (
                <div className="flex justify-center items-center">
                    <h1 className="text-4xl font-bold mt-35">No Bookings Found</h1>
                </div>
            ) : (
                bookings.map((booking) => (
                    <div key={booking._id} className="flex flex-col md:flex-row justify-between bg-primary/8 border border-primary/20 rounded-lg mt-4 p-2 max-w-3xl">
                        <div className="flex flex-col md:flex-row">
                            <img src={booking.show.movie.poster_path} className="md:max-w-45 aspect-video h-auto object-cover object-bottom rounded" alt={booking.show.movie.title} />

                            <div className="flex flex-col p-4">
                                <p className="text-lg font-semibold">{booking.show.movie.title}</p>

                                <p className="text-gray-400 text-sm">{timeFormat(booking.show.movie.runtime)}</p>

                                <p className="text-gray-400 text-sm mt-auto">{dateFormat(booking.show.showDateTime)}</p>
                            </div>
                        </div>

                        <div className="flex flex-col md:items-end md:text-right justify-between p-4">
                            <div className="flex items-center gap-4">
                                <p className="text-2xl font-semibold mb-3">
                                    {currency}{booking.amount}
                                </p>

                                {!booking.isPaid && (
                                    <button className="bg-primary px-4 py-1.5 mb-3 text-sm rounded-full font-medium cursor-pointer">
                                        Pay Now
                                    </button>
                                )}
                            </div>

                            <div className="text-sm">
                                <p>
                                    <span className="text-gray-400">Total Tickets: </span>
                                    {booking.bookedSeats.length}
                                </p>

                                <p>
                                    <span className="text-gray-400">Seat Number: </span>
                                    {booking.bookedSeats.join(", ")}
                                </p>
                            </div>
                        </div>
                    </div>
                ))
            )}
        </div>
    ) : (
        <Loading />
    );
};

export default MyBookings;