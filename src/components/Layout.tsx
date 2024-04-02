import React from "react";
import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import Navbar from "./Navbar";
import Login from "./Login";
import RegisterModal from "./RegisterModal";
import MapComponent from "./map";
import Auth from "./Auth";

const Layout = () => {
  return (
    <Router>
      <Navbar />
      <MapComponent/>
      <Routes>
        {/* <Route path='/' element={<Home />} />*/}
        <Route path='/login' element={<Auth />} /> 
        <Route path='/signup' element={<RegisterModal />} />
      </Routes>
    </Router>
  );
};

export default Layout;
