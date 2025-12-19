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

//     <div className="mb-6 px-4 text-center">
//         <h1 className="text-3xl sm:text-4xl font-bold bg-clip-text drop-shadow-sm">Leaderboard</h1>
//         <p className="text-gray-600 text-[16px] sm:text-[19px] max-w-xl mx-auto mt-2">
//             Real-time rankings and performance across all STEM categories
//         </p>
//     </div>

//     {/* TOP 3 CARDS */}
//     {top3.length > 0 && (
//     <div className="grid grid-cols-1 sm:grid-cols-3 justify-center items-end gap-6 mb-10 px-4">
//         {top3.map((item, index) => {
//         let imgSize = "";
//         let marginTop = "";

//         if (index === 0) {
//         imgSize = "w-28 h-28 sm:w-32 sm:h-32"; // 🥇 Biggest
//         marginTop = "mt-0"; // Middle card tallest
//         } else if (index === 1) {
//         imgSize = "w-24 h-24 sm:w-28 sm:h-28"; // 🥈 Medium
//         marginTop = "mt-6"; // Left side lower
//         } else {
//         imgSize = "w-20 h-20 sm:w-24 sm:h-24"; // 🥉 Smallest
//         marginTop = "mt-12"; // Right side lowest
//         }

//         // Make 1st place bigger, 2nd & 3rd slightly smaller
//         const displayIndex = index === 0 ? 1 : index === 1 ? 0 : 2;
//         const displayItem = top3[displayIndex];

//         // Responsive sizes
//         const sizeClasses = {
//         0: "w-20 h-20 sm:w-28 sm:h-28 md:w-32 md:h-32", // Winner (center)
//         1: "w-16 h-16 sm:w-20 sm:h-20 md:w-24 md:h-24", // Runner up
//         2: "w-16 h-16 sm:w-20 sm:h-20 md:w-24 md:h-24", // Third place
//         };

//         // Responsive spacing
//         const marginClasses = {
//         0: "mt-4 md:mt-6",
//         1: "mt-0 md:mt-0",
//         2: "mt-6 md:mt-10",
//         };

//         const displayImgSize = sizeClasses[displayIndex];
//         const displayMarginTop = marginClasses[displayIndex];


//         return (
//         <div key={displayItem.id} className={`bg-white rounded-2xl p-6 shadow-lg hover:shadow-xl transition-all
//             duration-300 flex flex-col items-center space-y-3 border border-gray-100 ${displayMarginTop}`}>
//             {/* Rank Image */}
//             <div className="flex items-center justify-center">
//                 <img src={displayItem.img} alt="rank medal" className={`${displayImgSize} drop-shadow-md`} />
//             </div>

//             {/* School Name */}
//             <p className="text-lg font-bold text-gray-800 text-center">{displayItem.schoolName}</p>

//             {/* Points */}
//             <p className="text-sm text-gray-500">Total Points</p>
//             <p className="text-2xl font-bold drop-shadow-sm">{displayItem.points}</p>
//         </div>
//         );
//         })}
//     </div>
//     )}

//     <div className="bg-white rounded-md shadow">
//         <div className="text-center px-4 py-5 sm:px-5">
//             <p className="font-bold text-xl sm:text-2xl md:text-2xl">Rankings</p>
//             <p className="text-sm sm:text-base md:text-lg text-gray-600">Overall tournament standings</p>
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
//     </div>
// </div>
// );
// };

// export default LeaderPage;








// import React, { useState, useEffect } from "react";
// import axios from "axios";
// import { toast, ToastContainer } from "react-toastify";
// import "react-toastify/dist/ReactToastify.css";

// import Clip from "../assets/images/Clip.png";
// import medal from "../assets/images/medal.png";
// import medal2 from "../assets/images/medal2.png";

// const baseUrl = "https://bql-production.up.railway.app";

// const SchoolLeaderboard = () => {
//   const [schools, setSchools] = useState([]);
//   const [search, setSearch] = useState("");
//   const [timeFrame, setTimeFrame] = useState("latest");
//   const [loading, setLoading] = useState(false);

//   const token = localStorage.getItem("schoolToken");

//   useEffect(() => {
//     const fetchLeaderboard = async () => {
//       try {
//         setLoading(true);

//         const response = await axios.get(`${baseUrl}/leaderboard/school/rank`, {
//           params: { timeFrame },
//           headers: {
//             Authorization: `Bearer ${token}`,
//             "Content-Type": "application/json",
//           },
//         });

