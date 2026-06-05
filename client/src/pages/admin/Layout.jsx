import { Outlet } from "react-router-dom"

const Layout = () => {
    return (
        <div>
            Layout Component
            {<Outlet />}
        </div>
    );
};

export default Layout;