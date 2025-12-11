import React, { useState, useEffect } from "react";
import { motion } from "framer-motion";
import axios from "axios";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import schoollogo from "../assets/images/schoollogo.png";
import { handleAxiosError } from "../utils/errorHandler";

const baseUrl = "https://bql-production.up.railway.app";
const token = localStorage.getItem("schoolToken");

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
const cardVariants = {
  hidden: { opacity: 0, y: 50, scale: 0.8 },
  show: {
    opacity: 1,
    y: 0,
    scale: 1,
    transition: { type: "spring", stiffness: 90, damping: 12 },
  },
};

const Bracket = () => {
  const [tournaments, setTournaments] = useState([]);
  const [selectedTournament, setSelectedTournament] = useState(null);
  const [schedule, setSchedule] = useState([]);
  const [loading, setLoading] = useState(false);

  // Fetch tournaments
  const fetchTournaments = async () => {
    setLoading(true);
    try {
      const res = await axios.get(`${baseUrl}/tournaments`, {
        headers: { Authorization: `Bearer ${token}` },
      });

      console.log(res);

      if (res.data && res.data.length > 0) {
        setTournaments(res.data);
      } else {
        setTournaments([{ id: 1, name: "Mock Tournament", year: 2025 }]);
      }
    } catch (err) {
      console.error(err);

      toast.error(
        err.response?.status === 401
          ? "Session expired. Please log in again."
          : "Failed to fetch tournaments"
      );

      setTournaments([{ id: 1, name: "Mock Tournament", year: 2025 }]);
    } finally {
      setLoading(false);
    }
  };

  // Fetch schedule
  const fetchSchedule = async (tournamentId) => {
    setLoading(true);
    try {
      const res = await axios.get(
        `${baseUrl}/tournaments/${tournamentId}/school-schedule`,
        { headers: { Authorization: `Bearer ${token}` } }
      );

      setSchedule(res.data.matches || []);
    } catch (err) {
      console.error(err);

      // toast.error(
      //   err.response?.status === 401
      //     ? "Session expired. Please log in again."
      //     : "Failed to fetch schedule"
      // );

      handleAxiosError(err);
      

      setSchedule([]);
    } finally {
      setLoading(false);
    }
  };

  const handleSelectTournament = (t) => {
    setSelectedTournament(t);
    fetchSchedule(t.id);
  };

  useEffect(() => {
    fetchTournaments();
  }, []);

  return (
    <div className="py-10 px-6 sm:px-12 lg:px-18">

      {/* Toast Container */}
      <ToastContainer position="top-right" autoClose={3000} />

      <h1 className="text-3xl font-bold text-center mb-8">
        School Tournament Bracket
      </h1>

      {loading && <p className="text-center text-blue-500">Loading...</p>}

      {!loading && tournaments.length > 0 && (
        <div className="mb-8 text-center">
          <select
            className="border border-gray-300 p-2 rounded"
            onChange={(e) => {
              if (!e.target.value) return;
              handleSelectTournament(JSON.parse(e.target.value));
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
      )}

      {!loading && tournaments.length === 0 && (
        <p className="text-center text-gray-500">No tournaments available.</p>
      )}

      {selectedTournament && schedule.length === 0 && !loading && (
        <p className="text-center text-gray-500">
          No matches scheduled yet for this tournament.
        </p>
      )}

      {schedule.length > 0 &&
        schedule.map((match) => (
          <motion.div
            key={match.id}
            variants={cardVariants}
            initial="hidden"
            animate="show"
            className="border border-[#001489] rounded-xl p-5 shadow-md bg-white mb-4"
          >
            <div className="flex justify-between items-center mb-2 text-sm">
              <p>
                {match.time !== "TBA"
                  ? new Date(match.time).toLocaleString()
                  : "TBA"}
              </p>

              <p
                className={`px-3 py-1 rounded-full text-xs font-semibold ${
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

            {/* Team A */}
            <div className="flex justify-between items-center mb-2 bg-[#FAFBFF] rounded-md p-2">
              <span className="flex items-center space-x-2">
                <img
                  src={schoollogo}
                  alt="School Logo"
                  className="w-8 h-8 rounded"
                />
                <span className="font-semibold">
                  {match.teamA?.name || "TBD"}
                </span>
              </span>
              <p className="font-semibold">{match.scoreA || "-"}</p>
            </div>

            <p className="text-center font-semibold my-2 text-gray-700">Vs</p>

            {/* Team B */}
            <div className="flex justify-between items-center bg-[#FAFBFF] rounded-md p-2">
              <span className="flex items-center space-x-2">
                <img
                  src={schoollogo}
                  alt="School Logo"
                  className="w-8 h-8 rounded"
                />
                <span className="font-semibold">
                  {match.teamB?.name || "TBD"}
                </span>
              </span>
              <p className="font-semibold">{match.scoreB || "-"}</p>
            </div>
          </motion.div>
        ))}
    </div>
  );
};

export default Bracket;