//         console.log("Full response:", response);

//         const data = Array.isArray(response.data)
//           ? response.data
//           : Array.isArray(response.data?.schoolRank)
//           ? response.data.schoolRank
//           : Array.isArray(response.data?.data)
//           ? response.data.data
//           : [];

//         // Normalize data
//         const normalizedSchools = data.map((s, idx) => ({
//           id: s.id || idx,
//           schoolName: s.schoolName || s.name || "Unknown",
//           totalScore: s.totalScore || s.points || 0,
//           totalCorrectAnswers: s.totalCorrectAnswers || 0,
//           totalQuestionsAttempted: s.totalQuestionsAttempted || 0,
//           accuracy: s.accuracy || 0,
//           createdAt: s.createdAt || new Date().toISOString(),
//         }));

//         setSchools(normalizedSchools);
//       } catch (err) {
//         console.error(err);

//         if (err.response) {
//           toast.error(err.response.data?.message || `Server error: ${err.response.status}`);
//         } else if (err.request) {
//           toast.error("No response from server. Check your network.");
//         } else {
//           toast.error("An unexpected error occurred.");
//         }

//         setSchools([]);
//       } finally {
//         setLoading(false);
//       }
//     };

//     fetchLeaderboard();
//   }, [timeFrame, token]);

//   // Filter safely
//   const filteredSchools = Array.isArray(schools)
//     ? schools.filter((school) =>
//         (school.schoolName || "").toLowerCase().includes(search.toLowerCase())
//       )
//     : [];

//   const topThree = filteredSchools.slice(0, 3);
//   const others = filteredSchools.slice(3);

//   return (
//     <div className="min-h-screen bg-white px-4 py-10 md:px-24">
//       <ToastContainer position="top-right" autoClose={3000} hideProgressBar />

//       {/* Header */}
//       <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 mb-10">
//         <div>
//           <h1 className="sm:text-3xl text-[20px] font-bold text-black mb-1">Leaderboard</h1>
//           <p className="text-[16px] text-black/70">Real-time rankings and performance across all STEM categories</p>
//         </div>
//         <div className="flex gap-3">
//           <select
//             value={timeFrame}
//             onChange={(e) => setTimeFrame(e.target.value)}
//             className="px-4 py-2 rounded-md border border-black/20 text-sm focus:outline-none focus:ring-2 focus:ring-[#001489]"
//           >
//             <option value="latest">Latest</option>
//             <option value="weekly">This Week</option>
//             <option value="monthly">This Month</option>
//             <option value="all_time">All Time</option>
//           </select>
//           <input
//             type="text"
//             placeholder="Search school..."
//             value={search}
//             onChange={(e) => setSearch(e.target.value)}
//             className="px-4 py-2 rounded-md border border-black/20 text-sm focus:outline-none focus:ring-2 focus:ring-[#001489]"
//           />
//         </div>
//       </div>

//       {loading ? (
//         <p className="text-black/70">Loading leaderboard...</p>
//       ) : filteredSchools.length === 0 ? (
//         <p className="text-black/50">No schools found.</p>
//       ) : (
//         <>
//           {/* Top 3 Podium */}
//           {topThree.length >= 3 && (
//             <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 mb-10">
//               {/* Rank 2 */}
//               <div className="bg-white border border-black/10 rounded-xl p-4 text-center hover:shadow-md transition">
//                 <img src={medal2} alt="Second place" className="w-10 h-10 mx-auto mb-2" />
//                 <h3 className="text-sm font-semibold text-black truncate">{topThree[1].schoolName}</h3>
//                 <p className="text-xs text-black/60">Rank 2</p>
//                 <p className="mt-2 text-lg font-bold text-black">{topThree[1].totalScore.toLocaleString()}</p>
//               </div>

//               {/* Rank 1 */}
//               <div className="bg-[#001489] text-white rounded-xl p-5 text-center shadow-md scale-105">
//                 <img src={medal} alt="First place" className="w-12 h-12 mx-auto mb-2" />
//                 <h3 className="text-sm font-semibold truncate">{topThree[0].schoolName}</h3>
//                 <p className="text-xs text-white/80">Rank 1</p>
//                 <p className="mt-2 text-xl font-bold">{topThree[0].totalScore.toLocaleString()}</p>
//               </div>

