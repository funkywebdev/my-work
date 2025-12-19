
import React, { useState, useEffect } from "react";
import removebg from "../assets/images/removebg.png";
import Ellipse35 from "../assets/images/Ellipse35.png";
import { Navbar as NavbarMenu } from "../mockdata/data2";
import { IoMenuOutline, IoCloseOutline } from "react-icons/io5";
import { FiLogOut, FiUsers } from "react-icons/fi";
import { motion, AnimatePresence } from "framer-motion";
import { Link, useLocation, useNavigate } from "react-router-dom";
import axios from "axios";

const baseUrl = "https://bql-production.up.railway.app";

const Nav2 = () => {
  const [menuOpen, setMenuOpen] = useState(false);
  const [user, setUser] = useState(null);
  const [loadingUser, setLoadingUser] = useState(true);
  const [totalUsers, setTotalUsers] = useState(null);

  const location = useLocation();
  const navigate = useNavigate();
  const currentPath = location.pathname;

  const handleLogout = () => {
    localStorage.removeItem("schoolToken");
    localStorage.removeItem("AdminToken");
    localStorage.removeItem("schoolId");
    navigate("/login");
  };

  useEffect(() => {
    const fetchUser = async () => {
      try {
        const token = localStorage.getItem("schoolToken");
        if (!token) {
          setLoadingUser(false);
          return;
        }

        // Fetch user info
        const resUser = await axios.get(`${baseUrl}/users/profile`, {
          headers: { Authorization: `Bearer ${token}` },
        });
        setUser(resUser.data);

        // Fetch total registered users
        const resUsers = await axios.get(`${baseUrl}/users/count`, {
          headers: { Authorization: `Bearer ${token}` },
        });
        setTotalUsers(resUsers.data.count);
      } catch (error) {
        console.error("Failed to fetch data:", error);
      } finally {
        setLoadingUser(false);
      }
    };

    fetchUser();
  }, []);

  const userName = user?.name || (loadingUser ? "Loading..." : "Guest");
  const userEmail = user?.email || (loadingUser ? "Loading..." : "");

  return (
    <header className="sticky top-0 z-50 bg-[#001489] shadow-md backdrop-blur-sm">
      <nav className="flex items-center justify-between w-11/12 mx-auto py-3">

        {/* Logo */}
        <Link to="/" className="flex items-center gap-2">
          <img src={removebg} alt="Logo" className="h-14" />
        </Link>

        {/* Desktop Links */}
        <div className="hidden lg:flex flex-1 justify-center items-center gap-6">
          {NavbarMenu.map(item => {
            const isActive = currentPath === item.link;
            return (
              <Link
                key={item.id}
                to={item.link}
                className={`px-4 py-2 rounded-lg text-sm font-medium transition-transform transform hover:scale-105 ${
                  isActive ? "bg-white text-[#001489] shadow-md" : "text-white hover:bg-white/20"
                }`}
              >
                {item.title}
              </Link>
            );
          })}
        </div>

        {/* Desktop User Info & Users Count */}
        <div className="hidden lg:flex items-center gap-4">
          {totalUsers !== null && (
            <div className="flex items-center gap-1 bg-white/10 px-3 py-1 rounded-full text-white text-sm">
              <FiUsers className="text-lg" />
              <span>{totalUsers} Users</span>
            </div>
          )}
          <div className="flex items-center gap-3 bg-white/10 px-3 py-1 rounded-xl hover:bg-white/20 transition cursor-pointer">
            <img src={user?.avatar || Ellipse35} alt="User" className="w-10 h-10 rounded-full border border-white/30" />
            <div className="flex flex-col leading-tight">
              <span className="font-semibold text-white text-sm">{userName}</span>
              <span className="text-gray-200 text-xs">{userEmail}</span>
            </div>
          </div>
          <button onClick={handleLogout} className="ml-2 text-white text-2xl hover:text-red-300 transition" title="Logout">
            <FiLogOut />
          </button>
        </div>

        {/* Mobile Menu Toggle */}
        <div className="lg:hidden">
          <button onClick={() => setMenuOpen(!menuOpen)} className="text-3xl text-white">
            {menuOpen ? <IoCloseOutline /> : <IoMenuOutline />}
          </button>
        </div>

        {/* Mobile Sidebar */}
        <AnimatePresence>
          {menuOpen && (
            <>
              {/* Backdrop */}
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 0.5 }}
                exit={{ opacity: 0 }}
                transition={{ duration: 0.2 }}
                className="fixed inset-0 bg-black/50 z-40"
                onClick={() => setMenuOpen(false)}
              />

              {/* Sidebar */}
              <motion.div
                initial={{ x: "100%" }}
                animate={{ x: 0 }}
                exit={{ x: "100%" }}
                transition={{ duration: 0.3, ease: "easeInOut" }}
                className="fixed top-0 right-0 w-3/4 max-w-xs h-screen bg-[#001489]/95 backdrop-blur-sm z-50 shadow-xl flex flex-col"
              >
                {/* Close button */}
                <div className="flex justify-end p-4">
                  <button onClick={() => setMenuOpen(false)} className="text-white text-3xl hover:text-red-400">
                    &times;
                  </button>
                </div>

                {/* User Info */}
                <div className="flex flex-col gap-3 px-5 mb-4">
                  <div className="flex items-center gap-3 bg-white/10 px-3 py-2 rounded-xl">
                    <img src={user?.avatar || Ellipse35} alt="User" className="w-10 h-10 rounded-full border border-white/30" />
                    <div className="flex flex-col leading-tight">
                      <span className="font-semibold text-white text-sm">{userName}</span>
                      <span className="text-gray-200 text-xs">{userEmail}</span>
                    </div>
                  </div>
                  {totalUsers !== null && (
                    <div className="flex items-center gap-1 bg-white/10 px-3 py-1 rounded-full text-white text-sm">
                      <FiUsers className="text-lg" />
                      <span>{totalUsers} Users</span>
                    </div>
                  )}
                </div>

                {/* Links */}
                <ul className="flex flex-col gap-3 mt-2 px-5 flex-1">
                  {NavbarMenu.map(item => {
                    const isActive = currentPath === item.link;
                    return (
                      <Link
                        key={item.id}
                        to={item.link}
                        onClick={() => setMenuOpen(false)}
                        className={`block px-3 py-3 rounded-lg text-base font-medium ${
                          isActive ? "bg-white text-[#001489]" : "text-white hover:bg-white/10"
                        }`}
                      >
                        {item.title}
                      </Link>
                    );
                  })}
                </ul>

                {/* Logout */}
                <div className="px-5 py-4 border-t border-white/20">
                  <button
                    onClick={() => {
                      setMenuOpen(false);
                      handleLogout();
                    }}
                    className="flex items-center gap-2 px-4 py-3 w-full rounded-lg text-base font-medium text-white hover:bg-[#0060ff]"
                  >
                    <FiLogOut className="text-lg" />
                    Logout
                  </button>
                </div>
              </motion.div>
            </>
          )}
        </AnimatePresence>
      </nav>
    </header>
  );
};

export default Nav2;
