import React from "react";
import { motion } from "framer-motion";
import FrameA from "../assets/images/FrameA.png";
import FrameB from "../assets/images/FrameB.png";
import FrameC from "../assets/images/FrameC.png";
import FrameD from "../assets/images/FrameD.png";

const subjects = [
  { img: FrameA, title: "Physics", desc: "Physics explores matter, energy, and the forces that shape our universe." },
  { img: FrameB, title: "Chemistry", desc: "Chemistry studies substances, their properties, and the reactions that transform them." },
  { img: FrameC, title: "Biology", desc: "Biology examines living organisms, their structure, function, growth, and evolution." },
  { img: FrameD, title: "Mathematics", desc: "Mathematics focuses on numbers, quantities, patterns, and problem-solving methods." },
];

const Stem = () => {
  return (
    <div className="px-4 py-8 sm:px-4 md:px-16 lg:px-24 font-poppins">
      {/* Heading Section */}
      <div className="mb-6 text-center">
        <p className="text-2xl font-bold sm:text-3xl">STEM Subjects</p>
        <p className="mt-2 text-sm sm:text-base md:text-lg text-gray-600 font-semibold">
          Test your knowledge across four core disciplines
        </p>
      </div>

      {/* Subjects Grid */}
      <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4">
        {subjects.map((subject, index) => (
          <motion.div
            key={index}
            className="flex flex-col items-center p-4 sm:p-6 text-center cursor-pointer rounded-xl shadow-md bg-white"
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: index * 0.2, type: "spring", stiffness: 120 }}
            viewport={{ once: true }}
            whileHover={{ scale: 1.05 }}
          >
            <motion.img
              src={subject.img}
              alt={subject.title}
              className="w-12 h-12 sm:w-16 sm:h-16 mb-4"
              animate={{ y: [0, -8, 0] }} // subtle floating effect
              transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
            />
            <p className="mb-2 text-lg sm:text-xl font-semibold">{subject.title}</p>
            <p className="text-xs sm:text-sm md:text-base text-gray-600">{subject.desc}</p>
          </motion.div>
        ))}
      </div>
    </div>
  );
};

export default Stem;
