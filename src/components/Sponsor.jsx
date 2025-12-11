import React from "react";
import { motion } from "framer-motion";
import LogoA from "../assets/images/LogoA.png";
import LogoB from "../assets/images/LogoB.png";
import LogoC from "../assets/images/LogoC.png";
import LogoD from "../assets/images/LogoD.png";
import LogoF from "../assets/images/LogoF.png";
import VectorA from "../assets/images/VectorA.png";

const logos = [LogoA, LogoB, LogoC, VectorA, LogoD, LogoF];

const Sponsor = () => {
  return (
    <section id="Sponsor" className="bg-[#F3F5FF] py-10 font-poppins overflow-hidden">
      {/* Heading Section */}
      <div className="mb-8 text-center">
        <p className="text-2xl font-bold md:text-2xl">Our Sponsors</p>
        <p className="mt-2 text-sm font-semibold text-gray-600 md:text-lg">
          Empowering the next generation of thinkers and innovators
        </p>
      </div>

      {/* Scrolling Logos */}
      <div className="overflow-hidden">
        <motion.div
          className="flex items-center gap-12"
          animate={{ x: ["0%", "-50%"] }} // move left
          transition={{
            repeat: Infinity,
            duration: 20, // adjust scroll speed
            ease: "linear",
          }}
        >
          {/* Duplicate logos for seamless scroll */}
          {[...logos, ...logos].map((logo, i) => (
            <motion.img
              key={i}
              src={logo}
              alt={`Sponsor logo ${i + 1}`}
              className="object-contain w-24 md:w-28"
              animate={{
                y: [0, -10, 0], // subtle bounce
              }}
              transition={{
                duration: 3,
                repeat: Infinity,
                ease: "easeInOut",
                delay: i * 0.3,
              }}
              whileHover={{
                scale: 1.15,
                rotate: 3,
                transition: { type: "spring", stiffness: 200 },
              }}
            />
          ))}
        </motion.div>
      </div>
    </section>
  );
};

export default Sponsor;
