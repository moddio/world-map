import React from 'react';
import {
  BrowserRouter as Router,
  Route,
  Routes /*useNavigate*/,
} from 'react-router-dom';
// import Navbar from "./Navbar";
// import Login from './Login';
import RegisterModal from './RegisterModal';
import MapComponent from './map';
import Auth from './Auth';
const Logo = require('../assets/images/doomr.png');

const Layout = () => {
  // const userDetails = JSON.parse(localStorage.getItem('user'));
  // const navigate = useNavigate();

  return (
    <Router>
      <div
        className='bg-white'
        style={{ backgroundColor: '#f0f8f0', userSelect: 'none' }}
      >
        {/* <Navbar /> */}
        <h1 className='fixed max-md:text-xl lg:text-5xl font-bold text-white text-left p-2 my-0'>
          <img alt='Doomr.io' className='w-32' src={Logo} />
        </h1>
        <Routes>
          {<Route path='/' element={<MapComponent showMarker={false} />} />}
          <Route path='/login' element={<Auth />} />
          <Route path='/signup' element={<RegisterModal />} />
          <Route path='/rough' element={<MapComponent showMarker={true} />} />
        </Routes>
      </div>
    </Router>
  );
};

export default Layout;
