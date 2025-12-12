
import React, { useState } from "react";
import removebg from "../assets/images/removebg.png";
import Ellipse35 from "../assets/images/Ellipse35.png";
import { Navbar as NavbarMenu } from "../mockdata/data2";

import { IoMenuOutline, IoCloseOutline } from "react-icons/io5";
import { motion, AnimatePresence } from "framer-motion";
import { Link, useLocation, useNavigate } from "react-router-dom";

const Nav2 = () => {
  const [menuOpen, setMenuOpen] = useState(false);
  const location = useLocation();
  const navigate = useNavigate();
  const currentPath = location.pathname;

  const handleLogout = () => {
    localStorage.removeItem("schoolToken");
    localStorage.removeItem("AdminToken");
    navigate("/login");
  };

  return (
    <header className="sticky top-0 z-50 bg-[#001489] shadow-md px-2 rounded-t-lg">
      <nav className="flex items-center justify-between w-[92%] mx-auto py-3">

        {/* Logo */}
        <div className="flex items-center">
          <img src={removebg} alt="Logo" className="h-16" />
        </div>

        {/* Desktop Menu */}
        <div className="hidden min-[901px]:flex gap-4 items-center bg-[#001489] px-4 py-2 rounded-lg">
          {NavbarMenu.map((item) => {
            const isActive = currentPath === item.link;
            return (
              <Link
                key={item.id}
                to={item.link}
                className={`px-3 py-2 rounded-md text-sm font-medium transition-all ${
                  isActive
                    ? "bg-white text-[#001489] shadow-md"
                    : "text-white hover:bg-white/20"
                }`}
              >
                {item.title}
              </Link>
            );
          })}

          {/* Desktop Logout */}
          <button
            onClick={handleLogout}
            className="px-3 py-2 rounded-md text-sm font-medium text-white hover:bg-white/20"
          >
            Logout
          </button>
        </div>

        {/* Desktop Profile */}
        <div className="hidden min-[901px]:flex items-center gap-3">
          <img
            src={Ellipse35}
            alt="User avatar"
            className="w-10 h-10 rounded-full border border-gray-200"
          />
          <div className="flex flex-col">
            <span className="font-semibold text-white text-sm">Mary Paul</span>
            <span className="text-gray-200 text-xs">queenking@gmail.com</span>
          </div>
        </div>

        {/* Mobile Toggle */}
        <button
          onClick={() => setMenuOpen(!menuOpen)}
          className="min-[901px]:hidden text-3xl text-white"
        >
          {menuOpen ? <IoCloseOutline /> : <IoMenuOutline />}
        </button>

        {/* Mobile Menu */}
        <AnimatePresence>
          {menuOpen && (
            <motion.div
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              transition={{ duration: 0.25 }}
              className="absolute left-0 w-full bg-[#001489] top-[60px] z-40 shadow-lg min-[901px]:hidden flex flex-col justify-between h-[calc(100vh-350px)]"
            >
              {/* Links */}
              <ul className="flex flex-col gap-3 mt-4 px-4">
                {NavbarMenu.map((item) => {
                  const isActive = currentPath === item.link;
                  return (
                    <Link
                      key={item.id}
                      to={item.link}
                      onClick={() => setMenuOpen(false)}
                      className={`block px-3 py-2 rounded-md text-sm font-medium ${
                        isActive
                          ? "bg-white text-[#001489]"
                          : "text-white hover:bg-white/20"
                      }`}
                    >
                      {item.title}
                    </Link>
                  );
                })}
              </ul>

              {/* Mobile Logout at bottom (without profile) */}
              <div className="flex flex-col items-start gap-2 px-4 pb-6">
                <button
                  onClick={() => {
                    setMenuOpen(false);
                    handleLogout();
                  }}
                  className="mt-4 px-4 py-2 w-full rounded-md text-sm font-medium text-white bg-[#0033cc] hover:bg-[#0047ff]"
                >
                  Logout
                </button>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </nav>
    </header>
  );
};

export default Nav2;
