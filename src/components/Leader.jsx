

// import React, { useState, useEffect } from "react";
// import { toast, ToastContainer } from "react-toastify";
// import "react-toastify/dist/ReactToastify.css";
// import axios from "axios";

// import Clip from "../assets/images/Clip.png";
// import medal from "../assets/images/medal.png";
// import medal2 from "../assets/images/medal2.png";

// const baseUrl = "https://bql-production.up.railway.app";

// const tabs = ["All Time", "Weekly", "Monthly", "Current Session"];
// const top3Images = [medal, Clip, medal2];

// const LeaderPage = () => {
// const [activeTab, setActiveTab] = useState("All Time");
// const [leaderboardData, setLeaderboardData] = useState([]);
// const [top3, setTop3] = useState([]);
// const [loading, setLoading] = useState(false);
// const [sessionId, setSessionId] = useState(localStorage.getItem("sessionId") || null);

// const api = axios.create({
// baseURL: baseUrl,
// headers: { "Content-Type": "application/json" },
// });

// api.interceptors.request.use((config) => {
// const token = localStorage.getItem("schoolToken");
// if (token) config.headers.Authorization = `Bearer ${token}`;
// return config;
// });

// const normalizeData = (data) => {
// if (!Array.isArray(data)) return [];
// let normalized = data.map((item, idx) => ({
// id: item.id ?? `id-${idx}`,
// schoolName: item.schoolName ?? item.name ?? "Unknown",
// points: Number(item.totalScore ?? item.points ?? 0),
// totalCorrect: item.totalCorrectAnswers ?? 0,
// totalAttempted: item.totalQuestionsAttempted ?? 0,
// createdAt: item.createdAt ?? new Date().toISOString(),
// ...item,
// }));
// normalized.sort((a, b) => b.points - a.points);
// return normalized.map((item, idx) => ({ ...item, rank: idx + 1 }));
// };

// const ensureSessionId = async () => {
// if (sessionId) return sessionId;
// try {
// const res = await api.get("/session/current");
// const sid = res?.data?.id ?? res?.data?.sessionId ?? null;
// if (sid) {
// localStorage.setItem("sessionId", sid);
// setSessionId(sid);
// return sid;
// }
// } catch (error) {
// console.log("Session not found", error);
// }
// return null;
// };

// const fetchLeaderboard = async () => {
// setLoading(true);
// setLeaderboardData([]);
// setTop3([]);
// try {
// let url = "/leaderboard";

// if (activeTab === "Weekly") url += "?timeFrame=weekly";
// else if (activeTab === "Monthly") url += "?timeFrame=monthly";
// else if (activeTab === "Current Session") {
// const sid = await ensureSessionId();
// if (!sid) throw new Error("No current session found");
// url = `/leaderboard/session/${sid}`;
// }

// const response = await api.get(url);
// const dataArray = Array.isArray(response.data) ? response.data : response.data.data ?? [];
// const normalized = normalizeData(dataArray);

// setTop3(normalized.slice(0, 3).map((item, idx) => ({ ...item, img: top3Images[idx] ?? Clip })));
// setLeaderboardData(normalized.slice(3));
// } catch (error) {
// console.error(error);
// toast.error("Failed to fetch leaderboard.");
// } finally {
// setLoading(false);
// }
// };

// const formatDateTime = (iso) => {
// const date = new Date(iso);
// return `${date.toLocaleDateString()} ${date.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })}`;
// };

// useEffect(() => {
// fetchLeaderboard();
// }, [activeTab]);

// return (
// <div className="min-h-screen text-center bg-gray-50 py-6 px-2 sm:px-12">
//     <ToastContainer position="top-right" />


//         <div className="mb-10 px-4 text-center">
//             <h1
//                 className="text-3xl sm:text-4xl font-bold bg-clip-text drop-shadow-sm">
//                 Leaderboard
//             </h1>

//             <p className="text-gray-600 text-[16px] sm:text-[19px] mt-2 max-w-xl mx-auto">
//                 Real-time rankings and performance across all STEM categories
//             </p>
//         </div>

//         TOP 3 CARDS
//         {top3.length > 0 && (
//         <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 mb-10 px-4">
//             {top3.map((item, index) => {
//             let imgSize = "";

