

import React from 'react'
import Ellipse from "../../assets/images/Ellipse.png";

const Header = () => {
  return (
    <div className="px-3 sm:px-6">
      <div className="flex flex-row sm:flex-row justify-between items-start sm:items-center mb-4 sm:mb-5 border-b border-b-[#8F969A3B] pb-3">

        {/* Welcome Text */}
        <div className="flex flex-col">
          <p className="text-sm sm:text-xl font-bold">Welcome</p>
          <p className="text-xs sm:text-sm text-gray-700">
            Here’s an overview of your receipt
          </p>
        </div>

        {/* Profile */}
        <div className="flex items-center gap-2 sm:gap-3 mt-3 sm:mt-0">
          <img
            src={Ellipse}
            alt="profile"
            className="w-8 h-8 sm:w-12 sm:h-12 rounded-full"
          />
          <p className="text-xs sm:text-sm font-medium">Mary Paul</p>
        </div>
      </div>
    </div>
  )
}

export default Header;


