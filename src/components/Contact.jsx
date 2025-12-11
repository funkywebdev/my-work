import React from "react";
import { FiMail, FiPhone, FiSend } from "react-icons/fi";
import facebook from "../assets/images/facebook.png";
import tiktok from "../assets/images/tiktok.png";
import Group from "../assets/images/Group.png";
import linkedin from "../assets/images/linkedin.png";

const Contact = () => {
  return (
    <section id="Contact" className="px-10 md:px-32 py-8 ">
      
      {/* Header */}
      <div className="text-center mb-12">
        <h1 className="text-3xl md:text-4xl font-bold">Contact Us</h1>
        <p className="text-gray-600 mt-3 max-w-2xl mx-auto">
          Have questions? Get in touch via email, phone, or social media, and we’ll respond promptly.
        </p>
      </div>

      {/* Grid: Form + Info */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-10 items-start">
        
        {/* Contact Form */}
        <div className="md:col-span-2 flex flex-col gap-4">
          <label className="font-medium">School Name</label>
          <input
            type="text"
            placeholder="Enter school name"
            className="border border-gray-300 rounded-md p-3 focus:outline-none focus:ring-2 focus:ring-[#001489]"
          />

          <label className="font-medium">Email Address</label>
          <input
            type="email"
            placeholder="Enter email"
            className="border border-gray-300 rounded-md p-3 focus:outline-none focus:ring-2 focus:ring-[#001489]"
          />

          <label className="font-medium">Subject</label>
          <input
            type="text"
            placeholder="Select a subject"
            className="border border-gray-300 rounded-md p-3 focus:outline-none focus:ring-2 focus:ring-[#001489]"
          />

          <label className="font-medium">Message</label>
          <textarea
            rows={5}
            placeholder="Type your message here"
            className="border border-gray-300 rounded-md p-3 focus:outline-none focus:ring-2 focus:ring-[#001489]"
          />

          <a href="mailto:boloquiz626@gmail.com">
            <button className="bg-[#001489] text-white flex items-center justify-center gap-2 px-6 py-3 rounded-md font-semibold hover:bg-[#0025c5] transition w-full md:w-auto mt-2">
              <FiSend className="w-5 h-5" />
              Send Message
            </button>
          </a> 
        </div>

        {/* Contact Info Card */}
        <div className="bg-[#001489] text-white rounded-xl p-8 flex flex-col gap-4 w-full md:w-auto mx-auto md:mx-0">
          <h2 className="text-2xl font-semibold">Contact Information</h2>

          <p className="flex items-center gap-2 mt-3 text-lg">
            <FiMail className="w-5 h-5" />
            boloquiz626@gmail.com
          </p>

          <p className="flex items-center gap-2 mt-2 text-lg">
            <FiPhone className="w-5 h-5" />
            +234 801 234 5678
          </p>

          <div className="flex flex-wrap items-center gap-4 mt-4">
            {[facebook, tiktok, Group, linkedin].map((icon, idx) => (
              <img
                key={idx}
                src={icon}
                alt="social icon"
                className="w-6 h-6 cursor-pointer transition-all hover:opacity-80"
              />
            ))}
          </div>
        </div>
      </div>
    </section>
  );
};

export default Contact;