//               {/* Rank 3 */}
//               <div className="bg-white border border-black/10 rounded-xl p-4 text-center hover:shadow-md transition">
//                 <img src={Clip} alt="Third place" className="w-10 h-10 mx-auto mb-2" />
//                 <h3 className="text-sm font-semibold text-black truncate">{topThree[2].schoolName}</h3>
//                 <p className="text-xs text-black/60">Rank 3</p>
//                 <p className="mt-2 text-lg font-bold text-black">{topThree[2].totalScore.toLocaleString()}</p>
//               </div>
//             </div>
//           )}

//           {/* Table Rank 4+ */}
//           <div className="bg-white border border-black/10 rounded-xl overflow-x-auto">
//             <table className="w-full text-sm">
//               <thead className="bg-[#001489] text-white">
//                 <tr>
//                   <th className="px-4 py-3 text-left">Rank</th>
//                   <th className="px-4 py-3 text-left">School Name</th>
//                   <th className="px-4 py-3 text-right">Points</th>
//                   <th className="px-4 py-3 text-right">Correct</th>
//                   <th className="px-4 py-3 text-right">Attempted</th>
//                   <th className="px-4 py-3 text-right">Accuracy (%)</th>
//                   <th className="px-4 py-3 text-right">Date & Time</th>
//                 </tr>
//               </thead>
//               <tbody>
//                 {others.length === 0 ? (
//                   <tr>
//                     <td colSpan="7" className="px-6 py-8 text-center text-black/50">
//                       No additional schools available
//                     </td>
//                   </tr>
//                 ) : (
//                   others.map((school, index) => (
//                     <tr key={school.id} className="border-t border-black/5 hover:bg-black/5 transition">
//                       <td className="px-4 py-3 font-medium text-black">#{index + 4}</td>
//                       <td className="px-4 py-3 text-black">{school.schoolName}</td>
//                       <td className="px-4 py-3 text-right font-semibold text-black">{school.totalScore.toLocaleString()}</td>
//                       <td className="px-4 py-3 text-right text-black">{school.totalCorrectAnswers}</td>
//                       <td className="px-4 py-3 text-right text-black">{school.totalQuestionsAttempted}</td>
//                       <td className="px-4 py-3 text-right text-black">{school.accuracy?.toFixed(2) || 0}%</td>
//                       <td className="px-4 py-3 text-right text-black">{new Date(school.createdAt).toLocaleString()}</td>
//                     </tr>
//                   ))
//                 )}
//               </tbody>
//             </table>
//           </div>
//         </>
//       )}
//     </div>
//   );
// };

// export default SchoolLeaderboard;



// import React, { useState, useEffect } from "react";
// import axios from "axios";
// import { toast, ToastContainer } from "react-toastify";
// import "react-toastify/dist/ReactToastify.css";

// import Clip from "../assets/images/Clip.png";
// import medal from "../assets/images/medal.png";
// import medal2 from "../assets/images/medal2.png";

// const baseUrl = "https://bql-production.up.railway.app";

// const SchoolLeaderboard = () => {
//   const [schools, setSchools] = useState([]);
//   const [search, setSearch] = useState("");
//   const [timeFrame, setTimeFrame] = useState("latest");
//   const [loading, setLoading] = useState(false);

//   const token = localStorage.getItem("schoolToken");

//   useEffect(() => {
//     const fetchLeaderboard = async () => {
//       try {
//         setLoading(true);

//         const response = await axios.get(`${baseUrl}/leaderboard/school/rank`, {
//           params: { timeFrame },
//           headers: {
//             Authorization: `Bearer ${token}`,
//             "Content-Type": "application/json",
//           },
//         });

//         console.log("=== FULL RESPONSE ===", response);
//         console.log("=== response.data ===", response.data);

//         let data =
//           Array.isArray(response.data?.schoolRank) && response.data.schoolRank.length > 0
//             ? response.data.schoolRank
//             : Array.isArray(response.data?.data) && response.data.data.length > 0
//             ? response.data.data
//             : [];

