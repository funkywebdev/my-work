import React, { useState, useEffect } from "react";
import axios from "axios";
import Clip from "../assets/images/Clip.png";
import medal from "../assets/images/medal.png";
import medal2 from "../assets/images/medal2.png";

const BASE_URL = "https://bql-production.up.railway.app";
const TOKEN = localStorage.getItem("schoolToken");

// Typing effect for champion text
const TypingText = ({ text, speed = 240, className }) => {
  const [displayed, setDisplayed] = useState("");
  useEffect(() => {
    let i = 0;
    setDisplayed("");
    const timer = setInterval(() => {
      setDisplayed(text.slice(0, i + 1));
      i++;
      if (i === text.length) clearInterval(timer);
    }, speed);
    return () => clearInterval(timer);
  }, [text, speed]);

  return <span className={className}>{displayed}</span>;
};

const SchoolLeader = () => {
  const [schools, setSchools] = useState([]);
  const [search, setSearch] = useState("");
  const [timeFrame, setTimeFrame] = useState("latest");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  // Fetch leaderboard
  const fetchLeaderboard = async () => {
    setLoading(true);
    setError("");
    try {
      const url =
        timeFrame === "all_time"
          ? `${BASE_URL}/leaderboard`
          : `${BASE_URL}/leaderboard?timeFrame=${timeFrame}`;

      const res = await axios.get(url, {
        headers: { Authorization: `Bearer ${TOKEN}` },
      });

      setSchools(Array.isArray(res.data) ? res.data : res.data?.data || []);
    } catch {
      setError("Failed to load leaderboard");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (!TOKEN) return setError("No school token found.");
    fetchLeaderboard();
  }, [timeFrame]);

  const filteredSchools = schools.filter((s) =>
    s.schoolName?.toLowerCase().includes(search.toLowerCase())
  );
  const topThree = filteredSchools.slice(0, 3);
  const others = filteredSchools.slice(3);

  const formatDateTime = (iso) =>
    iso ? new Date(iso).toLocaleDateString() : "-";

  return (
    <div className="min-h-screen px-4 sm:px-24 py-6 bg-gray-50">
      
      {/* HEADER */}
<div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 sm:mb-16 mb-6 ">
  {/* Title */}
  <div className="flex flex-col sm:flex-col sm:items-start gap-2">
    <h1 className=" text-2xl sm:text-4xl font-bold">Leaderboard</h1>
    <p className="text-black/60 text-[15px] sm:text-[17px]">Real-time rankings and performance across all STEM categories</p>
  </div>

  {/* Filters */}
  <div className="flex flex-col sm:flex-row sm:items-center gap-2">
    <select
      value={timeFrame}
      onChange={(e) => setTimeFrame(e.target.value)}
      className="border px-3 py-2 rounded-md"
    >
      <option value="latest">Latest</option>
      <option value="weekly">This Week</option>
      <option value="monthly">This Month</option>
      <option value="all_time">All Time</option>
    </select>

    <input
      value={search}
      onChange={(e) => setSearch(e.target.value)}
      placeholder="Search school..."
      className="border px-3 py-2 rounded-md"
    />
  </div>
</div>


      {loading && <p className="text-center">Loading leaderboard...</p>}
      {error && <p className="text-center text-red-500">{error}</p>}

      {!loading && !error && (
        <>
          {/* PODIUM */}
          {topThree.length === 3 && (
            <div className="grid sm:grid-cols-3 gap-6 mb-10  sm:mb-14 items-end">
              {/* 2nd */}
              <div className="podium-card delay-1 bg-white p-5 rounded-2xl text-center shadow-md">
                <img src={Clip} className="w-16 mx-auto mb-2 bounce" />
                <p className="text-xs">2nd Place</p>
                <h3 className="font-semibold truncate">
                  {topThree[1].schoolName}
                </h3>
                <p className="text-xl font-bold">{topThree[1].totalScore}</p>
              </div>

              {/* CHAMPION */}
              <div className="champion-card bg-[#001489] text-white p-7 rounded-2xl text-center shadow-xl sm:-mt-6">
                <img src={medal} className="w-20 mx-auto mb-3 bounce-slow" />
                <TypingText
                  text="Champion 🏆"
                  className="block text-sm tracking-wide"
                />
                <h3 className="font-semibold truncate mt-1">
                  <TypingText text={topThree[0].schoolName} />
                </h3>
                <p className="text-3xl font-bold pulse">
                  {topThree[0].totalScore}
                </p>
              </div>

              {/* 3rd */}
              <div className="podium-card delay-2 bg-white p-5 rounded-2xl text-center shadow-md">
                <img src={medal2} className="w-16 mx-auto mb-2 bounce" />
                <p className="text-xs">3rd Place</p>
                <h3 className="font-semibold truncate">
                  {topThree[2].schoolName}
                </h3>
                <p className="text-xl font-bold">{topThree[2].totalScore}</p>
              </div>
            </div>
          )}


          <div className="bg-white border border-black/10 rounded-xl overflow-x-auto">
            <table className="min-w-[550px] w-full text-xs sm:text-sm">
              <thead className="bg-[#001489] text-white">
                <tr>
                  <th className="px-3 py-2 text-left">Rank</th>
                  <th className="px-3 py-2 text-left">School Name</th>
                  <th className="px-3 py-2 text-right">Points</th>
                  <th className="px-3 py-2 text-right">Correct</th>
                  <th className="px-3 py-2 text-right">Attempted</th>
                  <th className="px-3 py-2 text-right">Accuracy</th>
                  <th className="px-3 py-2 text-right">Date</th>
                </tr>
              </thead>
              <tbody>
                {others.length === 0 ? (
                  <tr>
                    <td colSpan="7" className="px-3 py-6 text-center text-black/50">
                      No additional schools
                    </td>
                  </tr>
                ) : (
                  others.map((school, index) => (
                    <tr key={school.id} className="border-t border-black/5 hover:bg-black/5 transition">
                      <td className="px-3 py-2 font-medium text-black">#{index + 4}</td>
                      <td className="px-3 py-2 text-black">{school.schoolName}</td>
                      <td className="px-3 py-2 text-right font-semibold text-black">{school.totalScore?.toLocaleString()}</td>
                      <td className="px-3 py-2 text-right text-black">{school.totalCorrectAnswers}</td>
                      <td className="px-3 py-2 text-right text-black">{school.totalQuestionsAttempted}</td>
                      <td className="px-3 py-2 text-right text-black">{school.accuracy?.toFixed(0) || 0}%</td>
                      <td className="px-3 py-2 text-right text-black">{formatDateTime(school.createdAt)}</td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </>
      )}

      {/* ANIMATIONS */}
      <style>{`
        .podium-card {
          opacity: 0;
          transform: translateY(40px);
          animation: slideUp 0.7s ease forwards;
        }
        .delay-1 { animation-delay: 0.2s; }
        .delay-2 { animation-delay: 0.4s; }

        .champion-card {
          animation: slideUp 0.7s ease forwards, glow 2.5s infinite;
        }

        .bounce { animation: bounce 1.8s infinite; }
        .bounce-slow { animation: bounce 2.5s infinite; }
        .pulse { animation: pulse 1.6s infinite; }

        @keyframes slideUp {
          to { opacity: 1; transform: translateY(0); }
        }
        @keyframes glow {
          0%,100% { box-shadow: 0 0 0 rgba(255,215,0,0); }
          50% { box-shadow: 0 0 35px rgba(255,215,0,0.7); }
        }
        @keyframes bounce {
          0%, 100% { transform: translateY(0); }
          50% { transform: translateY(-8px); }
        }
        @keyframes pulse {
          0% { transform: scale(1); }
          50% { transform: scale(1.06); }
          100% { transform: scale(1); }
        }
      `}</style>
    </div>
  );
};

export default SchoolLeader;
