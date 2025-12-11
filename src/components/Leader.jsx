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
    <div className="min-h-screen px-4 sm:px-6 text-center bg-gray-50 py-6">
      <ToastContainer position="top-right" />

      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <div className="mb-6 px-4 text-center">
          <h1 className="text-lg sm:text-xl md:text-2xl lg:text-3xl font-bold mb-1">Leaderboard</h1>
          <p className="text-sm sm:text-base md:text-base lg:text-lg text-gray-600">
            Real-time school rankings across STEM categories.
          </p>
        </div>

        {/* Top 3 Cards */}
        {top3.length > 0 && (
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 sm:gap-6 mb-8 px-4">
            {top3.map((item) => (
              <div
                key={item.id}
                className="bg-white shadow rounded-xl p-4 sm:p-5 flex flex-col items-center space-y-2"
              >
                <img
                  src={item.img}
                  alt="rank medal"
                  className="w-10 h-10 sm:w-12 sm:h-12 md:w-14 md:h-14"
                />
                <p className="text-sm sm:text-base md:text-lg font-bold">{item.schoolName}</p>
                <p className="text-xs sm:text-sm md:text-base text-gray-500">Points: {item.points}</p>
                <p className="text-xs sm:text-sm md:text-base font-semibold text-[#0B1674]">Rank #{item.rank}</p>
              </div>
            ))}
          </div>
        )}

        {/* Tabs */}
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
