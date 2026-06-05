import { LayoutDashboardIcon, ListCollapseIcon, ListIcon, PlusSquareIcon } from "lucide-react";
import { useAppContext } from "../../context/AppContext";
import { NavLink } from "react-router-dom";

const Sidebar = () => {

    const { user } = useAppContext();

    const adminNavLinks = [
        {
            name: "Dashboard",
            path: "/admin",
            icon: LayoutDashboardIcon
        },
        {
            name: "Add Shows",
            path: "/admin/add-show",
            icon: PlusSquareIcon
        },
        {
            name: "List Shows",
            path: "/admin/list-shows",
            icon: ListIcon
        },
        {
            name: "List Bookings",
            path: "/admin/list-bookings",
            icon: ListCollapseIcon
        },
    ]

    return (
        <div className="h-[calc(100vh-64px)] md:flex flex-col items-center pt-8 max-w-13 md:max-w-60 w-full border-r border-gray-300/20 text-sm">
            <img src={user.imageUrl} alt="imageUrl" className="h-9 md:h-14 w-9 md:w-14 rounded-full mx-auto" />

            <p className="mt-2 text-base max-md:hidden">{user.firstName} {user.lastName}</p>

            <div className="w-full">
                {adminNavLinks.map((link) => {
                    const Icon = link.icon

                    return (
                        <NavLink className={({ isActive }) => `relative flex items-center max-md:justify-center gap-2 w-full py-2.5 md:pl-10 first:mt-6 text-gray-400 ${isActive && "bg-primary/15 text-primary group"}`} end key={link.name} to={link.path}>
                            {({ isActive }) => (
                                <>
                                    <Icon className="w-5 h-5" />
                                    <p>{link.name}</p>

                                    <span className={`w-1.5 h-10 rounded-l right-0 absolute ${isActive && "bg-primary"}`} />
                                </>
                            )}
                        </NavLink>
                    );
                })}
            </div>
        </div>
    );
};

export default Sidebar;