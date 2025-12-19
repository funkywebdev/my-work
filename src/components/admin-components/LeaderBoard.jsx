
// import React, { useState, useEffect } from "react";
// import { toast, ToastContainer } from "react-toastify";
// import "react-toastify/dist/ReactToastify.css";
// import axios from "axios";

// import Clip from "../../assets/images/Clip.png";
// import medal from "../../assets/images/medal.png";
// import medal2 from "../../assets/images/medal2.png";

// const baseUrl = "https://bql-production.up.railway.app";
// const tabs = ["All Time", "Weekly", "Monthly", "Current Session", "School Ranks", "Specific School Rank"];
// const top3Images = [medal, Clip, medal2];

// const LeaderPage = () => {
//   const [activeTab, setActiveTab] = useState("All Time");
//   const [leaderboardData, setLeaderboardData] = useState([]);
//   const [top3, setTop3] = useState([]);
//   const [loading, setLoading] = useState(false);
//   const [sessionId, setSessionId] = useState(localStorage.getItem("sessionId") || null);
//   const [schoolId, setSchoolId] = useState(localStorage.getItem("schoolId") || "");

//   const token = localStorage.getItem("adminToken");

//   const api = axios.create({
//     baseURL: baseUrl,
//     headers: { "Content-Type": "application/json" },
//   });

//   api.interceptors.request.use((config) => {
//     const t = localStorage.getItem("adminToken");
//     if (t) config.headers.Authorization = `Bearer ${t}`;
//     return config;
//   });

//   const normalizeData = (data) => {
//     if (!Array.isArray(data)) return [];
//     let normalized;
//     if (activeTab === "School Ranks") {
//       const aggregated = data.reduce((acc, curr) => {
//         const id = curr.schoolId ?? curr.id ?? `id-${Math.random()}`;
//         const name = curr.schoolName ?? curr.name ?? "Unknown";
//         const points = Number(curr.totalScore ?? curr.points ?? 0);
//         if (!acc[id]) acc[id] = { id, schoolId: id, schoolName: name, points, ...curr };
//         else acc[id].points += points;
//         return acc;
//       }, {});
//       normalized = Object.values(aggregated);
//     } else {
//       normalized = data.map((item, idx) => ({
//         id: item.id ?? `id-${idx}`,
//         schoolId: item.schoolId ?? item.id ?? `school-${idx}`,
//         schoolName: item.schoolName ?? item.name ?? "Unknown",
//         points: Number(item.totalScore ?? item.points ?? 0),
//         totalCorrect: item.totalCorrectAnswers ?? 0,
//         totalAttempted: item.totalQuestionsAttempted ?? 0,
//         createdAt: item.createdAt ?? new Date().toISOString(),
//         ...item,
//       }));
//     }

//     normalized.sort((a, b) => b.points - a.points);
//     return normalized.map((item, idx) => ({ ...item, rank: idx + 1 }));
//   };

//   const ensureSessionId = async () => {
//     if (sessionId) return sessionId;
//     try {
//       const res = await api.get("/session/current");
//       const sid = res?.data?.id ?? res?.data?.sessionId ?? null;
//       if (sid) {
//         localStorage.setItem("sessionId", sid);
//         setSessionId(sid);
//         return sid;
//       }
//     } catch (e) {
//       console.log("No session found", e);
//     }
//     return null;
//   };

//   const fetchLeaderboard = async (specificSchoolId = null) => {
//     setLoading(true);
//     setLeaderboardData([]);
//     setTop3([]);

//     if (!token) {
//       toast.error("Token not found — please login.");
//       setLoading(false);
//       return;
//     }

//     try {
//       let url = "";

//       switch (activeTab) {
//         case "All Time": url = `/leaderboard`; break;
//         case "Weekly": url = `/leaderboard?timeFrame=weekly`; break;
//         case "Monthly": url = `/leaderboard?timeFrame=monthly`; break;
//         case "Current Session": {
//           const sid = sessionId ?? (await ensureSessionId());
//           if (!sid) { toast.error("Session ID not found."); setLoading(false); return; }
//           url = `/leaderboard/session/${sid}`;
//           break;
//         }
//         case "School Ranks": url = `/leaderboard`; break;
//         case "Specific School Rank": {
//           const sid = specificSchoolId || localStorage.getItem("schoolId");
//           if (!sid) { toast.error("School ID not found."); setLoading(false); return; }
//           url = `/leaderboard/school/${sid}/rank`; break;
//         }
//         default: url = `/leaderboard`;
//       }

