import React, { useEffect, useState, useCallback } from "react";
import { motion } from "framer-motion";
import axios from "axios";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { useNavigate } from "react-router-dom";
import schoollogo from "../assets/images/schoollogo.png";
import { handleAxiosError } from "../utils/errorHandler";

const baseUrl = "https://bql-production.up.railway.app";

const fadeUp = {
  hidden: { opacity: 0, y: 20 },
  show: { opacity: 1, y: 0 },
};

/* =========================
   Team Row Component
========================= */
const TeamRow = ({ school, score }) => {
  return (
    <div className="flex justify-between items-center bg-[#F5F7FB] rounded-md p-3">
      <div className="flex items-center gap-3">
        <img
          src={school?.logoUrl || schoollogo}
          className="w-10 h-10 rounded"
          alt="logo"
        />
        <span className="font-semibold text-black">
          {school?.name || "TBD"}
        </span>
      </div>

      <span className="font-bold text-black">{score ?? 0}</span>
    </div>
  );
};

const Bracket = () => {
  const navigate = useNavigate();

  const [token, setToken] = useState(null);
  const [tournaments, setTournaments] = useState([]);
  const [selectedTournament, setSelectedTournament] = useState(null);
  const [schedule, setSchedule] = useState([]);
  const [loading, setLoading] = useState(false);
  const [checkInLoading, setCheckInLoading] = useState(null);

  /* =====================
     Load token safely
  ===================== */
  useEffect(() => {
    const storedToken = localStorage.getItem("schoolToken");
    setToken(storedToken);
    if (!storedToken) toast.error("Authentication token missing");
  }, []);

  /* =====================
     Fetch tournaments
  ===================== */
  const fetchTournaments = useCallback(async () => {
    if (!token) return;

    setLoading(true);
    try {
      const res = await axios.get(`${baseUrl}/tournaments`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setTournaments(res.data || []);
    } catch {
      toast.error("Unable to load tournaments");
    } finally {
      setLoading(false);
    }
  }, [token]);

  /* =====================
     Fetch schedule
  ===================== */
  const fetchSchedule = useCallback(
    async (id) => {
      if (!token || !id) return;

      setLoading(true);
      try {
        const res = await axios.get(
          `${baseUrl}/tournaments/${id}/school-schedule`,
          { headers: { Authorization: `Bearer ${token}` } }
        );
        setSchedule(res.data || []);
      } catch (err) {
        handleAxiosError(err);
      } finally {
        setLoading(false);
      }
    },
    [token]
  );

  /* =====================
     Check-in
  ===================== */
  const handleCheckIn = async (matchId) => {
    if (!token) return;

    setCheckInLoading(matchId);
    try {
      const res = await axios.post(
        `${baseUrl}/tournaments/matches/${matchId}/check-in`,
        {},
        { headers: { Authorization: `Bearer ${token}` } }
      );

      if (res.status === 200 || res.status === 201) {
        toast.success("Checked in successfully!");
        navigate("/match");
      }
    } catch (err) {
      handleAxiosError(err);
    } finally {
      setCheckInLoading(null);
    }
  };

  /* =====================
     Initial load
  ===================== */
  useEffect(() => {
    fetchTournaments();
  }, [fetchTournaments]);

  return (
    <div className="bg-white px-6 py-10">
      <ToastContainer />

      <motion.h1
        variants={fadeUp}
        initial="hidden"
        animate="show"
        className="text-[18px] sm:text-2xl font-bold text-center mb-1"
      >
        Tournament Bracket
      </motion.h1>

      <p className="text-center mb-6 text-[16px]">
        Follow the incredible journey of young innovators on their path to the championship
      </p>

      {/* Tournament Select */}
      <div className="max-w-xl mx-auto mb-8">
        <select
          className="w-full border border-[#001489] rounded-lg p-3 text-black focus:outline-none"
          onChange={(e) => {
            if (!e.target.value) return;
            const t = JSON.parse(e.target.value);
            setSelectedTournament(t);
            fetchSchedule(t.id);
          }}
        >
          <option value="">Select Tournament</option>
          {tournaments.map((t) => (
            <option key={t.id} value={JSON.stringify(t)}>
              {t.name} ({t.year})
            </option>
          ))}
        </select>
      </div>

      {loading && <p className="text-center text-[#001489]">Loading...</p>}

      {/* Schedule Cards */}
      <div className="max-w-3xl mx-auto space-y-5">
        {!loading && selectedTournament && schedule.length === 0 && (
          <p className="text-center text-[#001489]">No matches scheduled yet.</p>
        )}

        {schedule.map((match) => (
          <motion.div
            key={match.id}
            variants={fadeUp}
            initial="hidden"
            animate="show"
            className="bg-white rounded-xl shadow p-5 border border-[#001489]"
          >
            {/* Match Header */}
            <div className="flex justify-between items-center mb-3">
              <p className="text-sm text-black">
                {match.time !== "TBA"
                  ? new Date(match.time).toLocaleString()
                  : "TBA"}
              </p>
              <span
                className={`px-3 py-1 rounded-full text-xs font-semibold ${
                  match.status === "live"
                    ? "bg-[#001489] text-white animate-pulse"
                    : "bg-gray-200 text-gray-700"
                }`}
              >
                {match.status}
              </span>
            </div>

            {/* ===== TEAMS WITH VS ===== */}
            <div className="space-y-3">
              <TeamRow
                school={match.school1}
                score={match.school1Score}
              />

              <div className="text-center font-bold text-[#001489] text-sm">
                VS
              </div>

              <TeamRow
                school={match.school2}
                score={match.school2Score}
              />
            </div>

            {/* Check-in */}
            {match.status === "pending" && (
              <button
                onClick={() => handleCheckIn(match.id)}
                disabled={checkInLoading === match.id}
                className="w-full mt-4 bg-[#001489] text-white py-2 rounded-lg disabled:opacity-50"
              >
                {checkInLoading === match.id
                  ? "Checking in..."
                  : "Check In"}
              </button>
            )}
          </motion.div>
        ))}
      </div>
    </div>
  );
};

export default Bracket;
