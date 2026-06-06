import { useUser } from "@clerk/clerk-react";
import { createContext, useContext, useEffect, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import api from "../api/api";

const AppContext = createContext();

export const AppProvider = ({ children }) => {

    const { user, isLoaded, isSignedIn } = useUser();

    const currency = import.meta.env.VITE_CURRENCY
    const navigate = useNavigate();
    const location = useLocation();

    const [isAdmin, setIsAdmin] = useState(false);
    const [showsData, setShowsData] = useState([]);
    const [favoriteMovies, setFavoriteMovies] = useState([]);

    // Fetch isAdmin
    const fetchIsAdmin = async () => {
        try {
            const { data } = await api.get("/admin/is-admin")

            if (data.success) {
                setIsAdmin(true)
            } else {
                toast.error(data.message);
            };
        } catch (error) {
            console.log(error.message);
        };
    };

    // Fetch Show Data
    const fetchShowsData = async () => {
        try {
            const { data } = await api.get("/show/all");

            if (data.success) {
                setShowsData(data.shows);
            } else {
                toast.error(data.message);
            };
        } catch (error) {
            console.log(error.message);
        };
    };

    useEffect(() => {
        fetchShowsData();
    }, []);

    useEffect(() => {
        if (user) {
            fetchIsAdmin();
        }
    }, [user])

    const value = {
        navigate, location, user, showsData,
        currency, isSignedIn, isLoaded, isAdmin
    };

    return (
        <AppContext.Provider value={value}>
            {children}
        </AppContext.Provider>
    );
};

export const useAppContext = () => {
    const context = useContext(AppContext);

    if (!context) {
        throw new Error("useAppContext must be within AppProvider");
    };

    return context;
};