//       const response = await api.get(url);
//       const dataArray = Array.isArray(response.data) ? response.data : response.data.data ?? [];
//       const normalized = normalizeData(dataArray);

//       if (activeTab !== "Specific School Rank" && activeTab !== "My School Rank") {
//         setTop3(normalized.slice(0, 3).map((item, idx) => ({ ...item, img: top3Images[idx] ?? Clip })));
//         setLeaderboardData(normalized.slice(3));
//       } else {
//         setLeaderboardData(normalized);
//       }
//     } catch (error) {
//       console.error("Failed to fetch leaderboard:", error);
//       toast.error("Failed to fetch leaderboard.");
//     } finally {
//       setLoading(false);
//     }
//   };

//   const formatDateTime = (isoString) => {
//     const date = new Date(isoString);
//     return `${date.toLocaleDateString()} ${date.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })}`;
//   };

//   useEffect(() => {
//     if (activeTab === "Specific School Rank") {
//       fetchLeaderboard(localStorage.getItem("schoolId"));
//     } else {
//       fetchLeaderboard();
//     }
//   }, [activeTab]);

//   return (
//     <div className="min-h-screen p-2 sm:p-4">
//       <ToastContainer position="top-right" />

//       {/* Header */}
//       <div className="text-left mb-6 px-2 sm:px-4">
//         <h1 className="text-lg sm:text-xl md:text-2xl font-bold">Leaderboard</h1>
//         <p className="text-[10px] sm:text-xs md:text-sm text-gray-600 mt-1">
//           Real-time rankings and performance across STEM categories.
//         </p>
//       </div>

//       {/* Tabs */}
//       <div className="flex gap-2 overflow-x-auto mb-4 px-2 sm:px-4">
//         {tabs.map((tab) => (
//           <button
//             key={tab}
//             onClick={() => setActiveTab(tab)}
//             className={`flex-shrink-0 px-3 py-1 sm:px-4 sm:py-2 rounded-full text-[10px] sm:text-xs md:text-sm font-medium transition-all
//               ${activeTab === tab ? "bg-[#0B1674] text-white shadow" : "bg-gray-200 text-gray-800 hover:bg-gray-300"}`}
//           >
//             {tab}
//           </button>
//         ))}
//       </div>

//       {/* Specific School Input */}
//       {activeTab === "Specific School Rank" && (
//         <div className="flex flex-col sm:flex-row gap-2 mb-6 px-2 sm:px-4">
//           <input
//             type="text"
//             placeholder="Enter School ID"
//             value={schoolId}
//             onChange={(e) => setSchoolId(e.target.value)}
//             className="border border-gray-300 rounded px-2 py-1 text-[10px] sm:text-xs flex-1"
//           />
//           <button
//             onClick={() => fetchLeaderboard(schoolId)}
//             className="bg-[#0B1674] text-white px-3 py-1 sm:px-4 sm:py-1.5 rounded text-[10px] sm:text-xs"
//           >
//             Fetch
//           </button>
//         </div>
//       )}

//       {/* Top 3 Cards */}
//       {activeTab !== "Specific School Rank" && activeTab !== "My School Rank" && (
//         <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4 sm:gap-12 mb-6 px-2 sm:px-4 sm:py-4">
//           {loading
//             ? Array.from({ length: 3 }).map((_, idx) => (
//                 <div key={idx} className="animate-pulse bg-white p-4 rounded-xl shadow h-28 sm:h-36" />
//               ))
//             : top3.map((leader) => (
//                 <div key={leader.id} className="bg-white p-3 rounded-xl shadow flex flex-col items-center text-center hover:scale-105 transition-transform">
//                   <img src={leader.img} alt={leader.schoolName} className="w-16 h-16 sm:w-32 sm:h-32 mb-1" />
//                   <p className="font-semibold text-[10px] sm:text-xs md:text-sm truncate">{leader.schoolName}</p>
//                   <p className="text-[9px] sm:text-[10px] md:text-sm">Points: {leader.points}</p>
//                   <p className="text-[9px] sm:text-[10px] md:text-sm">
//                     Accuracy: {leader.totalAttempted > 0 ? ((leader.totalCorrect / leader.totalAttempted) * 100).toFixed(2) : 0}%
//                   </p>
//                 </div>
//               ))}
//         </div>
//       )}

