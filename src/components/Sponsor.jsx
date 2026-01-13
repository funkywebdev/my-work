import React from "react";
import { motion } from "framer-motion";

import Logo1 from "../assets/images/Logo1.png";
import Logo2 from "../assets/images/Logo2.png";
import Logo3 from "../assets/images/Logo3.png";
import Logo4 from "../assets/images/Logo4.png";
import Logo5 from "../assets/images/Logo5.png";
import Logo6 from "../assets/images/Logo6.png";
import Logo7 from "../assets/images/Logo7.png";
import Logo8 from "../assets/images/Logo8.png";
import Logo9 from "../assets/images/Logo9.png";
import Foodmart from "../assets/images/Foodmart.jpeg";

const logos = [
  { src: Logo1 },
  { src: Logo2 },
  { src: Logo3 },
  { src: Logo4 },
  { src: Logo5, size: "w-10 md:w-16" }, 
  { src: Logo6, size: "w-14 md:w-16" },
  { src: Logo7, size: "w-32 md:w-32"}, 
  { src: Logo8 },
  { src: Logo9,  size: "w-12 md:w-16" }, 
  { src: Foodmart},
];

const Sponsor = () => {
  return (
    <section
      id="Sponsor"
      className="bg-[#F3F5FF] py-4 font-poppins overflow-hidden"
    >
  <div className=" px-4 text-center">
  <p className="font-bold text-lg sm:text-xl md:text-2xl">
    Our Sponsors
  </p>
  <p className="mt-2 mx-auto max-w-md text-xs sm:text-sm md:text-base text-gray-600">
    Empowering the next generation of thinkers and innovators
  </p>
</div>

      {/* Seamless Snake Marquee */}
      <div className="overflow-hidden">
        <motion.div
          className="flex w-max"
          animate={{ x: ["0%", "-50%"] }}
          transition={{
            repeat: Infinity,
            duration: 30,
            ease: "linear",
          }}
        >
          {[...logos, ...logos].map((logo, i) => (
            <motion.img
              key={i}
              src={logo.src}
              alt={`Sponsor ${i + 1}`}
              className={`
                ${logo.size ?? "w-20 md:w-24"}
                shrink-0 object-contain mx-3
              `}
              animate={{
                y: [0, -10, 0, 10, 0],
              }}
              transition={{
                duration: 3,
                repeat: Infinity,
                ease: "easeInOut",
                delay: i * 0.15,
              }}
              whileHover={{ scale: 1.05 }}
            />
          ))}
        </motion.div>
      </div>
    </section>
  );
};

export default Sponsor;
