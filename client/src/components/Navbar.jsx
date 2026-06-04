import { Link, NavLink } from "react-router-dom";
import { assets } from "../assets/assets";
import { MenuIcon, SearchIcon, TicketPlus, XIcon } from "lucide-react";
import { useEffect, useState } from "react";
import { useClerk, UserButton } from "@clerk/clerk-react";
import { useAppContext } from "../context/AppContext";

const Navbar = () => {

    const [isOpen, setIsOpen] = useState(false);
    const [scrolled, setScrolled] = useState(false);

    const { user, navigate } = useAppContext();
    const { openSignIn } = useClerk();

    useEffect(() => {
        const handleScroll = () => {
            setScrolled(window.scrollY > 10);
        };

        window.addEventListener("scroll", handleScroll);
        return () => window.removeEventListener("scroll", handleScroll);
    }, []);

    return (
        <div className={`fixed top-0 left-0 z-50 w-full flex items-center justify-between px-6 md:px-16 lg:px-36 py-5 transition-all duration-300 ${scrolled ? "backdrop-blur bg-white/10 border-b border-gray-300/20" : "bg-transparent"}`}>
            <Link className="max-md:flex-1" to="/">
                <img src={assets.logo} alt="logo" className="w-36 h-auto" />
            </Link>

            <div className={`max-md:absolute max-md:top-0 max-md:left-0 max-md:font-medium max-md:text-lg z-50 flex flex-col md:flex-row items-center max-md:justify-center gap-8 md:px-8 py-1 max-md:h-screen md:rounded-full backdrop-blur bg-black/70 md:bg-white/10 md:border border-gray-300/20 overflow-hidden transition-[width] duration-300 ${isOpen ? "max-md:w-full" : "max-md:w-0"}`}>
                <XIcon onClick={() => { setIsOpen(!isOpen); scrollTo(0, 0) }} className="md:hidden absolute top-6 right-6 w-6 h-6 cursor-pointer" />

                <NavLink onClick={() => { setIsOpen(!isOpen); scrollTo(0, 0) }} className={({ isActive }) => `transition duration-200 hover:text-primary ${isActive ? "text-primary" : ""}`} to="/">
                    Home
                </NavLink>

                <NavLink onClick={() => { setIsOpen(!isOpen); scrollTo(0, 0) }} className={({ isActive }) => `transition duration-200 hover:text-primary ${isActive ? "text-primary" : ""}`} to="/movies">
                    Movies
                </NavLink>

                <NavLink onClick={() => { setIsOpen(!isOpen); scrollTo(0, 0) }} className={({ isActive }) => `transition duration-200 hover:text-primary ${isActive ? "text-primary" : ""}`} to="/favorite">
                    Favorites
                </NavLink>

                <NavLink onClick={() => { setIsOpen(!isOpen); scrollTo(0, 0) }} className={({ isActive }) => `transition duration-200 hover:text-primary ${isActive ? "text-primary" : ""}`} to="/admin">
                    Admin
                </NavLink>
            </div>

            <div className="flex items-center gap-8">
                <SearchIcon className="max-md:hidden w-6 h-6 cursor-pointer" />

                {user ? (
                    <UserButton>
                        <UserButton.MenuItems>
                            <UserButton.Action onClick={() => navigate('/my-bookings')} label="My Bookings" labelIcon={<TicketPlus width={15} />} />
                        </UserButton.MenuItems>
                    </UserButton>
                ) : (
                    <button onClick={openSignIn} className="px-4 py-1 sm:px-7 sm:py-2 bg-primary hover:bg-primary-dull transition rounded-full font-medium cursor-pointer">Login</button>
                )}
            </div>

            <MenuIcon onClick={() => setIsOpen(!isOpen)} className="max-md:ml-4 md:hidden w-8 h-8 cursor-pointer" />
        </div>
    );
};

export default Navbar;