//       {/* Leaderboard Table */}
//       <div className="overflow-x-auto rounded-lg shadow bg-white px-2 sm:px-4">
//         {loading ? (
//           <div className="p-4 text-center text-gray-500 text-[10px] sm:text-xs md:text-sm">Loading leaderboard...</div>
//         ) : leaderboardData.length === 0 ? (
//           <div className="p-4 text-center text-gray-500 text-[10px] sm:text-xs md:text-sm">No data available.</div>
//         ) : (
//           <table className="min-w-[600px] sm:min-w-full divide-y divide-gray-200 text-center text-[9px] sm:text-[10px] md:text-sm">
//             <thead className="bg-gray-100">
//               <tr>
//                 {["Rank", "School ID", "School Name", "Points", "Correct Answers", "Questions Attempted", "Accuracy (%)", "Date & Time"].map((col, idx) => (
//                   <th key={idx} className="px-2 sm:px-3 py-2 text-[8px] sm:text-[10px] md:text-sm">{col}</th>
//                 ))}
//               </tr>
//             </thead>
//             <tbody className="divide-y divide-gray-200">
//               {leaderboardData.map((row, idx) => (
//                 <tr key={`${row.id}-${idx}`} className="hover:bg-gray-50">
//                   <td className="px-2 sm:px-3 py-2 text-[8px] sm:text-[10px] md:text-sm">{row.rank}</td>
//                   <td className="px-2 sm:px-3 py-2 text-[8px] sm:text-[10px] md:text-sm truncate">{row.schoolId}</td>
//                   <td className="px-2 sm:px-3 py-2 text-[8px] sm:text-[10px] md:text-sm truncate">{row.schoolName}</td>
//                   <td className="px-2 sm:px-3 py-2 text-[8px] sm:text-[10px] md:text-sm">{row.points}</td>
//                   <td className="px-2 sm:px-3 py-2 text-[8px] sm:text-[10px] md:text-sm">{row.totalCorrect}</td>
//                   <td className="px-2 sm:px-3 py-2 text-[8px] sm:text-[10px] md:text-sm">{row.totalAttempted}</td>
//                   <td className="px-2 sm:px-3 py-2 text-[8px] sm:text-[10px] md:text-sm">{row.totalAttempted > 0 ? ((row.totalCorrect / row.totalAttempted) * 100).toFixed(2) : 0}</td>
//                   <td className="px-2 sm:px-3 py-2 text-[8px] sm:text-[10px] md:text-sm">{formatDateTime(row.createdAt)}</td>
//                 </tr>
//               ))}
//             </tbody>
//           </table>
//         )}
//       </div>
//     </div>
//   );
// };

// export default LeaderPage;



import React, { useState } from "react";

import Clip from "../../assets/images/Clip.png";
import medal from "../../assets/images/medal.png";
import medal2 from "../../assets/images/medal2.png";

const sampleSchools = [
  { id: 1, schoolName: "Greenwood High", totalScore: 980, totalCorrectAnswers: 95, totalQuestionsAttempted: 100, accuracy: 95, createdAt: new Date() },
  { id: 2, schoolName: "Hillview Academy", totalScore: 920, totalCorrectAnswers: 90, totalQuestionsAttempted: 100, accuracy: 90, createdAt: new Date() },
  { id: 3, schoolName: "Maplewood School", totalScore: 870, totalCorrectAnswers: 85, totalQuestionsAttempted: 100, accuracy: 85, createdAt: new Date() },
  { id: 4, schoolName: "Sunrise High", totalScore: 850, totalCorrectAnswers: 80, totalQuestionsAttempted: 100, accuracy: 80, createdAt: new Date() },
  { id: 5, schoolName: "Riverside School", totalScore: 820, totalCorrectAnswers: 75, totalQuestionsAttempted: 100, accuracy: 75, createdAt: new Date() },
  { id: 6, schoolName: "Oakwood College", totalScore: 790, totalCorrectAnswers: 70, totalQuestionsAttempted: 100, accuracy: 70, createdAt: new Date() },
];

