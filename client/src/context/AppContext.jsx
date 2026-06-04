import { useUser } from "@clerk/clerk-react";
import { createContext, useContext } from "react";
import { useLocation, useNavigate } from "react-router-dom";

const AppContext = createContext();

export const AppProvider = ({ children }) => {

    const navigate = useNavigate();
    const location = useLocation();

    const { user } = useUser();

    const value = {
        navigate, location, user
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