//         // Fallback demo data if API returns empty
//         if (data.length === 0) {
//           console.log("No schools returned from API. Using demo data.");
//           data = [
//             { id: 1, schoolName: "Demo School A", totalScore: 300, totalCorrectAnswers: 30, totalQuestionsAttempted: 40, accuracy: 75, createdAt: new Date() },
//             { id: 2, schoolName: "Demo School B", totalScore: 250, totalCorrectAnswers: 25, totalQuestionsAttempted: 35, accuracy: 71, createdAt: new Date() },
//             { id: 3, schoolName: "Demo School C", totalScore: 200, totalCorrectAnswers: 20, totalQuestionsAttempted: 30, accuracy: 66.7, createdAt: new Date() },
//             { id: 4, schoolName: "Demo School D", totalScore: 150, totalCorrectAnswers: 15, totalQuestionsAttempted: 25, accuracy: 60, createdAt: new Date() },
//           ];
//         }

//         console.log("=== NORMALIZED DATA BEFORE MAPPING ===", data);

//         // Normalize data
//         const normalizedSchools = data.map((s, idx) => ({
//           id: s.id || idx,
//           schoolName: s.schoolName || s.name || "Unknown",
//           totalScore: s.totalScore || s.points || 0,
//           totalCorrectAnswers: s.totalCorrectAnswers || 0,
//           totalQuestionsAttempted: s.totalQuestionsAttempted || 0,
//           accuracy: s.accuracy || 0,
//           createdAt: s.createdAt || new Date().toISOString(),
//         }));

//         console.log("=== NORMALIZED SCHOOLS ===", normalizedSchools);

//         setSchools(normalizedSchools);
//       } catch (err) {
//         console.error(err);

//         if (err.response) {
//           toast.error(err.response.data?.message || `Server error: ${err.response.status}`);
//         } else if (err.request) {
//           toast.error("No response from server. Check your network.");
//         } else {
//           toast.error("An unexpected error occurred.");
//         }

//         setSchools([]);
//       } finally {
//         setLoading(false);
//       }
//     };

//     fetchLeaderboard();
//   }, [timeFrame, token]);

//   // Filter safely
//   const filteredSchools = Array.isArray(schools)
//     ? schools.filter((school) =>
//         (school.schoolName || "").toLowerCase().includes(search.toLowerCase())
//       )
//     : [];

//   const topThree = filteredSchools.slice(0, 3);
//   const others = filteredSchools.slice(3);

//   return (
//     <div className="min-h-screen bg-white px-4 py-10 md:px-24">
//       <ToastContainer position="top-right" autoClose={3000} hideProgressBar />

//       {/* Header */}
//       <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 mb-10">
//         <div>
//           <h1 className="sm:text-3xl text-[20px] font-bold text-black mb-1">Leaderboard</h1>
//           <p className="text-[16px] text-black/70">Real-time rankings and performance across all STEM categories</p>
//         </div>
//         <div className="flex gap-3">
//           <select
//             value={timeFrame}
//             onChange={(e) => setTimeFrame(e.target.value)}
//             className="px-4 py-2 rounded-md border border-black/20 text-sm focus:outline-none focus:ring-2 focus:ring-[#001489]"
//           >
//             <option value="latest">Latest</option>
//             <option value="weekly">This Week</option>
//             <option value="monthly">This Month</option>
//             <option value="all_time">All Time</option>
//           </select>
//           <input
//             type="text"
//             placeholder="Search school..."
//             value={search}
//             onChange={(e) => setSearch(e.target.value)}
//             className="px-4 py-2 rounded-md border border-black/20 text-sm focus:outline-none focus:ring-2 focus:ring-[#001489]"
//           />
//         </div>
//       </div>

//       {loading ? (
//         <p className="text-black/70">Loading leaderboard...</p>
//       ) : filteredSchools.length === 0 ? (
//         <p className="text-black/50">No schools found.</p>
//       ) : (
//         <>
//           {/* Top 3 Podium */}
//           {topThree.length >= 3 && (
//             <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 mb-10">
//               {/* Rank 2 */}
//               <div className="bg-white border border-black/10 rounded-xl p-4 text-center hover:shadow-md transition">
//                 <img src={medal2} alt="Second place" className="w-10 h-10 mx-auto mb-2" />
//                 <h3 className="text-sm font-semibold text-black truncate">{topThree[1].schoolName}</h3>
//                 <p className="text-xs text-black/60">Rank 2</p>
//                 <p className="mt-2 text-lg font-bold text-black">{topThree[1].totalScore.toLocaleString()}</p>
//               </div>