const SchoolLeaderboard = () => {
  const [search, setSearch] = useState("");
  const [timeFrame, setTimeFrame] = useState("latest");

  const filteredSchools = sampleSchools.filter((school) =>
    school.schoolName.toLowerCase().includes(search.toLowerCase())
  );

  const topThree = filteredSchools.slice(0, 3);
  const others = filteredSchools.slice(3);

  const formatDateTime = (iso) => {
    const date = new Date(iso);
    return `${date.toLocaleDateString()} ${date.toLocaleTimeString([], {
      hour: "2-digit",
      minute: "2-digit",
    })}`;
  };

  return (
    <div className="min-h-screen px-4 py-6">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 mb-10">
        <div>
          <h1 className="sm:text-3xl text-[20px] font-bold text-black mb-1">
            Leaderboard
          </h1>
          <p className="text-[16px] text-black/70">
            Real-time rankings and performance across all STEM categories
          </p>
        </div>
        <div className="flex gap-3">
          <select
            value={timeFrame}
            onChange={(e) => setTimeFrame(e.target.value)}
            className="px-4 py-2 rounded-md border border-black/20 text-sm focus:outline-none focus:ring-2 focus:ring-[#001489]"
          >
            <option value="latest">Latest</option>
            <option value="weekly">This Week</option>
            <option value="monthly">This Month</option>
            <option value="all_time">All Time</option>
          </select>
          <input
            type="text"
            placeholder="Search school..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="px-4 py-2 rounded-md border border-black/20 text-sm focus:outline-none focus:ring-2 focus:ring-[#001489]"
          />
        </div>
      </div>

      {/* Top 3 Podium */}
      {topThree.length >= 3 && (
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 mb-10">
          {/* Rank 2 */}
          <div className="bg-white border border-black/10 rounded-xl p-4 text-center hover:shadow-md transition">
            <img src={medal2} alt="Second place" className="w-10 h-10 mx-auto mb-2" />
            <h3 className="text-sm font-semibold text-black truncate">{topThree[1].schoolName}</h3>
            <p className="text-xs text-black/60">Rank 2</p>
            <p className="mt-2 text-lg font-bold text-black">{topThree[1].totalScore.toLocaleString()}</p>
          </div>

          {/* Rank 1 */}
          <div className="bg-[#001489] text-white rounded-xl p-5 text-center shadow-md scale-105">
            <img src={medal} alt="First place" className="w-12 h-12 mx-auto mb-2" />
            <h3 className="text-sm font-semibold truncate">{topThree[0].schoolName}</h3>
            <p className="text-xs text-white/80">Rank 1</p>
            <p className="mt-2 text-xl font-bold">{topThree[0].totalScore.toLocaleString()}</p>
          </div>

          {/* Rank 3 */}
          <div className="bg-white border border-black/10 rounded-xl p-4 text-center hover:shadow-md transition">
            <img src={Clip} alt="Third place" className="w-10 h-10 mx-auto mb-2" />
            <h3 className="text-sm font-semibold text-black truncate">{topThree[2].schoolName}</h3>
            <p className="text-xs text-black/60">Rank 3</p>
            <p className="mt-2 text-lg font-bold text-black">{topThree[2].totalScore.toLocaleString()}</p>
          </div>
        </div>
      )}

      {/* Table Rank 4+ */}
      <div className="bg-white border border-black/10 rounded-xl overflow-x-auto">
        <table className="w-full text-sm">
          <thead className="bg-[#001489] text-white">
            <tr>
              <th className="px-4 py-3 text-left">Rank</th>
              <th className="px-4 py-3 text-left">School Name</th>
              <th className="px-4 py-3 text-right">Points</th>
              <th className="px-4 py-3 text-right">Correct</th>
              <th className="px-4 py-3 text-right">Attempted</th>
              <th className="px-4 py-3 text-right">Accuracy (%)</th>
              <th className="px-4 py-3 text-right">Date & Time</th>
            </tr>
          </thead>
          <tbody>
            {others.length === 0 ? (
              <tr>
                <td colSpan="7" className="px-6 py-8 text-center text-black/50">
                  No additional schools available
                </td>
              </tr>
            ) : (
              others.map((school, index) => (
                <tr key={school.id} className="border-t border-black/5 hover:bg-black/5 transition">
                  <td className="px-4 py-3 font-medium text-black">#{index + 4}</td>
                  <td className="px-4 py-3 text-black">{school.schoolName}</td>
                  <td className="px-4 py-3 text-right font-semibold text-black">{school.totalScore.toLocaleString()}</td>
                  <td className="px-4 py-3 text-right text-black">{school.totalCorrectAnswers}</td>
                  <td className="px-4 py-3 text-right text-black">{school.totalQuestionsAttempted}</td>
                  <td className="px-4 py-3 text-right text-black">{school.accuracy?.toFixed(2) || 0}%</td>
                  <td className="px-4 py-3 text-right text-black">{formatDateTime(school.createdAt)}</td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default SchoolLeaderboard;