//             if (index === 0) {
//             imgSize = "w-24 h-24 sm:w-28 sm:h-28"; // 🥇 Biggest
//             } else if (index === 1) {
//             imgSize = "w-20 h-20 sm:w-24 sm:h-24"; // 🥈 Medium
//             } else {
//             imgSize = "w-16 h-16 sm:w-20 sm:h-20"; // 🥉 Smallest
//             }

//             return (
//             <div key={item.id}
//                 className="bg-white rounded-2xl p-6 shadow-lg hover:shadow-xl transition-all duration-300 flex flex-col items-center space-y-3 border border-gray-100">
//                 {/* Rank Image */}
//                 <div className="flex items-center justify-center">
//                     <img src={item.img} alt="rank medal" className={`${imgSize} drop-shadow-md`} />
//                 </div>

//                 {/* School Name */}
//                 <p className="text-lg font-bold text-gray-800 text-center">
//                     {item.schoolName}
//                 </p>

//                 {/* Points */}
//                 <p className="text-sm text-gray-500">Total Points</p>

//                 <p className="text-2xl font-bold drop-shadow-sm">
//                     {item.points}
//                 </p>
//             </div>
//             );
//             })}
//         </div>
//         )}


//         <div className="bg-white rounded-md shadow">
//         <div className="text-center px-4 py-5 sm:px-5">
//           <p className="font-bold text-xl sm:text-2xl md:text-2xl">
//             Rankings
//           </p>

//           <p className="text-sm sm:text-base md:text-lg text-gray-600">
//             Overall tournament standings
//           </p>
//         </div>
//         <div className="flex flex-wrap justify-center gap-2 mb-6 px-4">
//             {tabs.map((tab) => (
//             <button key={tab} onClick={()=> setActiveTab(tab)}
//                 className={`px-3 py-1 sm:px-4 sm:py-2 rounded-full text-xs sm:text-sm md:text-base font-medium ${
//                 activeTab === tab ? "bg-[#0B1674] text-white" : "bg-gray-200 text-gray-800"
//                 }`}
//                 >
//                 {tab}
//             </button>
//             ))}
//         </div>

//         {/* Table */}
//         <div className="overflow-x-auto rounded-lg shadow bg-white text-center px-2 sm:px-4">
//             {loading ? (
//             <div className="p-4 text-gray-500 text-sm sm:text-base">Loading leaderboard...</div>
//             ) : leaderboardData.length === 0 ? (
//             <div className="p-4 text-gray-500 text-sm sm:text-base">No data available.</div>
//             ) : (
//             <table className="min-w-[600px] sm:min-w-full divide-y divide-gray-200 text-center">
//                 <thead className="bg-gray-100">
//                     <tr>
//                         {["Rank", "School Name", "Points", "Correct", "Attempted", "Accuracy (%)", "Date & Time"].map(
//                         (col) => (
//                         <th key={col} className="px-2 py-2 text-xs sm:text-sm md:text-base font-semibold">
//                             {col}
//                         </th>
//                         )
//                         )}
//                     </tr>
//                 </thead>
//                 <tbody className="divide-y divide-gray-200">
//                     {leaderboardData.map((row) => (
//                     <tr key={row.id} className="hover:bg-gray-50">
//                         <td className="px-2 py-2 text-xs sm:text-sm md:text-base font-semibold">{row.rank}</td>
//                         <td className="px-2 py-2 text-xs sm:text-sm md:text-base font-semibold">{row.schoolName}</td>
//                         <td className="px-2 py-2 text-xs sm:text-sm md:text-base">{row.points}</td>
//                         <td className="px-2 py-2 text-xs sm:text-sm md:text-base">{row.totalCorrect}</td>
//                         <td className="px-2 py-2 text-xs sm:text-sm md:text-base">{row.totalAttempted}</td>
//                         <td className="px-2 py-2 text-xs sm:text-sm md:text-base">
//                             {row.totalAttempted > 0 ? ((row.totalCorrect / row.totalAttempted) * 100).toFixed(2) : 0}
//                         </td>
//                         <td className="px-2 py-2 text-xs sm:text-sm md:text-base">{formatDateTime(row.createdAt)}</td>
//                     </tr>
//                     ))}
//                 </tbody>
//             </table>
//             )}
//         </div>
//      </div>
//     </div>
// );
// };

// export default LeaderPage;




import React, { useState, useEffect } from "react";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import axios from "axios";

import Clip from "../assets/images/Clip.png";
import medal from "../assets/images/medal.png";
import medal2 from "../assets/images/medal2.png";