//               {/* Rank 1 */}
//               <div className="bg-[#001489] text-white rounded-xl p-5 text-center shadow-md scale-105">
//                 <img src={medal} alt="First place" className="w-12 h-12 mx-auto mb-2" />
//                 <h3 className="text-sm font-semibold truncate">{topThree[0].schoolName}</h3>
//                 <p className="text-xs text-white/80">Rank 1</p>
//                 <p className="mt-2 text-xl font-bold">{topThree[0].totalScore.toLocaleString()}</p>
//               </div>

//               {/* Rank 3 */}
//               <div className="bg-white border border-black/10 rounded-xl p-4 text-center hover:shadow-md transition">
//                 <img src={Clip} alt="Third place" className="w-10 h-10 mx-auto mb-2" />
//                 <h3 className="text-sm font-semibold text-black truncate">{topThree[2].schoolName}</h3>
//                 <p className="text-xs text-black/60">Rank 3</p>
//                 <p className="mt-2 text-lg font-bold text-black">{topThree[2].totalScore.toLocaleString()}</p>
//               </div>
//             </div>
//           )}

//           {/* Table Rank 4+ */}
//           <div className="bg-white border border-black/10 rounded-xl overflow-x-auto">
//             <table className="w-full text-sm">
//               <thead className="bg-[#001489] text-white">
//                 <tr>
//                   <th className="px-4 py-3 text-left">Rank</th>
//                   <th className="px-4 py-3 text-left">School Name</th>
//                   <th className="px-4 py-3 text-right">Points</th>
//                   <th className="px-4 py-3 text-right">Correct</th>
//                   <th className="px-4 py-3 text-right">Attempted</th>
//                   <th className="px-4 py-3 text-right">Accuracy (%)</th>
//                   <th className="px-4 py-3 text-right">Date & Time</th>
//                 </tr>
//               </thead>
//               <tbody>
//                 {others.length === 0 ? (
//                   <tr>
//                     <td colSpan="7" className="px-6 py-8 text-center text-black/50">
//                       No additional schools available
//                     </td>
//                   </tr>
//                 ) : (
//                   others.map((school, index) => (
//                     <tr key={school.id} className="border-t border-black/5 hover:bg-black/5 transition">
//                       <td className="px-4 py-3 font-medium text-black">#{index + 4}</td>
//                       <td className="px-4 py-3 text-black">{school.schoolName}</td>
//                       <td className="px-4 py-3 text-right font-semibold text-black">{school.totalScore.toLocaleString()}</td>
//                       <td className="px-4 py-3 text-right text-black">{school.totalCorrectAnswers}</td>
//                       <td className="px-4 py-3 text-right text-black">{school.totalQuestionsAttempted}</td>
//                       <td className="px-4 py-3 text-right text-black">{school.accuracy?.toFixed(2) || 0}%</td>
//                       <td className="px-4 py-3 text-right text-black">{new Date(school.createdAt).toLocaleString()}</td>
//                     </tr>
//                   ))
//                 )}
//               </tbody>
//             </table>
//           </div>
//         </>
//       )}
//     </div>
//   );
// };

// export default SchoolLeaderboard;



import React, { useState } from "react";

import Clip from "../assets/images/Clip.png";
import medal from "../assets/images/medal.png";
import medal2 from "../assets/images/medal2.png";

const sampleSchools = [
  { id: 1, schoolName: "Greenwood High", totalScore: 980, totalCorrectAnswers: 95, totalQuestionsAttempted: 100, accuracy: 95, createdAt: new Date() },
  { id: 2, schoolName: "Hillview Academy", totalScore: 920, totalCorrectAnswers: 90, totalQuestionsAttempted: 100, accuracy: 90, createdAt: new Date() },
  { id: 3, schoolName: "Maplewood School", totalScore: 870, totalCorrectAnswers: 85, totalQuestionsAttempted: 100, accuracy: 85, createdAt: new Date() },
  { id: 4, schoolName: "Sunrise High", totalScore: 850, totalCorrectAnswers: 80, totalQuestionsAttempted: 100, accuracy: 80, createdAt: new Date() },
  { id: 5, schoolName: "Riverside School", totalScore: 820, totalCorrectAnswers: 75, totalQuestionsAttempted: 100, accuracy: 75, createdAt: new Date() },
  { id: 6, schoolName: "Oakwood College", totalScore: 790, totalCorrectAnswers: 70, totalQuestionsAttempted: 100, accuracy: 70, createdAt: new Date() },
];

const SchoolLeader = () => {
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
    <div className="min-h-screen sm:px-24 px-8 py-8">
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

export default SchoolLeader;
