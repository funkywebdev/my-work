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
    
    <Ranking />
    </div>
  );
};

export default Dashboard;
