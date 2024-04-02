import React from 'react';

const Navbar = () => {
  return (
    <nav className="bg-black flex justify-between items-center p-4">
      <div className="text-white"></div>
      <div>
        <a href='/signin' className="bg-blue-500 text-white px-4 py-2 rounded mr-2">Sign In</a>
        <a href='/signup' className="bg-blue-500 text-white px-4 py-2 rounded">Sign Up</a>
      </div>
    </nav>
  );
};

export default Navbar;

