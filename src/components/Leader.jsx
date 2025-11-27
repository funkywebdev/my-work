import React, { useState } from "react";
import { motion } from "framer-motion";
import { FiSearch } from "react-icons/fi";
import { HiAdjustmentsHorizontal } from "react-icons/hi2";
import {
  leaderboardCards,
  leaderboardTabs,
  detailedLeaderboard,
  leaderboardIcons,
} from "../mockdata/mockData";

const LeaderPage = () => {
  const [activeTab, setActiveTab] = useState("Overall");

  const cardVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: (i) => ({ opacity: 1, y: 0, transition: { delay: i * 0.1, duration: 0.5 } }),
    hover: { scale: 1.05, transition: { duration: 0.2 } },
  };

  const tabVariants = { hover: { scale: 1.05 }, tap: { scale: 0.95 } };

  const leaderboardVariants = {
    hidden: { opacity: 0, x: -50 },
    visible: (i) => ({ opacity: 1, x: 0, transition: { delay: i * 0.09, duration: 0.4 } }),
    hover: { scale: 1.02, boxShadow: "0px 8px 20px rgba(0,0,0,0.15)" },
  };

  // Filter leaderboard by category
  const filteredLeaderboard =
    activeTab === "Overall"
      ? detailedLeaderboard
      : detailedLeaderboard.filter((item) => item.category === activeTab);

  return (
    <div className="bg-[#F3F5FF61] min-h-screen">
      <div className="py-10 max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 space-y-10">
        {/* Top Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
          {leaderboardCards.map((leader, idx) => (
            <motion.div
              key={idx}
              custom={idx}
              variants={cardVariants}
              initial="hidden"
              animate="visible"
              whileHover="hover"
              className="bg-white rounded-lg shadow-md p-4 flex flex-col items-center text-center cursor-pointer"
            >
              <img src={leader.img} alt={leader.name} className="w-16 h-16 mb-2" />
              <p className="font-semibold text-lg">{leader.name}</p>
              <p className="text-gray-500 text-sm">Total Points</p>
              <p className="font-bold text-xl">{leader.points}</p>
            </motion.div>
          ))}
        </div>

        {/* Tabs */}
        <div className="bg-white rounded-md shadow-md p-6">
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-2 text-center font-medium mb-6">
            {leaderboardTabs.map((tab) => (
              <motion.div
                key={tab}
                onClick={() => setActiveTab(tab)}
                variants={tabVariants}
                whileHover="hover"
                whileTap="tap"
                className={`py-2 rounded-full cursor-pointer text-sm font-medium transition-colors ${
                  activeTab === tab
                    ? "bg-white text-[#001489] shadow-md"
                    : "bg-[#F3F5FF61] border border-[#F3F5FF61] text-gray-700 hover:bg-white"
                }`}
              >
                {tab}
              </motion.div>
            ))}
          </div>

          {/* Leaderboard */}
          <div className="space-y-2">
            {filteredLeaderboard.map((item, idx) => (
              <motion.div
                key={item.rank}
                custom={idx}
                variants={leaderboardVariants}
                initial="hidden"
                animate="visible"
                whileHover="hover"
                className="flex items-center justify-between bg-white rounded-md p-4 shadow-md cursor-pointer"
              >
                <div className="flex items-center gap-3 max-w-[70%]">
                  <p
                    className="font-bold text-white rounded-full w-8 h-8 flex items-center justify-center"
                    style={{ backgroundColor: item.color }}
                  >
                    {item.rank}
                  </p>
                  <span className="truncate text-gray-700">{item.school}</span>
                  <img src={leaderboardIcons.Vector} alt="icon" className="w-5 h-5" />
                </div>
                <div className="flex items-center gap-3">
                  <img src={leaderboardIcons.stream} alt="icon" className="w-6 h-6" />
                  <div className="flex flex-col items-center">
                    <p className="font-bold text-lg">{item.points}</p>
                    <p className="text-gray-500 text-sm">Points</p>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default LeaderPage;
