import React from "react";
import { Link } from "react-router-dom";
import imglogo from "../../assets/images/imglogo.png";
import { MdMenuOpen } from "react-icons/md";
import { RxDashboard } from "react-icons/rx";
import { TbBracketsAngle } from "react-icons/tb";
import { IoIosSchool } from "react-icons/io";
import { FaClipboardQuestion } from "react-icons/fa6";
import { GiKevlarVest } from "react-icons/gi";
import { FaFileCode } from "react-icons/fa";
import { HiOutlineSignal } from "react-icons/hi2";
import { IoMdNotifications } from "react-icons/io";
import { IoLogOutOutline } from "react-icons/io5";

const Sidebar = ({ open, setOpen, selectedTab, setSelectedTab }) => {
  const menuItems = [
    { icons: <RxDashboard size={16} />, label: "Dashboard", path: "/admindashboard" },
    { icons: <IoIosSchool size={16} />, label: "School", path: "/schooladmin" },
    { icons: <TbBracketsAngle size={16} />, label: "Bracket", path: "/adminbracket" },
    { icons: <FaClipboardQuestion size={16} />, label: "Questions", path: "/question" },
    { icons: <GiKevlarVest size={16} />, label: "Live matches", path: "/live" },
    { icons: <HiOutlineSignal size={16} />, label: "Leaderboard", path: "/board" },
    { icons: <FaFileCode size={16} />, label: "Sessions", path: "/report" },
    { icons: <IoMdNotifications size={16} />, label: "Notification", path: "/notification" },
  ];

  return (
    <>
      {/* Mobile Overlay */}
      <div
        className={`fixed inset-0 bg-black/50 z-40 md:hidden transition-opacity ${
          open ? "opacity-100 pointer-events-auto" : "opacity-0 pointer-events-none"
        }`}
        onClick={() => setOpen(false)}
      />

      {/* Sidebar */}
      <nav
        className={`fixed top-0 left-0 min-h-full bg-[#001489] text-white z-50 flex flex-col transition-all duration-300
          ${open ? "w-48 md:w-60" : "w-16 md:w-60"} md:relative
        `}
      >
        {/* Header */}
        <div className="flex justify-between items-center p-4 border-b border-white/20">
          <img
            src={imglogo}
            alt="logo"
            className={`transition-all duration-300 rounded
              ${open ? "w-20 md:w-24 opacity-100" : "w-0 md:w-24 md:opacity-100 opacity-0"}
            `}
          />
          <MdMenuOpen
            size={28}
            className="cursor-pointer md:hidden"
            onClick={() => setOpen(!open)}
          />
        </div>

        {/* Menu Items */}
        <ul className="p-2 sm:p-4 flex-1 flex flex-col">
          {menuItems.map((item, index) => {
            const isActive = selectedTab === item.label;
            return (
              <Link
                to={item.path}
                key={index}
                onClick={() => setSelectedTab(item.label)}
              >
                <li
                  className={`flex items-center gap-3 p-2 sm:p-3 my-2 rounded-md cursor-pointer transition-all
                    ${isActive ? "bg-white text-[#001489]" : "text-white hover:bg-white/20"}
                  `}
                >
                  <span>{item.icons}</span>
                  <span
                    className={`transition-all duration-300 text-sm sm:text-base ${
                      open ? "inline-block" : "hidden md:inline-block"
                    }`}
                  >
                    {item.label}
                  </span>
                </li>
              </Link>
            );
          })}
        </ul>

        {/* Footer - Logout */}
        <div
          className="mt-auto flex items-center gap-3 p-3 bg-[#FF0041] rounded cursor-pointer"
          onClick={() => {
            // Add your logout function here
            console.log("Logout clicked");
          }}
        >
          <IoLogOutOutline size={24} className="text-white" />
          <span className={`${open ? "inline-block" : "hidden md:inline-block"} text-white`}>
            Logout
          </span>
        </div>
      </nav>
    </>
  );
};

export default Sidebar;

