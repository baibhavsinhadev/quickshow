import { ToastContainer } from 'react-toastify'
import { Route, Routes, useLocation } from 'react-router-dom';
import { Favorite, Home, MovieDetails, Movies, MyBookings, SeatLayout } from './pages/index'
import Navbar from './components/Navbar';
import Footer from './components/Footer';

const App = () => {

  const isAdminRoute = useLocation().pathname.startsWith("/admin")

  return (
    <>
      <ToastContainer />
      {!isAdminRoute && <Navbar />}

      <Routes>
        <Route path='/' element={<Home />} />
        <Route path='/movies' element={<Movies />} />
        <Route path='/movies/:id' element={<MovieDetails />} />
        <Route path='/movies/:id/:date' element={<SeatLayout />} />
        <Route path='/my-bookings' element={<MyBookings />} />
        <Route path='/favorite' element={<Favorite />} />
      </Routes>

      {!isAdminRoute && <Footer />}
    </>
  );
};

export default App;