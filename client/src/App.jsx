import { ToastContainer } from 'react-toastify'
import { Navigate, Route, Routes } from 'react-router-dom';
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
import { useEffect } from 'react';
import Loading from './components/Loading';

const App = () => {

  const { location, isLoaded, isSignedIn } = useAppContext();
  const isAdminRoute = location.pathname.startsWith("/admin");

  if (!isLoaded) {
    return <Loading />;
  }

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
        <Route path='/my-bookings' element={isSignedIn ? <MyBookings /> : <Navigate to="/" />} />
        <Route path='/favorite' element={isSignedIn ? <Favorite /> : <Navigate to="/" />} />

        {/* Admin Routes */}
        <Route path='/admin' element={isSignedIn ? <Layout /> : <Navigate to="/" />}>
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