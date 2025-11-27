import React from "react";
import { FaSchool, FaRegQuestionCircle, FaUserGraduate } from "react-icons/fa";
import { RiLiveLine } from "react-icons/ri";
import Ranking from "../../components/admin-components/Ranking";




const Dashboard = () => {
  const stats = [
    {
      icon: <FaSchool size={26} />,
      label: "Total Schools",
      value: "150",
      color: "bg-[#1115CB]",
    },
    {
      icon: <FaRegQuestionCircle size={26} />,
      label: "Questions Asked",
      value: "10.2K",
      color: "bg-black",
    },
    {
      icon: <RiLiveLine size={26} />,
      label: "Active Matches",
      value: "6",
      color: "bg-[#C837AB]",
    },
    {
      icon: <FaUserGraduate size={26} />,
      label: "Active Students",
      value: "3,000+",
      color: "bg-[#641408]",
    },
  ];

  return (
    <div className="">
    <div className="p-4 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
      {stats.map((item, index) => (
        <div
          key={index}
          className={`${item.color} text-white p-4 rounded-xl flex sm:block  items-center gap-4 shadow-lg`}
        >
          <div className="text-white">{item.icon}</div>

          <div>
            <p className="text-sm font-medium">{item.label}</p>
            <p className="text-2xl font-bold">{item.value}</p>
          </div>
        </div>
        
      ))}
    </div>
    <Ranking />
    </div>
  );
};

export default Dashboard;
