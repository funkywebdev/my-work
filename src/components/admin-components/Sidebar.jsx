// import React from "react";
// import { Link, useNavigate } from "react-router-dom"; // <-- add useNavigate
// import imglogo from "../../assets/images/imglogo.png";
// import { MdMenuOpen } from "react-icons/md";
// import { RxDashboard } from "react-icons/rx";
// import { TbBracketsAngle } from "react-icons/tb";
// import { IoIosSchool } from "react-icons/io";
// import { FaClipboardQuestion } from "react-icons/fa6";
// import { GiKevlarVest } from "react-icons/gi";
// import { FaFileCode } from "react-icons/fa";
// import { HiOutlineSignal } from "react-icons/hi2";
// import { IoMdNotifications } from "react-icons/io";
// import { IoLogOutOutline } from "react-icons/io5";

// const Sidebar = ({ open, setOpen, selectedTab, setSelectedTab }) => {
//   const navigate = useNavigate(); // <-- initialize navigate

//   const menuItems = [
//     { icons: <RxDashboard size={16} />, label: "Dashboard", path: "/admindashboard" },
//     { icons: <IoIosSchool size={16} />, label: "School", path: "/schooladmin" },
//     { icons: <TbBracketsAngle size={16} />, label: "Bracket", path: "/adminbracket" },
//     { icons: <FaClipboardQuestion size={16} />, label: "Questions", path: "/question" },
//     { icons: <GiKevlarVest size={16} />, label: "Live matches", path: "/live-matches" },
//     { icons: <HiOutlineSignal size={16} />, label: "Leaderboard", path: "/board" },
//   ];

//   const handleLogout = () => {
//     // 1. Clear token or user data
//     localStorage.removeItem("adminToken"); // adjust key based on your app
//     // 2. Redirect to login page
//     navigate("/login");
//   };

//   return (
//     <>
//       {/* Mobile Overlay */}
//       <div
//         className={`fixed inset-0 bg-black/50 z-40 md:hidden transition-opacity ${
//           open ? "opacity-100 pointer-events-auto" : "opacity-0 pointer-events-none"
//         }`}
//         onClick={() => setOpen(false)}
//       />

//       {/* Sidebar */}
//       <nav
//         className={`fixed top-0 left-0 min-h-full bg-[#001489] text-white z-50 flex flex-col transition-all duration-300
//           ${open ? "w-48 md:w-60" : "w-16 md:w-60"} md:relative
//         `}
//       >
//         {/* Header */}
//         <div className="flex justify-between items-center p-4 border-b border-white/20">
//           <img
//             src={imglogo}
//             alt="logo"
//             className={`transition-all duration-300 rounded
//               ${open ? "w-20 md:w-24 opacity-100" : "w-0 md:w-24 md:opacity-100 opacity-0"}
//             `}
//           />
//           <MdMenuOpen
//             size={28}
//             className="cursor-pointer md:hidden"
//             onClick={() => setOpen(!open)}
//           />
//         </div>

//         {/* Menu Items */}
//         <ul className="p-2 sm:p-4 flex-1 flex flex-col">
//           {menuItems.map((item, index) => {
//             const isActive = selectedTab === item.label;
//             return (
//               <Link
//                 to={item.path}
//                 key={index}
//                 onClick={() => setSelectedTab(item.label)}
//               >
//                 <li
//                   className={`flex items-center gap-3 p-2 sm:p-3 my-2 rounded-md cursor-pointer transition-all
//                     ${isActive ? "bg-white text-[#001489]" : "text-white hover:bg-white/20"}
//                   `}
//                 >
//                   <span>{item.icons}</span>
//                   <span
//                     className={`transition-all duration-300 text-sm sm:text-base ${
//                       open ? "inline-block" : "hidden md:inline-block"
//                     }`}
//                   >
//                     {item.label}
//                   </span>
//                 </li>
//               </Link>
//             );
//           })}
//         </ul>

