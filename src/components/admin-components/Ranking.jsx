import React, { useState } from "react";
import { motion } from "framer-motion";
import Clip from "../../assets/images/Clip.png";
import medal from "../../assets/images/medal.png";
import medal2 from "../../assets/images/medal2.png";
import Vector from "../../assets/images/Vector.png";
import stream from "../../assets/images/stream.png";

const leaderboardTabs = ["Overall", "Biology", "Physics", "Chemistry", "Mathematics", "English"];

const detailedLeaderboard = [
  { rank: 1, school: "Aro Odo Grammar School", points: 2845, color: "#F29700", category: "Biology" },
  { rank: 2, school: "Anglican Comprehensive High School", points: 2780, color: "#A8B6CA", category: "Physics" },
  { rank: 3, school: "Sundest Progressive College", points: 2705, color: "#A73A00", category: "Chemistry" },
  { rank: 4, school: "Kings College, Lagos", points: 2650, color: "#0077B6", category: "Mathematics" },
  { rank: 5, school: "Bright Future Academy", points: 2600, color: "#FF6B6B", category: "English" },
  { rank: 6, school: "St. Mary's Academy, Ibadan", points: 2555, color: "#6A0572", category: "Biology" },
  { rank: 7, school: "Hilltop International School", points: 2500, color: "#008080", category: "Physics" },
  { rank: 8, school: "Greenfield College, Ibadan", points: 2450, color: "#FFA500", category: "Chemistry" },
  { rank: 9, school: "Royal College, Lagos", points: 2400, color: "#800080", category: "Mathematics" },
  { rank: 10, school: "Future Leaders Academy, Abuja", points: 2350, color: "#00BFFF", category: "English" },
];

const leaderboardIcons = { Vector, stream }; // Use your imported images

const Ranking = () => {
  const [activeTab, setActiveTab] = useState("Overall");

  const tabVariants = { hover: { scale: 1.05 }, tap: { scale: 0.95 } };
  const leaderboardVariants = {
    hidden: { opacity: 0, x: -50 },
    visible: (custom) => ({
      opacity: 1,
      x: 0,
      transition: { delay: custom * 0.05, duration: 0.4 },
    }),
    hover: { scale: 1.02, boxShadow: "0px 8px 20px rgba(0,0,0,0.15)" },
  };

  const filteredLeaderboard =
    activeTab === "Overall"
      ? detailedLeaderboard
      : detailedLeaderboard.filter((item) => item.category === activeTab);

  return (
    <div className="bg-[#F3F5FF61] p-4 sm:p-6 lg:p-8 rounded-md shadow-md">
      <h1 className="text-xl font-semibold mb-1">Rankings</h1>
      <p className="text-gray-500 text-sm mb-4 font-medium">Overall tournament standings</p>

      {/* Tabs */}
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-2 text-center font-medium mb-6 w-full">
        {leaderboardTabs.map((tab) => (
          <motion.div
            key={tab}
            onClick={() => setActiveTab(tab)}
            variants={tabVariants}
            whileHover="hover"
            whileTap="tap"
            className="w-full"
          >
            <span
              className={`truncate block text-sm py-1 px-2 rounded-full transition-colors ${
                activeTab === tab
                  ? "bg-white text-[#001489] shadow-md"
                  : "bg-[#F3F5FF61] border border-[#F3F5FF61] text-gray-700 hover:bg-white"
              }`}
            >
              {tab}
            </span>
          </motion.div>
        ))}
      </div>

      {/* Leaderboard */}
      <div className="space-y-3">
        {filteredLeaderboard.map((item, idx) => (
          <motion.div
            key={item.rank}
            custom={idx}
            variants={leaderboardVariants}
            initial="hidden"
            animate="visible"
            whileHover="hover"
            className="flex flex-col sm:flex-row items-start sm:items-center justify-between bg-white rounded-md p-4 shadow-md cursor-pointer gap-3 w-full"
          >
            <div className="flex flex-col sm:flex-row items-start sm:items-center gap-3 w-full sm:w-[70%] flex-wrap">
              <p
                className="font-bold text-white rounded-full w-10 h-10 flex items-center justify-center"
                style={{ backgroundColor: item.color }}
              >
                {item.rank}
              </p>
              <span className="text-gray-700 sm:truncate">{item.school}</span>
              <img src={leaderboardIcons.Vector} alt={`${item.school} icon`} className="w-5 h-5" />
            </div>
            <div className="flex items-center gap-3 mt-2 sm:mt-0 flex-wrap">
              <img src={leaderboardIcons.stream} alt="points icon" className="w-6 h-6" />
              <div className="flex flex-col items-center min-w-[60px]">
                <p className="font-bold text-lg">{item.points}</p>
                <p className="text-gray-500 text-sm">Points</p>
              </div>
            </div>
          </motion.div>
        ))}
      </div>
    </div>
  );
};

export default Ranking;
