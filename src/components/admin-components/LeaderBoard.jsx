
import React, { useState, useEffect } from "react";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import axios from "axios";

import Clip from "../../assets/images/Clip.png";
import medal from "../../assets/images/medal.png";
import medal2 from "../../assets/images/medal2.png";

const baseUrl = "https://bql-production.up.railway.app";
const tabs = ["All Time", "Weekly", "Monthly", "Current Session", "School Ranks", "Specific School Rank"];
const top3Images = [medal, Clip, medal2];

const LeaderPage = () => {
  const [activeTab, setActiveTab] = useState("All Time");
  const [leaderboardData, setLeaderboardData] = useState([]);
  const [top3, setTop3] = useState([]);
  const [loading, setLoading] = useState(false);
  const [sessionId, setSessionId] = useState(localStorage.getItem("sessionId") || null);
  const [schoolId, setSchoolId] = useState(localStorage.getItem("schoolId") || "");

  const token = localStorage.getItem("adminToken");

  const api = axios.create({
    baseURL: baseUrl,
    headers: { "Content-Type": "application/json" },
  });

  api.interceptors.request.use((config) => {
    const t = localStorage.getItem("adminToken");
    if (t) config.headers.Authorization = `Bearer ${t}`;
    return config;
  });

  const normalizeData = (data) => {
    if (!Array.isArray(data)) return [];
    let normalized;
    if (activeTab === "School Ranks") {
      const aggregated = data.reduce((acc, curr) => {
        const id = curr.schoolId ?? curr.id ?? `id-${Math.random()}`;
        const name = curr.schoolName ?? curr.name ?? "Unknown";
        const points = Number(curr.totalScore ?? curr.points ?? 0);
        if (!acc[id]) acc[id] = { id, schoolId: id, schoolName: name, points, ...curr };
        else acc[id].points += points;
        return acc;
      }, {});
      normalized = Object.values(aggregated);
    } else {
      normalized = data.map((item, idx) => ({
        id: item.id ?? `id-${idx}`,
        schoolId: item.schoolId ?? item.id ?? `school-${idx}`,
        schoolName: item.schoolName ?? item.name ?? "Unknown",
        points: Number(item.totalScore ?? item.points ?? 0),
        totalCorrect: item.totalCorrectAnswers ?? 0,
        totalAttempted: item.totalQuestionsAttempted ?? 0,
        createdAt: item.createdAt ?? new Date().toISOString(),
        ...item,
      }));
    }

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
    } catch (e) {
      console.log("No session found", e);
    }
    return null;
  };

  const fetchLeaderboard = async (specificSchoolId = null) => {
    setLoading(true);
    setLeaderboardData([]);
    setTop3([]);

    if (!token) {
      toast.error("Token not found — please login.");
      setLoading(false);
      return;
    }

    try {
      let url = "";

      switch (activeTab) {
        case "All Time": url = `/leaderboard`; break;
        case "Weekly": url = `/leaderboard?timeFrame=weekly`; break;
        case "Monthly": url = `/leaderboard?timeFrame=monthly`; break;
        case "Current Session": {
          const sid = sessionId ?? (await ensureSessionId());
          if (!sid) { toast.error("Session ID not found."); setLoading(false); return; }
          url = `/leaderboard/session/${sid}`;
          break;
        }
        case "School Ranks": url = `/leaderboard`; break;
        case "Specific School Rank": {
          const sid = specificSchoolId || localStorage.getItem("schoolId");
          if (!sid) { toast.error("School ID not found."); setLoading(false); return; }
          url = `/leaderboard/school/${sid}/rank`; break;
        }
        default: url = `/leaderboard`;
      }

      const response = await api.get(url);
      const dataArray = Array.isArray(response.data) ? response.data : response.data.data ?? [];
      const normalized = normalizeData(dataArray);

      if (activeTab !== "Specific School Rank" && activeTab !== "My School Rank") {
        setTop3(normalized.slice(0, 3).map((item, idx) => ({ ...item, img: top3Images[idx] ?? Clip })));
        setLeaderboardData(normalized.slice(3));
      } else {
        setLeaderboardData(normalized);
      }
    } catch (error) {
      console.error("Failed to fetch leaderboard:", error);
      toast.error("Failed to fetch leaderboard.");
    } finally {
      setLoading(false);
    }
  };

  const formatDateTime = (isoString) => {
    const date = new Date(isoString);
    return `${date.toLocaleDateString()} ${date.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })}`;
  };

  useEffect(() => {
    if (activeTab === "Specific School Rank") {
      fetchLeaderboard(localStorage.getItem("schoolId"));
    } else {
      fetchLeaderboard();
    }
  }, [activeTab]);

  return (
    <div className="min-h-screen px-2 sm:px-6 lg:px-0">
      <ToastContainer position="top-right" />

      <div className=" mx-auto">
        {/* Header */}
        <div className="text-start mb-6 px-4">
          <h1 className="text-lg sm:text-xl md:text-2xl lg:text-2xl font-bold leading-snug">Leaderboard</h1>
          <p className="text-[10px] sm:text-xs md:text-sm lg:text-base text-gray-600 mt-1">
            Real-time rankings and performance across STEM categories.
          </p>
        </div>

        {/* Tabs */}
        <div className="grid grid-cols-2 sm:grid-cols-6  justify-start gap-2 mb-4 px-4">
          {tabs.map((tab) => (
            <button
              key={tab}
              onClick={() => setActiveTab(tab)}
              className={`px-2 sm:px-3 py-1 sm:py-1.5 rounded-full text-[10px] sm:text-xs md:text-sm font-medium transition-all
                ${activeTab === tab ? "bg-[#0B1674] text-white shadow" : "bg-gray-200 text-gray-800 hover:bg-gray-300"}`}
            >
              {tab}
            </button>
          ))}
        </div>

        {/* Specific School Input */}
        {activeTab === "Specific School Rank" && (
          <div className="flex gap-2 mb-6 px-4 flex-col sm:flex-row">
            <input
              type="text"
              placeholder="Enter School ID"
              value={schoolId}
              onChange={(e) => setSchoolId(e.target.value)}
              className="border border-gray-300 rounded px-2 py-1 text-[10px] sm:text-xs md:text-sm flex-1"
            />
            <button
              onClick={() => fetchLeaderboard(schoolId)}
              className="bg-[#0B1674] text-white px-3 py-1 rounded text-[10px] sm:text-xs md:text-sm"
            >
              Fetch School Rank
            </button>
          </div>
        )}

        {/* Top 3 Cards */}
        {activeTab !== "Specific School Rank" && activeTab !== "My School Rank" && (
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4 mb-8 px-4">
            {loading
              ? Array.from({ length: 3 }).map((_, idx) => (
                  <div key={idx} className="animate-pulse bg-white p-2 rounded-xl shadow h-24 sm:h-32" />
                ))
              : top3.map((leader) => (
                  <div key={leader.id} className="bg-white p-2 sm:p-3 rounded-xl shadow flex flex-col items-center text-center hover:scale-105 transition-transform">
                    <img src={leader.img} alt={leader.schoolName} className="w-8 h-8 sm:w-12 sm:h-12 mb-1" />
                    <p className="font-semibold text-[8px] sm:text-xs md:text-sm lg:text-base truncate">{leader.schoolName}</p>
                    <p className="text-[7px] sm:text-[9px] md:text-xs lg:text-sm">Points: {leader.points}</p>
                    <p className="text-[7px] sm:text-[9px] md:text-xs lg:text-sm">
                      Accuracy: {leader.totalAttempted > 0 ? ((leader.totalCorrect / leader.totalAttempted) * 100).toFixed(2) : 0}%
                    </p>
                  </div>
                ))}
          </div>
        )}

        {/* Leaderboard Table */}
        <div className="overflow-x-auto rounded-lg shadow bg-white px-2 sm:px-0">
          {loading ? (
            <div className="p-4 text-center text-gray-500 text-[10px] sm:text-xs md:text-sm">Loading leaderboard...</div>
          ) : leaderboardData.length === 0 ? (
            <div className="p-4 text-center text-gray-500 text-[10px] sm:text-xs md:text-sm">No data available.</div>
          ) : (
            <table className="min-w-[600px] sm:min-w-full divide-y divide-gray-200 text-center text-[8px] sm:text-[10px] lg:text-sm">
              <thead className="bg-gray-100">
                <tr>
                  {["Rank", "School ID", "School Name", "Points", "Correct Answers", "Questions Attempted", "Accuracy (%)", "Date & Time"].map((col, idx) => (
                    <th key={idx} className="px-2 sm:px-3 py-2 text-[8px] sm:text-[10px] lg:text-sm">{col}</th>
                  ))}
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200">
                {leaderboardData.map((row, idx) => (
                  <tr key={`${row.id}-${idx}`} className="hover:bg-gray-50">
                    <td className="px-2 sm:px-3 py-2 text-[8px] sm:text-[10px] lg:text-sm">{row.rank}</td>
                    <td className="px-2 sm:px-3 py-2 text-[8px] sm:text-[10px] lg:text-sm truncate">{row.schoolId}</td>
                    <td className="px-2 sm:px-3 py-2 text-[8px] sm:text-[10px] lg:text-sm truncate">{row.schoolName}</td>
                    <td className="px-2 sm:px-3 py-2 text-[8px] sm:text-[10px] lg:text-sm">{row.points}</td>
                    <td className="px-2 sm:px-3 py-2 text-[8px] sm:text-[10px] lg:text-sm">{row.totalCorrect}</td>
                    <td className="px-2 sm:px-3 py-2 text-[8px] sm:text-[10px] lg:text-sm">{row.totalAttempted}</td>
                    <td className="px-2 sm:px-3 py-2 text-[8px] sm:text-[10px] lg:text-sm">{row.totalAttempted > 0 ? ((row.totalCorrect / row.totalAttempted) * 100).toFixed(2) : 0}</td>
                    <td className="px-2 sm:px-3 py-2 text-[8px] sm:text-[10px] lg:text-sm">{formatDateTime(row.createdAt)}</td>
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
