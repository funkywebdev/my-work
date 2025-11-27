
import React, { useState } from "react";
import removebg from "../assets/images/removebg.png";
import Ellipse35 from "../assets/images/Ellipse35.png";
import { Navbar as NavbarMenu } from "../mockdata/data2";

import { IoMenuOutline, IoCloseOutline } from "react-icons/io5";
import { motion, AnimatePresence } from "framer-motion";
import { Link, useLocation } from "react-router-dom";

const Nav2 = () => {
  const [menuOpen, setMenuOpen] = useState(false);
  const location = useLocation();
  const currentPath = location.pathname;

  return (
    <header className="sticky top-0 z-50 bg-[#001489] shadow-md">
      <nav className="flex items-center justify-between w-[92%] mx-auto py-3">

        {/* Logo */}
    <div className="flex items-center">
    <img src={removebg} alt="Logo" className="mr-4  h-16" />
   </div>



        {/* Desktop Menu */}
        <div className="hidden min-[901px]:flex gap-4 items-center bg-[#001489] px-4 py-2 rounded-lg">
          {NavbarMenu.map((item) => {
            const isActive = currentPath === item.link;

            return (
              <Link
                key={item.id}
                to={item.link}
                className={`
                  px-3 py-2 rounded-md text-sm font-medium transition-all
                  ${isActive
                    ? "bg-white text-[#001489] shadow-md"
                    : "text-white hover:bg-white/20"}
                `}
              >
                {item.title}
              </Link>
            );
          })}
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
              className="absolute left-0 w-full bg-[#001489] py-6 px-5 top-[60px] z-40 shadow-lg min-[901px]:hidden"
            >
              <ul className="flex flex-col gap-4">
                {NavbarMenu.map((item) => {
                  const isActive = currentPath === item.link;

                  return (
                    <Link
                      key={item.id}
                      to={item.link}
                      onClick={() => setMenuOpen(false)}
                      className={`
                        px-3 py-2 rounded-md text-sm font-medium
                        ${isActive
                          ? "bg-white text-[#001489]"
                          : "text-white hover:bg-white/20"}
                      `}
                    >
                      {item.title}
                    </Link>
                  );
                })}

                {/* Mobile Profile */}
                <div className="flex items-center gap-3 rounded-md">
                  <img
                    src={Ellipse35}
                    alt="User avatar"
                    className="w-10 h-10 rounded-full border border-white/20"
                  />
                  <div className="flex flex-col">
                    <span className="font-semibold text-white text-sm">Mary Paul</span>
                    <span className="text-gray-200 text-xs">queenking@gmail.com</span>
                  </div>
                </div>
              </ul>
            </motion.div>
          )}
        </AnimatePresence>
      </nav>
    </header>
  );
};

export default Nav2;