//         {/* Footer - Logout */}
//         <div
//           className="mt-auto flex items-center gap-3 p-3 bg-[#FF0041] rounded cursor-pointer"
//           onClick={handleLogout} // <-- use the function here
//         >
//           <IoLogOutOutline size={24} className="text-white" />
//           <span className={`${open ? "inline-block" : "hidden md:inline-block"} text-white`}>
//             Logout
//           </span>
//         </div>
//       </nav>
//     </>
//   );
// };

// export default Sidebar;




// import React from "react";
// import { Link, useNavigate, useLocation } from "react-router-dom";
// import imglogo from "../../assets/images/imglogo.png";
// import { MdMenuOpen } from "react-icons/md";
// import { RxDashboard } from "react-icons/rx";
// import { TbBracketsAngle } from "react-icons/tb";
// import { IoIosSchool } from "react-icons/io";
// import { FaClipboardQuestion } from "react-icons/fa6";
// import { GiKevlarVest } from "react-icons/gi";
// import { HiOutlineSignal } from "react-icons/hi2";
// import { IoLogOutOutline } from "react-icons/io5";

// const Sidebar = ({ open, setOpen }) => {
//   const navigate = useNavigate();
//   const location = useLocation(); // 👈 ACTIVE ROUTE

//   const menuItems = [
//     { icon: <RxDashboard size={16} />, label: "Dashboard", path: "/admindashboard" },
//     { icon: <IoIosSchool size={16} />, label: "School", path: "/schooladmin" },
//     { icon: <TbBracketsAngle size={16} />, label: "Bracket", path: "/adminbracket" },
//     { icon: <FaClipboardQuestion size={16} />, label: "Questions", path: "/question" },
//     { icon: <GiKevlarVest size={16} />, label: "Live matches", path: "/live-matches" },
//     { icon: <HiOutlineSignal size={16} />, label: "Leaderboard", path: "/board" },
//   ];

//   const handleLogout = () => {
//     localStorage.removeItem("adminToken");
//     navigate("/login");
//   };

//   const isActive = (path) => location.pathname === path;

//   return (
//     <>
//       {/* Mobile Overlay */}
//       <div
//         className={`fixed inset-0 bg-black/50 z-40 md:hidden transition-opacity ${
//           open ? "opacity-100" : "opacity-0 pointer-events-none"
//         }`}
//         onClick={() => setOpen(false)}
//       />

//       {/* Sidebar */}
//       <aside
//         className={`fixed md:relative top-0 left-0 z-50 h-screen bg-[#001489] text-white
//         transition-all duration-300 flex flex-col
//         ${open ? "w-56" : "w-16"} md:w-60`}
//       >
//         {/* Header */}
//         <div className="flex items-center justify-between p-4 border-b border-white/20">
//           <img
//             src={imglogo}
//             alt="logo"
//             className={`transition-all duration-300 ${
//               open ? "w-24 opacity-100" : "w-0 opacity-0 md:w-24 md:opacity-100"
//             }`}
//           />
//           <MdMenuOpen
//             size={28}
//             className="cursor-pointer md:hidden"
//             onClick={() => setOpen(!open)}
//           />
//         </div>

//         {/* Menu */}
//         <ul className="flex-1 p-3">
//           {menuItems.map((item) => (
//             <Link
//               key={item.path}
//               to={item.path}
//               onClick={() => setOpen(false)} // 👈 auto-close on mobile
//             >
//               <li
//                 className={`flex items-center gap-3 p-3 my-1 rounded-md transition
//                 ${
//                   isActive(item.path)
//                     ? "bg-white text-[#001489]"
//                     : "hover:bg-white/20"
//                 }`}
//               >
//                 {item.icon}
//                 <span
//                   className={`text-sm transition-all ${
//                     open ? "block" : "hidden md:block"
//                   }`}
//                 >
//                   {item.label}
//                 </span>
//               </li>
//             </Link>
//           ))}
//         </ul>

//         {/* Logout */}
//         <div
//           onClick={handleLogout}
//           className="flex items-center gap-3 p-3 m-3 bg-[#FF0041] rounded cursor-pointer"
//         >
//           <IoLogOutOutline size={22} />
//           <span className={`${open ? "block" : "hidden md:block"}`}>Logout</span>
//         </div>
//       </aside>
//     </>
//   );
// };

