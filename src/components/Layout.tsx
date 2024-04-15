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

const Layout = () => {
  // const userDetails = JSON.parse(localStorage.getItem('user'));
  // const navigate = useNavigate();

  return (
    <Router>
      <div className='bg-white' style={{ backgroundColor: '#f0f8f0', userSelect: 'none' }}>
        {/* <Navbar /> */}
        <h1 className='fixed max-md:text-xl lg:text-5xl font-bold text-white text-left p-2 my-0'>
          Doomr.io
        </h1>
        <MapComponent />
        <Routes>
          {/* <Route path='/' element={<Home />} />*/}
          <Route path='/login' element={<Auth />} />
          <Route path='/signup' element={<RegisterModal />} />
        </Routes>
      </div>
    </Router>
  );
};

export default Layout;
