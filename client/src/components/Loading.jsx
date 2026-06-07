import { useParams } from "react-router-dom";
import { useAppContext } from "../context/AppContext";
import { useEffect } from "react";

const Loading = () => {

    const { nextUrl } = useParams();
    const { navigate } = useAppContext();

    useEffect(() => {
        if (nextUrl) {
            setTimeout(() => {
                navigate("/" + nextUrl);
            }, 8000);  
        };
    }, []);

    return (
        <div className="flex items-center justify-center min-h-screen">
            <div className="w-12 h-12 border-4 border-primary border-t-transparent rounded-full animate-spin" />
        </div>
    );
};

export default Loading;