const baseUrl = "https://bql-production.up.railway.app";

const tabs = ["All Time", "Weekly", "Monthly", "Current Session"];
const top3Images = [medal, Clip, medal2];

const LeaderPage = () => {
  const [activeTab, setActiveTab] = useState("All Time");
  const [leaderboardData, setLeaderboardData] = useState([]);
  const [top3, setTop3] = useState([]);
  const [loading, setLoading] = useState(false);
  const [sessionId, setSessionId] = useState(localStorage.getItem("sessionId") || null);

  const api = axios.create({
    baseURL: baseUrl,
    headers: { "Content-Type": "application/json" },
  });

  api.interceptors.request.use((config) => {
    const token = localStorage.getItem("schoolToken");
    if (token) config.headers.Authorization = `Bearer ${token}`;
    return config;
  });

  const normalizeData = (data) => {
    if (!Array.isArray(data)) return [];
    let normalized = data.map((item, idx) => ({
      id: item.id ?? `id-${idx}`,
      schoolName: item.schoolName ?? item.name ?? "Unknown",
      points: Number(item.totalScore ?? item.points ?? 0),
      totalCorrect: item.totalCorrectAnswers ?? 0,
      totalAttempted: item.totalQuestionsAttempted ?? 0,
      createdAt: item.createdAt ?? new Date().toISOString(),
      ...item,
    }));
    normalized.sort((a, b) => b.points - a.points);
    return normalized.map((item, idx) => ({ ...item, rank: idx + 1 }));
  };

  const ensureSessionId = async () => {
    if (sessionId) return sessionId;
    try {
      const res = await api.get("/session/current");
      const sid = res?.data?.id ?? res?.data?.sessionId ?? null;
      if (sid) {
        localStorage.setItem("sessionId", sid);
        setSessionId(sid);
        return sid;
      }
    } catch (error) {
      console.log("Session not found", error);
    }
    return null;
  };

  const fetchLeaderboard = async () => {
    setLoading(true);
    setLeaderboardData([]);
    setTop3([]);
    try {
      let url = "/leaderboard";

      if (activeTab === "Weekly") url += "?timeFrame=weekly";
      else if (activeTab === "Monthly") url += "?timeFrame=monthly";
      else if (activeTab === "Current Session") {
        const sid = await ensureSessionId();
        if (!sid) throw new Error("No current session found");
        url = `/leaderboard/session/${sid}`;
      }

      const response = await api.get(url);
      const dataArray = Array.isArray(response.data) ? response.data : response.data.data ?? [];
      const normalized = normalizeData(dataArray);

      setTop3(normalized.slice(0, 3).map((item, idx) => ({ ...item, img: top3Images[idx] ?? Clip })));
      setLeaderboardData(normalized.slice(3));
    } catch (error) {
      console.error(error);
      toast.error("Failed to fetch leaderboard.");
    } finally {
      setLoading(false);
    }
  };

  const formatDateTime = (iso) => {
    const date = new Date(iso);
    return `${date.toLocaleDateString()} ${date.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })}`;
  };

  useEffect(() => {
    fetchLeaderboard();
  }, [activeTab]);

  return (
    <div className="min-h-screen text-center bg-gray-50 py-6 px-2 sm:px-12">
      <ToastContainer position="top-right" />

      <div className="mb-10 px-4 text-center">
        <h1 className="text-3xl sm:text-4xl font-bold bg-clip-text drop-shadow-sm">Leaderboard</h1>
        <p className="text-gray-600 text-[16px] sm:text-[19px] mt-2 max-w-xl mx-auto">
          Real-time rankings and performance across all STEM categories
        </p>
      </div>

      {/* TOP 3 CARDS */}
      {top3.length > 0 && (
        <div className="grid grid-cols-3 justify-center items-end gap-6 mb-10 px-4">
          {top3.map((item, index) => {
            let imgSize = "";
            let marginTop = "";

            if (index === 0) {
              imgSize = "w-28 h-28 sm:w-32 sm:h-32"; // 🥇 Biggest
              marginTop = "mt-0"; // Middle card tallest
            } else if (index === 1) {
              imgSize = "w-24 h-24 sm:w-28 sm:h-28"; // 🥈 Medium
              marginTop = "mt-6"; // Left side lower
            } else {
              imgSize = "w-20 h-20 sm:w-24 sm:h-24"; // 🥉 Smallest
              marginTop = "mt-12"; // Right side lowest
            }

            // To place first card in the middle visually, reorder: second, first, third
            const displayIndex = index === 0 ? 1 : index === 1 ? 0 : 2;

            const displayItem = top3[displayIndex];

            let displayImgSize = "";
            let displayMarginTop = "";

            if (displayIndex === 0) {
              displayImgSize = "w-24 h-24 sm:w-28 sm:h-32";
              displayMarginTop = "mt-6";
            } else if (displayIndex === 1) {
              displayImgSize = "w-28 h-28 sm:w-32 sm:h-28";
              displayMarginTop = "mt-0";
            } else {
              displayImgSize = "w-20 h-20 sm:w-24 sm:h-24";
              displayMarginTop = "mt-12";
            }

            return (
              <div
                key={displayItem.id}
                className={`bg-white rounded-2xl p-6 shadow-lg hover:shadow-xl transition-all duration-300 flex flex-col items-center space-y-3 border border-gray-100 ${displayMarginTop}`}
              >
                {/* Rank Image */}
                <div className="flex items-center justify-center">
                  <img src={displayItem.img} alt="rank medal" className={`${displayImgSize} drop-shadow-md`} />
                </div>

                {/* School Name */}
                <p className="text-lg font-bold text-gray-800 text-center">{displayItem.schoolName}</p>

                {/* Points */}
                <p className="text-sm text-gray-500">Total Points</p>
                <p className="text-2xl font-bold drop-shadow-sm">{displayItem.points}</p>
              </div>
            );
          })}
        </div>
      )}

      <div className="bg-white rounded-md shadow">
        <div className="text-center px-4 py-5 sm:px-5">
          <p className="font-bold text-xl sm:text-2xl md:text-2xl">Rankings</p>
          <p className="text-sm sm:text-base md:text-lg text-gray-600">Overall tournament standings</p>
        </div>
        <div className="flex flex-wrap justify-center gap-2 mb-6 px-4">
          {tabs.map((tab) => (
            <button
              key={tab}
              onClick={() => setActiveTab(tab)}
              className={`px-3 py-1 sm:px-4 sm:py-2 rounded-full text-xs sm:text-sm md:text-base font-medium ${
                activeTab === tab ? "bg-[#0B1674] text-white" : "bg-gray-200 text-gray-800"
              }`}
            >
              {tab}
            </button>
          ))}
        </div>

        {/* Table */}
        <div className="overflow-x-auto rounded-lg shadow bg-white text-center px-2 sm:px-4">
          {loading ? (
            <div className="p-4 text-gray-500 text-sm sm:text-base">Loading leaderboard...</div>
          ) : leaderboardData.length === 0 ? (
            <div className="p-4 text-gray-500 text-sm sm:text-base">No data available.</div>
          ) : (
            <table className="min-w-[600px] sm:min-w-full divide-y divide-gray-200 text-center">
              <thead className="bg-gray-100">
                <tr>
                  {["Rank", "School Name", "Points", "Correct", "Attempted", "Accuracy (%)", "Date & Time"].map(
                    (col) => (
                      <th key={col} className="px-2 py-2 text-xs sm:text-sm md:text-base font-semibold">
                        {col}
                      </th>
                    )
                  )}
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200">
                {leaderboardData.map((row) => (
                  <tr key={row.id} className="hover:bg-gray-50">
                    <td className="px-2 py-2 text-xs sm:text-sm md:text-base font-semibold">{row.rank}</td>
                    <td className="px-2 py-2 text-xs sm:text-sm md:text-base font-semibold">{row.schoolName}</td>
                    <td className="px-2 py-2 text-xs sm:text-sm md:text-base">{row.points}</td>
                    <td className="px-2 py-2 text-xs sm:text-sm md:text-base">{row.totalCorrect}</td>
                    <td className="px-2 py-2 text-xs sm:text-sm md:text-base">{row.totalAttempted}</td>
                    <td className="px-2 py-2 text-xs sm:text-sm md:text-base">
                      {row.totalAttempted > 0 ? ((row.totalCorrect / row.totalAttempted) * 100).toFixed(2) : 0}
                    </td>
                    <td className="px-2 py-2 text-xs sm:text-sm md:text-base">{formatDateTime(row.createdAt)}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </div>
      </div>
    </div>
  );
};

export default LeaderPage;
