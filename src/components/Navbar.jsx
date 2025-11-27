import React, { useState } from "react";
import logo from "../assets/images/logo.png";
import { NavbarMenu } from "../mockdata/data";

import { IoMenuOutline, IoCloseOutline } from "react-icons/io5";
import { motion, AnimatePresence } from "framer-motion";
import { Link } from "react-router-dom";

const Navbar = () => {
  const [menuOpen, setMenuOpen] = useState(false);
  const toggleMenu = () => setMenuOpen(!menuOpen);

  return (
    <header className="relative z-50 bg-white shadow-md">
      <nav className="flex items-center justify-between w-[92%] mx-auto py-3 relative">
        {/* Logo */}
        <div>
          <img src={logo} alt="Logo" className="h-24" />
        </div>

        {/* Desktop Menu (only above 900px) */}
        <div className="hidden min-[901px]:flex gap-8 items-center">
          {NavbarMenu.map((item) => (
            <a
              key={item.id}
              href={item.link}
              className="hover:text-[#001489] font-medium"
            >
              {item.title}
            </a>
          ))}
        </div>

        {/* Desktop Register Button (only above 900px) */}
        <div className="hidden min-[901px]:block">
          <Link to="/registration">
            <button className="px-5 py-1 text-white rounded-md bg-[#001489]">
              Register now
            </button>
          </Link>
        </div>

        {/* Mobile Toggle (show <901px) */}
        <div className="flex min-[901px]:hidden items-center">
          <button
            onClick={toggleMenu}
            className="text-3xl text-black"
            aria-label="Toggle menu"
          >
            {menuOpen ? <IoCloseOutline /> : <IoMenuOutline />}
          </button>
        </div>

        {/* Mobile Animated Menu */}
        <AnimatePresence>
          {menuOpen && (
            <motion.div
              initial={{ opacity: 0, y: -20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              transition={{ duration: 0.4, ease: "easeInOut" }}
              className="absolute left-0 w-full bg-white p-5 top-[60px] z-50 shadow-md min-[901px]:hidden"
            >
              <ul className="flex flex-col gap-6 text-black">
                {NavbarMenu.map((item, index) => (
                  <motion.li
                    key={item.id}
                    initial={{ opacity: 0, x: -10 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: index * 0.05 }}
                  >
                    <a
                      href={item.link}
                      onClick={() => setMenuOpen(false)}
                      className="hover:text-[#001489] font-medium"
                    >
                      {item.title}
                    </a>
                  </motion.li>
                ))}

                {/* Mobile Register Button */}
                <motion.li
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.4 }}
                >
                  <Link
                    to="/registration"
                    className="px-5 py-1 text-white rounded-md bg-[#001489] inline-block text-center"
                    onClick={() => setMenuOpen(false)}
                  >
                    Register now
                  </Link>
                </motion.li>
              </ul>
            </motion.div>
          )}
        </AnimatePresence>
      </nav>
    </header>
  );
};

export default Navbar;


