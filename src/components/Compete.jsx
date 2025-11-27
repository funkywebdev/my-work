import React from "react";
import { TypeAnimation } from "react-type-animation";
import { motion } from "framer-motion";

const Compete = () => {
  return (
    <div className="bg-[#F3F5FF] py-12 font-poppins overflow-hidden px-4 sm:px-10 md:px-16 lg:px-24">
      <div className="max-w-3xl mx-auto text-center">
        {/* Animated heading */}
        <TypeAnimation
          sequence={["Ready to Compete?", 2000, "Join the Ultimate STEM Challenge!"]}
          wrapper="p"
          speed={50}
          deletionSpeed={60}
          repeat={Infinity}
          className="text-[#001489] text-2xl sm:text-3xl md:text-4xl font-bold"
        />

        {/* Fade-in Subtext */}
        <motion.p
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1.2, delay: 0.5 }}
          className="px-2 mt-4 text-xs font-medium text-gray-600 sm:text-sm md:text-base sm:px-0"
        >
          Join thousands of students nationwide in the ultimate STEM challenge.
          Registration closes{" "}
          <span className="font-semibold text-[#001489]">
            December 15, 2025
          </span>
          .
        </motion.p>

        <div className="mt-6">
          <button className="bg-[#001489] text-white px-6 py-3 sm:px-8 sm:py-4 text-xs sm:text-sm md:text-base font-semibold rounded-md shadow-md hover:bg-[#001acb] transition-all duration-300">
            Register Your School Now
          </button>
        </div>
      </div>
    </div>
  );
};

export default Compete;
