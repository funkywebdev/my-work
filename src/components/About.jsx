import React from "react";
import { motion } from "framer-motion";
import Frame22 from "../assets/images/Frame22.png";
import Frame23 from "../assets/images/Frame23.png";
import Frame24 from "../assets/images/Frame24.png";
import Frame29 from "../assets/images/Frame29.png";
import Frame30 from "../assets/images/Frame30.png";

const About = () => {
  return (
    <section id="About" className="px-4 py-12 overflow-hidden bg-white sm:px-10 md:px-16 lg:px-24 font-poppins">
      {/* Heading Section */}
      <motion.div
        className="max-w-3xl mx-auto text-center"
        initial={{ opacity: 0, y: -40 }}
        whileInView={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8, ease: "easeOut" }}
        viewport={{ once: true }}
      >
        <p className="text-xl font-bold leading-tight sm:text-2xl md:text-2xl">
          What is <span className="text-[#001489]">BOLO</span> Quiz League?
        </p>
        <p className="mt-4 text-sm leading-relaxed text-gray-600 sm:text-base md:text-lg">
          BOLO Quiz League 2025 is more than just a quiz tournament — it’s a
          movement to inspire the next generation of innovators, problem-solvers,
          and leaders in STEM.
        </p>
      </motion.div>

      {/* Mission / Vision Section */}
      <div className="flex flex-col items-start gap-12 mt-12 md:flex-row md:items-center">
        {/* Left: Text Blocks */}
        <motion.div
          className="flex flex-col gap-8 md:w-1/2"
          initial={{ opacity: 0, x: -60 }}
          whileInView={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.9, ease: "easeOut" }}
          viewport={{ once: true }}
        >
          {/* Mission */}
          <div className="flex flex-col gap-2">
            <p className="flex items-center gap-3 text-lg font-semibold md:text-xl">
              <motion.img
                src={Frame22}
                alt="Mission Icon"
                className="w-8 h-8"
                animate={{ rotate: [0, 10, -10, 0] }}
                transition={{ duration: 3, repeat: Infinity, ease: "easeInOut" }}
              />
              Our Mission
            </p>
            <p className="ml-10 leading-relaxed text-gray-600 sm:ml-12 md:ml-16">
              To create an inclusive, competitive platform where students across
              the nation can showcase their STEM talents, connect with
              like-minded peers, and discover their potential to change the
              world.
            </p>
          </div>

          {/* Why Bolo Exists */}
          <div className="flex flex-col gap-2">
            <p className="flex items-center gap-3 text-lg font-semibold md:text-xl">
              <motion.img
                src={Frame23}
                alt="Why Icon"
                className="w-8 h-8"
                animate={{ scale: [1, 1.1, 1] }}
                transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
              />
              Why Bolo Exists?
            </p>
            <p className="ml-10 leading-relaxed text-gray-600 sm:ml-12 md:ml-16">
              We believe every student deserves the opportunity to excel in STEM.
              BOLO breaks down barriers, celebrates diversity, and transforms
              competition into collaboration, building a legacy of excellence that
              extends far beyond the tournament.
            </p>
          </div>

          {/* Vision */}
          <div className="flex flex-col gap-2">
            <p className="flex items-center gap-3 text-lg font-semibold md:text-xl">
              <motion.img
                src={Frame24}
                alt="Vision Icon"
                className="w-8 h-8"
                animate={{ y: [0, -5, 0] }}
                transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
              />
              Our Vision
            </p>
            <p className="ml-10 leading-relaxed text-gray-600 sm:ml-12 md:ml-16">
              To become the premier national platform that empowers students to
              pursue STEM careers, fostering a community where curiosity meets
              opportunity and passion meets purpose.
            </p>
          </div>
        </motion.div>

        {/* Right: Images with Overlay */}
        <motion.div
          className="relative flex justify-center mt-4 md:w-1/2 md:mt-0"
          initial={{ opacity: 0, x: 60 }}
          whileInView={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.9, ease: "easeOut" }}
          viewport={{ once: true }}
        >
          <motion.img
            src={Frame29}
            alt="BOLO Illustration"
            className="w-full max-w-md"
            whileHover={{ scale: 1.05 }}
            transition={{ type: "spring", stiffness: 200 }}
          />
          <motion.img
            src={Frame30}
            alt="Overlay"
            className="absolute top-0 left-0 z-10 w-24 sm:w-28 md:w-32 lg:w-36 -translate-y-1/4"
            animate={{ y: [0, -10, 0] }}
            transition={{ duration: 3, repeat: Infinity, ease: "easeInOut" }}
          />
        </motion.div>
      </div>
    </section>
  );
};

export default About;
