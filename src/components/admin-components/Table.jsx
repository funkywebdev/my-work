import React, { useState } from "react";
import { FiSearch } from "react-icons/fi";
import { HiAdjustmentsHorizontal } from "react-icons/hi2";
import { LuArrowUpDown } from "react-icons/lu";


const SchoolListResponsive = ({ schools }) => {
  const [selected, setSelected] = useState(null);
     console.log(schools)

  const handleAccept = (index) => {
    // Update status locally
    const updatedSchools = [...schools];
    updatedSchools[index].status = "Approved";
    setSchools(updatedSchools);
  };

  return (
    <div className="bg-[#F8FAFC] p-4 rounded-md">
      {/* Search + Filter */}
      <div className="flex flex-col sm:flex-row justify-between gap-4 w-full mb-4">
        <div className="flex items-center bg-white border border-gray-300 rounded-md px-3 py-2 w-full sm:w-[48%] shadow-sm">
          <FiSearch className="text-gray-400 mr-2" size={20} />
          <input
            type="text"
            placeholder="Search school name"
            className="outline-none w-full"
          />
        </div>

        <div className="flex items-center bg-white border border-gray-300 rounded-md px-3 py-2 cursor-pointer w-full sm:w-auto shadow-sm">
          <HiAdjustmentsHorizontal className="text-gray-400 mr-2" size={20} />
          <span className="font-medium">Filters</span>
        </div>
      </div>

      <div className="md:hidden mt-4 space-y-4">
  {schools.map((item, index) => (
    <div
      key={index}
      className="bg-white shadow-md rounded-md p-4 grid grid-cols-1 gap-4"
    >
      {/* School Name */}
      <div>
        <p className="font-semibold text-[#1115CB]">School Name</p>
        <p className="text-sm text-gray-600">{item.name}</p>
      </div>

      {/* Students */}
      <div>
        <p className="font-semibold text-[#1115CB]">Students</p>
        <p className="text-sm text-gray-600">{item.student}</p>
      </div>

      {/* Contact */}
      <div>
        <p className="font-semibold text-[#1115CB]">Contact</p>
        <p className="text-sm text-gray-600">{item.contactPhone}</p>
      </div>

      {/* Email */}
      <div>
        <p className="font-semibold text-[#1115CB]">Email</p>
        <p className="text-sm text-gray-600">{item.contactEmail}</p>
      </div>

      {/* Address */}
      <div>
        <p className="font-semibold text-[#1115CB]">Address</p>
        <p className="text-sm text-gray-600">{item.address}</p>
      </div>

      {/* Status */}
      <div>
        <p className="font-semibold text-[#1115CB] mb-1">Status</p>
        <button
          className="px-3 py-1 bg-[#1115CB] text-white rounded text-sm"
          onClick={() => handleAccept(index)}
        >
          Accept
        </button>
      </div>
    </div>
  ))}
</div>

{/* DESKTOP VIEW */}
<div className="hidden md:block bg-white shadow-md rounded-md mt-4 overflow-x-auto">
  {/* Table Header */}
  <div className="grid grid-cols-[50px_200px_100px_150px_200px_150px_100px] px-4 py-3 bg-gray-100 font-semibold border-b border-gray-300 text-sm">
    <div></div>
    <div className="text-[#1115CB] flex items-center gap-2">School Name <LuArrowUpDown /></div>
    <div className="text-[#1115CB] flex items-center gap-2">Students <LuArrowUpDown /></div>
    <div className="text-[#1115CB] flex items-center gap-2">Contact <LuArrowUpDown /></div>
    <div className="text-[#1115CB] flex items-center gap-2">Email <LuArrowUpDown /></div>
    <div className="text-[#1115CB] flex items-center gap-2">Address <LuArrowUpDown /></div>
    <div className="text-[#1115CB] flex items-center gap-2">Status <LuArrowUpDown /></div>
  </div>

  {/* Table Rows */}
  {schools.map((item, index) => (
    <div
      key={index}
      className="grid grid-cols-[50px_200px_100px_150px_200px_150px_100px] px-4 py-3 border-b border-gray-200 items-center text-sm"
    >
      <input
        type="radio"
        name="selectSchool"
        checked={selected === index}
        onChange={() => setSelected(index)}
        className="mr-2"
      />
      <div className="truncate">{item.name}</div>
      <div>{item.student}</div>
      <div className="truncate">{item.contactPhone}</div>
      <div className="truncate">{item.contactEmail}</div>
      <div className="truncate">{item.address}</div>
      <div>
        <button
          className="px-3 py-1 bg-[#1115CB] text-white rounded text-sm"
          onClick={() => handleAccept(index)}
        >
          Accept
        </button>
      </div>
    </div>
  ))}
</div>


    </div>
  );
};

export default SchoolListResponsive;
