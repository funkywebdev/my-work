

import React from "react";
import removebg from "../assets/images/removebg.png";
import facebook from "../assets/images/facebook.png";
import tiktok from "../assets/images/tiktok.png";
import Group from "../assets/images/Group.png";
import linkedin from "../assets/images/linkedin.png";

const Footer = () => {
  return (
    <footer className="bg-[#001489] text-white font-poppins relative pt-16 sm:pt-20">
      {/* Newsletter Section */}
      <div className="relative z-10 p-6 mx-4 -mt-10 bg-white shadow-lg rounded-2xl sm:mx-10 md:mx-16 lg:mx-24 sm:p-10">
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 items-center text-center sm:text-left">
          <div>
            <h3 className="text-lg sm:text-xl font-bold text-black">
              Subscribe to our newsletter
            </h3>
            <p className="mt-2 text-sm sm:text-base text-black">
              Subscribe to receive updates on competitions, events, and resources designed to help you grow in STEM
            </p>
          </div>
          <div className="flex flex-col sm:flex-row items-center sm:items-start gap-3 mt-4 sm:mt-0">
            <input
              type="email"
              placeholder="Enter your email"
              className="w-full sm:flex-1 px-4 py-3 text-sm rounded-full border border-gray-300 focus:outline-none focus:ring-2 focus:ring-[#001489] text-[#001489] font-semibold"
            />
            <button className="bg-[#001489] text-white px-6 py-3 rounded-full font-semibold hover:bg-[#0025c5] transition w-full sm:w-auto">
              Subscribe
            </button>
          </div>
        </div>
      </div>

      {/* Main Footer Content */}
      <div className="px-6 sm:px-10 md:px-16 py-10">
        <div className="max-w-6xl mx-auto grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-8 text-center lg:text-left">
          
          {/* Logo & About */}
          <div className="flex flex-col items-center lg:items-start">
            <img src={removebg} alt="Bolo Quiz League Logo" className="w-32 mb-3" />
            <p className="text-sm leading-relaxed text-white">
              Connecting young thinkers through exciting STEM challenges.
            </p>
          </div>

          {/* Features */}
          <div className="flex flex-col items-center lg:items-start">
            <h4 className="text-white font-semibold mb-2">Features</h4>
            <ul className="space-y-2 text-sm">
              <li><a href="#Hero" className="transition hover:text-gray-400">Home</a></li>
              <li><a href="#Sponsor" className="transition hover:text-gray-400">Our Sponsor</a></li>
              <li><a href="#About2" className="transition hover:text-gray-400">How it works</a></li>
            </ul>
          </div>

          {/* Policy & Privacy */}
          <div className="flex flex-col items-center lg:items-start">
            <h4 className="text-white font-semibold mb-2">Policy & Privacy</h4>
            <ul className="space-y-2 text-sm">
              <li><a href="#Team" className="transition hover:text-gray-400">Meet the Team</a></li>
              <li><a href="#Question" className="transition hover:text-gray-400">FAQS</a></li>
            </ul>
          </div>

          {/* STEM Subjects */}
          <div className="flex flex-col items-center lg:items-start">
            <h4 className="text-white font-semibold mb-2">STEM Subjects</h4>
            <ul className="space-y-2 text-sm">
              <li>Biology</li>
              <li>Chemistry</li>
              <li>Physics</li>
              <li>Mathematics</li>
            </ul>
          </div>

          {/* Contact Info */}
          <div className="flex flex-col items-center lg:items-start">
            <h4 className="text-white font-semibold mb-2">Contact</h4>
            <ul className="space-y-2 text-sm">
              <li>boloquiz626@gmail.com</li>
              <li>07055120678</li>
            </ul>
          </div>

          {/* Social Links */}
          <div className="flex flex-col items-center lg:items-start">
            <h4 className="text-white font-semibold mb-2">Follow Us</h4>
            <div className="flex items-center gap-4 mt-2 justify-center">
              {[facebook, tiktok, Group, linkedin].map((icon, idx) => (
                <img
                  key={idx}
                  src={icon}
                  alt="social icon"
                  className="w-6 h-6 cursor-pointer hover:opacity-80 transition"
                />
              ))}
            </div>
          </div>
        </div>

        {/* Footer Bottom */}
        <div className="pt-8 mt-10 text-xs sm:text-sm text-center border-t border-gray-700">
          © {new Date().getFullYear()} <span className="font-semibold">Bolo Quiz League</span>. All rights reserved.
        </div>
      </div>
    </footer>
  );
};

export default Footer;
