import React from 'react'
import Ellipse from "../../assets/images/Ellipse.png";

const Header = () => {
  return (
    <div>
      <div className="flex flex-row sm:flex-row justify-between items-center mb-5 
        space-y-3 sm:space-y-0 border-b border-b-[#8F969A3B] pb-3">

        <div className="">
          <p className="text-[16px] sm:text-2xl font-bold">Welcome</p>
          <p className="text-[12px] sm:text-base">
            Here’s an overview of your receipt
          </p>
        </div>

        <div className="flex items-center gap-2 sm:gap-3 lg:ml-4">
          <img
            src={Ellipse}
            alt="profile"
            className="w-10 h-10 sm:w-12 sm:h-12 rounded-full"
          />
          <p className="text-[12px] sm:text-base font-medium">Mary Paul</p>
        </div>
      </div>
    </div>
  )
}

export default Header
