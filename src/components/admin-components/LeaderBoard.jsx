import React, { useState } from "react";
import { motion } from "framer-motion";
import { leaderboardCards, leaderboardTabs, detailedLeaderboard, leaderboardIcons } from "../../mockdata/mockData";
import Ranking from "../../components/admin-components/Ranking";



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
       <Ranking />

      </div>
    </div>
  );
};

export default LeaderPage;
