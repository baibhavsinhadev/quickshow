import { ToastContainer } from 'react-toastify'
import { Route, Routes } from 'react-router-dom';
import { Favorite, Home, MovieDetails, Movies, MyBookings, SeatLayout } from './pages/user/index'
import { useAppContext } from './context/AppContext';
import Navbar from './components/user/Navbar';
import Footer from './components/user/Footer';
import Layout from './pages/admin/Layout';
import Dashboard from './pages/admin/Dashboard';
import AddShow from './pages/admin/AddShow';
import ListShows from './pages/admin/ListShows';
import ListBookings from './pages/admin/ListBookings';
import ScrollToTop from './components/ScrollToTop';

const App = () => {

  const { location } = useAppContext();
  const isAdminRoute = location.pathname.startsWith("/admin")

  return (
    <>
      <ToastContainer />
      <ScrollToTop />
      {!isAdminRoute && <Navbar />}

      <Routes>
        {/* User Routes */}
        <Route path='/' element={<Home />} />
        <Route path='/movies' element={<Movies />} />
        <Route path='/movies/:id' element={<MovieDetails />} />
        <Route path='/movie/:id/:date' element={<SeatLayout />} />
        <Route path='/my-bookings' element={<MyBookings />} />
        <Route path='/favorite' element={<Favorite />} />

        {/* Admin Routes */}
        <Route path='/admin' element={<Layout />}>
          <Route index element={<Dashboard />} />
          <Route path='add-show' element={<AddShow />} />
          <Route path='list-shows' element={<ListShows />} />
          <Route path='list-bookings' element={<ListBookings />} />
        </Route>
      </Routes>

      {!isAdminRoute && <Footer />}
    </>
  );
};

export default App;