// export default Sidebar;





import React from "react";
import { Link, useNavigate, useLocation } from "react-router-dom";
import imglogo from "../../assets/images/imglogo.png";
import { MdMenuOpen } from "react-icons/md";
import { RxDashboard } from "react-icons/rx";
import { TbBracketsAngle } from "react-icons/tb";
import { IoIosSchool } from "react-icons/io";
import { FaClipboardQuestion } from "react-icons/fa6";
import { GiKevlarVest } from "react-icons/gi";
import { HiOutlineSignal } from "react-icons/hi2";
import { IoLogOutOutline } from "react-icons/io5";

const Sidebar = ({ open, setOpen }) => {
  const navigate = useNavigate();
  const location = useLocation();

  const menuItems = [
    { icon: <RxDashboard />, label: "Dashboard", path: "/admindashboard" },
    { icon: <IoIosSchool />, label: "School", path: "/schooladmin" },
    { icon: <TbBracketsAngle />, label: "Bracket", path: "/adminbracket" },
    { icon: <FaClipboardQuestion />, label: "Questions", path: "/question" },
    { icon: <GiKevlarVest />, label: "Live matches", path: "/live-matches" },
    { icon: <HiOutlineSignal />, label: "Leaderboard", path: "/board" },
  ];

  const handleLogout = () => {
    localStorage.removeItem("adminToken");
    navigate("/login");
  };

  const isActive = (path) => location.pathname === path;

  return (
    <>
      {/* Mobile Overlay */}
      <div
        className={`fixed inset-0 bg-black/50 z-40 md:hidden transition-opacity duration-300 ${
          open ? "opacity-100" : "opacity-0 pointer-events-none"
        }`}
        onClick={() => setOpen(false)}
      />

      {/* Sidebar */}
      <aside
        className={`fixed md:relative top-0 left-0 z-50 h-screen bg-[#001489] text-white
        transition-all duration-300 flex flex-col
        ${open ? "w-60" : "w-16"} md:w-64`}
      >
        {/* Header */}
        <div className="flex items-center justify-between p-4 border-b border-white/20">
          <img
            src={imglogo}
            alt="logo"
            className={`transition-all duration-300 ${
              open
                ? "w-28 opacity-100"
                : "w-0 opacity-0 md:w-28 md:opacity-100"
            }`}
          />
          <MdMenuOpen
            size={28}
            className="cursor-pointer md:hidden"
            onClick={() => setOpen(!open)}
          />
        </div>

        {/* Menu */}
        <ul className="flex-1 px-3 py-4">
          {menuItems.map((item) => (
            <Link
              key={item.path}
              to={item.path}
              onClick={() => setOpen(false)}
            >
              <li
                className={`flex items-center
                gap-3 md:gap-3 lg:gap-4
                p-2 md:p-2
                my-2 md:my-3
                rounded-lg transition-all duration-200
                ${
                  isActive(item.path)
                    ? "bg-white text-[#001489]"
                    : "hover:bg-white/20"
                }`}
              >
                <span className="text-base md:text-[20px] lg:text-[24px]">
                  {item.icon}
                </span>

                <span
                  className={`font-thin transition-all
                  text-sm md:text-base lg:text-lg
                  ${open ? "block" : "hidden md:block"}`}
                >
                  {item.label}
                </span>
              </li>
            </Link>
          ))}
        </ul>

        {/* Logout */}
        <div
          onClick={handleLogout}
          className="flex items-center
          gap-3 md:gap-4
          p-3 md:p-4
          m-3
          bg-[#FF0041]
          rounded-lg
          cursor-pointer
          hover:opacity-90
          transition"
        >
          <IoLogOutOutline className="text-lg md:text-xl" />
          <span
            className={`font-thin
            text-sm md:text-base
            ${open ? "block" : "hidden md:block"}`}
          >
            Logout
          </span>
        </div>
      </aside>
    </>
  );
};

export default Sidebar;

