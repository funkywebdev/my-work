import React from "react";
import { motion } from "framer-motion";
import GroupData from "../mockdata/groupdata";

const floatAnimation = {
  animate: {
    y: [0, -10, 0],
    scale: [1, 1.03, 1],
    transition: {
      duration: 3,
      repeat: Infinity,
      ease: "easeInOut",
    },
  },
};

const MatchGroup = () => {
  return (
    <div className="bg-gray-50">
      <div className="text-center px-4 md:px-8 lg:px-16 py-6">
        <h1 className="text-2xl md:text-2xl lg:text-2xl font-bold">Match Group</h1>

        <p className="text-sm md:text-base lg:text-lg text-gray-600 mt-2">
          See which schools your group will compete against
        </p>
      </div>

      {GroupData.map((group, index) => (
        <div key={index} className="mb-10 lg:px-28 px-4 sm:px-12">
          <p className="text-center font-bold mb-4">{group.name}</p>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 items-center bg-gray-50 p-4 rounded-xl">

            {/* LEFT SCHOOL */}
            <motion.div
              className="bg-white shadow-md p-4 rounded-xl flex flex-col items-center text-center"
              {...floatAnimation}
            >
              <img
                src={group.schools[0].logo}
                alt=""
                className="w-20 h-20 object-contain"
              />
              <p className="mt-2 text-sm font-medium">{group.schools[0].name}</p>
            </motion.div>

            {/* VS */}
            <motion.div
              className="flex justify-center"
              animate={{
                rotate: [0, 360],
                transition: {
                  duration: 4,
                  repeat: Infinity,
                  ease: "linear",
                },
              }}
            >
              <h1 className="bg-[#001489] text-white w-14 h-14 flex items-center justify-center rounded-full text-xl font-bold">
                VS
              </h1>
            </motion.div>

            {/* RIGHT SCHOOL */}
            <motion.div
              className="bg-white shadow-md p-4 rounded-xl flex flex-col items-center text-center"
              {...floatAnimation}
            >
              <img
                src={group.schools[1].logo}
                alt=""
                className="w-20 h-20 object-contain"
              />
              <p className="mt-2 text-sm font-medium">{group.schools[1].name}</p>
            </motion.div>

          </div>
        </div>
      ))}
    </div>
  );
};

export default MatchGroup;


