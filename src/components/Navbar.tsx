import React from 'react';
import { useNavigate } from 'react-router-dom';
const Navbar = () => {
  const navigate = useNavigate()
  return (
    <nav className="bg-black flex justify-between items-center p-4">
      <div className="text-white"></div>
      <div>
        <button onClick={()=>{navigate('login')}} className="bg-blue-500 text-white px-4 py-2 rounded mr-2">Sign In</button>
        <button onClick={()=>{navigate('signup')}} className="bg-blue-500 text-white px-4 py-2 rounded">Sign Up</button>
      </div>
    </nav>
  );
};

export default Navbar;

