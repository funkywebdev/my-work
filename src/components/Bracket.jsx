import React, { useState, useEffect } from "react";
import { motion } from "framer-motion";
import api from "../api/api"; 
import schoollogo from "../assets/images/schoollogo.png";
import rounds from "../mockdata/MatchdataA";

// Countdown Component
const Countdown = ({ match }) => {
  const [timeLeft, setTimeLeft] = useState("");

  useEffect(() => {
    if (match.status !== "Upcoming" || match.time === "TBA") return;

    const interval = setInterval(() => {
      const now = new Date();
      const matchTime = new Date(match.time);
      const diff = matchTime - now;

      if (diff <= 0) {
        setTimeLeft("Live");
        clearInterval(interval);
      } else {
        const hours = Math.floor(diff / 1000 / 60 / 60);
        const minutes = Math.floor((diff / 1000 / 60) % 60);
        const seconds = Math.floor((diff / 1000) % 60);
        setTimeLeft(`${hours}h ${minutes}m ${seconds}s`);
      }
    }, 1000);

    return () => clearInterval(interval);
  }, [match.time, match.status]);

  return <>{timeLeft}</>;
};

// Animation Variants
const containerVariants = {
  hidden: { opacity: 0 },
  show: {
    opacity: 1,
    transition: {
      staggerChildren: 0.18,
    },
  },
};

const cardVariants = {
  hidden: { opacity: 0, y: 50, scale: 0.8 },
  show: {
    opacity: 1,
    y: 0,
    scale: 1,
    transition: {
      type: "spring",
      stiffness: 90,
      damping: 12,
    },
  },
};


const Bracket = () => {
  return (
    <div className="py-10 px-6 sm:px-12 lg:px-18">
      {/* Header */}
      <div className="text-center mb-10 sm:mb-6">
        <h1 className="text-3xl font-bold">Tournament Bracket</h1>
        <p className="text-gray-600 text-base sm:text-lg">
          Follow the incredible journey of young innovators on their path to the championship
        </p>
      </div>

      {rounds.map((round, rIdx) => (
        <div key={rIdx} className="mb-12">
          <p className="font-semibold text-center text-2xl mb-6">{round.name}</p>

          {/* Animated GRID */}
          <motion.div
            variants={containerVariants}
            initial="hidden"
            whileInView="show"
            viewport={{ once: true, amount: 0.2 }}
            className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6"
          >

            {/* Animated Match Cards */}
            {round.matches.map((match, idx) => (
              <motion.div
                key={idx}
                variants={cardVariants}
                whileHover={{
                  scale: 1.05,
                  rotate: 1,
                  boxShadow: "0px 12px 30px rgba(0,0,0,0.18)",
                }}
                className="border border-[#001489] rounded-xl p-5 shadow-md bg-white transition-all duration-300"
              >
                {/* Date & Status */}
                <div className="flex justify-between items-center mb-4 text-sm sm:text-base">
                  <p className="text-gray-500">
                    {match.status === "Upcoming" ? (
                      <Countdown match={match} />
                    ) : (
                      new Date(match.time).toLocaleString()
                    )}
                  </p>
                  <p
                    className={`px-3 py-1 rounded-full text-xs sm:text-sm font-semibold ${
                      match.status === "Live"
                        ? "border border-[#001489] text-[#001489] animate-pulse"
                        : match.status === "Upcoming"
                        ? "border border-[#001489] text-[#001489]"
                        : "bg-[#001489] text-white"
                    }`}
                  >
                    {match.status}
                  </p>
                </div>

                {/* Team 1 */}
                <div className="flex justify-between items-center mb-2 bg-[#FAFBFF] rounded-md p-2">
                  <span className="flex items-center space-x-2">
                    <img src={schoollogo} alt="School Logo" className="w-8 h-8 rounded" />
                    <span className="font-semibold text-base sm:text-lg">{match.team1}</span>
                  </span>
                  <p className="font-semibold">{match.score1}</p>
                </div>

                {/* Vs */}
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
      ))}
    </div>
  );
};

export default Bracket;
