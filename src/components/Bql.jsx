import React from 'react'
import removebg from "../assets/images/removebg.png";

const Bql = () => {
  return (
    <nav className="bg-[#001489] p-2 flex items-center px-6 sm:px-12 rounded-t-lg">
      <img 
        src={removebg} 
        alt="Bolo Quiz League Logo" 
        className="w-24 sm:w-28 md:w-32  h-auto object-contain"
      />
    </nav>
  );
};

export default Bql;
