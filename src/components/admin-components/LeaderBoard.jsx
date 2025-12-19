import React, { useState, useEffect } from "react";
import axios from "axios";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import Clip from "../../assets/images/Clip.png";
import medal from "../../assets/images/medal.png";
import medal2 from "../../assets/images/medal2.png";

const BASE_URL = "https://bql-production.up.railway.app";
const TOKEN = localStorage.getItem("adminToken"); // platform admin token

const PlatformAdminLeaderboard = () => {
  const [schools, setSchools] = useState([]);
  const [search, setSearch] = useState("");
  const [timeFrame, setTimeFrame] = useState("latest");
  const [loading, setLoading] = useState(false);

  const fetchLeaderboard = async () => {
    setLoading(true);
    try {
      const url = `${BASE_URL}/leaderboard${timeFrame !== "all_time" ? `?timeFrame=${timeFrame}` : ""}`;
      const res = await axios.get(url, {
        headers: { Authorization: `Bearer ${TOKEN}` },
      });

      console.log("Axios Response:", res); // log full response
      setSchools(res.data || []);
    } catch (err) {
      console.error("Axios Error:", err);

      // Show toast with proper error message
      if (err.response) {
        // Server responded with a status code outside 2xx
        console.log("Response Data:", err.response.data);
        console.log("Status:", err.response.status);
        console.log("Headers:", err.response.headers);
        toast.error(err.response.data?.message || `Error ${err.response.status}`);
      } else if (err.request) {
        // Request was made but no response
        console.log("Request:", err.request);
        toast.error("No response from server. Check your network.");
      } else {
        // Something else happened
        toast.error(err.message || "Something went wrong!");
      }
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (!TOKEN) {
      toast.error("No admin token found. Please login.");
      return;
    }
    fetchLeaderboard();
  }, [timeFrame]);

  const filteredSchools = schools.filter((s) =>
    s.schoolName.toLowerCase().includes(search.toLowerCase())
  );

  const topThree = filteredSchools.slice(0, 3);
  const others = filteredSchools.slice(3);

  const formatDateTime = (iso) => {
    const date = new Date(iso);
    return `${date.toLocaleDateString()} ${date.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })}`;
  };

  return (
    <div className="min-h-screen px-4 py-6">
      <ToastContainer position="top-right" autoClose={5000} hideProgressBar />
      
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2 mb-6 sm:mb-15">
        <div>
          <h1 className="text-lg sm:text-3xl font-bold text-black mb-1">Leaderboard</h1>
          <p className="text-xs sm:text-base text-black/70">
            View rankings for all schools across the platform
          </p>
        </div>
        <div className="flex flex-col sm:flex-row gap-2 sm:gap-3 mt-2 sm:mt-0">
          <select
            value={timeFrame}
            onChange={(e) => setTimeFrame(e.target.value)}
            className="px-3 py-1 sm:px-4 sm:py-2 rounded-md border border-black/20 text-xs sm:text-sm focus:outline-none focus:ring-2 focus:ring-[#001489]"
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
            className="px-3 py-1 sm:px-4 sm:py-2 rounded-md border border-black/20 text-xs sm:text-sm focus:outline-none focus:ring-2 focus:ring-[#001489]"
          />
        </div>
      </div>

      {loading ? (
        <p className="text-center text-black/70">Loading leaderboard...</p>
      ) : (
        <>
          {/* Top 3 Podium */}
           {topThree.length === 3 && (
                      <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 mb-12 items-end">
                        {/* Rank 2 */}
                        <div className="bg-white rounded-2xl p-5 text-center shadow-md">
                          <img
                            src={Clip}
                            alt="2nd place"
                            className="w-16 h-16 mx-auto mb-3"
                          />
                          <p className="text-xs text-black/60">2nd Place</p>
                          <h3 className="font-semibold truncate">
                            {topThree[1].schoolName}
                          </h3>
                          <p className="text-xl font-bold mt-1">
                            {topThree[1].totalScore || 0}
                          </p>
                        </div>
          
                        {/* Rank 1 */}
                        <div className="bg-gradient-to-b from-[#001489] to-[#001489]/90 text-white rounded-2xl p-7 text-center shadow-xl sm:-mt-6">
                          <img
                            src={medal}
                            alt="1st place"
                            className="w-18 h-18 mx-auto mb-4"
                          />
                          <p className="text-sm opacity-80">Champion</p>
                          <h3 className="font-semibold text-lg truncate">
                            {topThree[0].schoolName}
                          </h3>
                          <p className="text-3xl font-bold mt-1">
                            {topThree[0].totalScore || 0}
                          </p>
                        </div>
          
                        {/* Rank 3 */}
                        <div className="bg-white rounded-2xl p-5 text-center shadow-md">
                          <img
                            src={medal2}
                            alt="3rd place"
                            className="w-16 h-16 mx-auto mb-3"
                          />
                          <p className="text-xs text-black/60">3rd Place</p>
                          <h3 className="font-semibold truncate">
                            {topThree[2].schoolName}
                          </h3>
                          <p className="text-xl font-bold mt-1">
                            {topThree[2].totalScore || 0}
                          </p>
                        </div>
                      </div>
                    )}

          {/* Table Rank 4+ */}
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
    </div>
  );
};

export default PlatformAdminLeaderboard;
