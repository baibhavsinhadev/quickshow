import { useUser } from "@clerk/clerk-react";
import { createContext, useContext, useEffect, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { dummyShowsData } from "../assets/assets";

const AppContext = createContext();

export const AppProvider = ({ children }) => {

    const { user } = useUser();

    const currency = import.meta.env.VITE_CURRENCY
    const navigate = useNavigate();
    const location = useLocation();

    const [showsData, setShowsData] = useState([]);

    // Fetch Show Data
    const fetchShowsData = async () => {
        setShowsData(dummyShowsData);
    };

    useEffect(() => {
        fetchShowsData();
    }, []);

    const value = {
        navigate, location, user, showsData,
        currency
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