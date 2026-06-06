import { Outlet } from "react-router-dom"
import { useAppContext } from "../../context/AppContext";
import { useEffect } from "react";
import { toast } from "react-toastify";
import AdminNavbar from "../../components/admin/AdminNavbar";
import Sidebar from "../../components/admin/Sidebar";

const Layout = () => {

    const { isAdmin, navigate } = useAppContext();

    useEffect(() => {
        if (!isAdmin) {
            navigate("/");
            toast.error("You are not authorized to access admin dashboard");
        }
    }, [isAdmin]);

    return (
        <>
            <AdminNavbar />

            <div className="flex">
                <Sidebar />

                <div className="flex-1 px-4 py-10 md:px-10 h-[calc(100vh-64px)] overflow-y-auto">
                    <Outlet />
                </div>
            </div>
        </>
    );
};

export default Layout;