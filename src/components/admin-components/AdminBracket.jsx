import React, { useState } from "react";
import { motion } from "framer-motion";
import rounds from "../../mockdata/MatchdataA";
import schoollogo from "../../assets/images/schoollogo.png";

const AdminBracket = () => {
  const [activeTab, setActiveTab] = useState("Round of 32");

  // Find the round matching the active tab
  const activeRound = rounds.find((round) => round.name === activeTab);

  return (
    <div className="space-y-4">
      {/* Title */}
      <div className="text-center md:text-left space-y-2">
        <p className="text-[18px] md:text-2xl font-bold text-gray-900">
          Tournament Bracket
        </p>
        <p className="text-gray-600 text-sm md:text-base">
          Follow the incredible journey of young innovators on their path to the championship
        </p>
      </div>

      {/* Tabs */}
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-2 p-1 rounded-md overflow-x-auto" style={{ backgroundColor: "#F7FEF985" }}>
        {rounds.map((round) => (
          <button
            key={round.name}
            onClick={() => setActiveTab(round.name)}
            className="px-4 py-2 text-center rounded-full font-medium whitespace-nowrap transition-colors duration-200"
            style={{
              backgroundColor: activeTab === round.name ? "#1E40AF" : "#F7FEF985",
              color: activeTab === round.name ? "white" : "black",
            }}
          >
            {round.name}
          </button>
        ))}
      </div>

      {/* Active Round Matches */}
      {activeRound && (
        <div className="mt-4">
          <p className="font-semibold text-center text-2xl mb-6">{activeRound.name}</p>

          <motion.div
            className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6"
            initial="hidden"
            animate="show"
            variants={{
              hidden: {},
              show: { transition: { staggerChildren: 0.1 } },
            }}
          >
            {activeRound.matches.map((match, idx) => (
              <motion.div
                key={idx}
                className="border border-[#001489] rounded-xl p-5 shadow-md bg-white transition-all duration-300"
              >
                {/* Team 1 */}
                <div className="flex justify-between items-center mb-2 bg-[#FAFBFF] rounded-md p-2">
                  <span className="flex items-center space-x-2">
                    <img src={schoollogo} alt="School Logo" className="w-8 h-8 rounded" />
                    <span className="font-semibold text-base sm:text-lg">{match.team1}</span>
                  </span>
                  <p className="font-semibold">{match.score1}</p>
                </div>

                <p className="text-center font-semibold my-2 text-gray-700">Vs</p>

                {/* Team 2 */}
                <div className="flex justify-between items-center bg-[#FAFBFF] rounded-md p-2">
                  <span className="flex items-center space-x-2">
                    <img src={schoollogo} alt="School Logo" className="w-8 h-8 rounded" />
                    <span className="font-semibold text-base sm:text-lg">{match.team2}</span>
                  </span>
                  <p className="font-semibold">{match.score2}</p>
                </div>
              </motion.div>
            ))}
          </motion.div>
        </div>
      )}
    </div>
  );
};

export default AdminBracket;
