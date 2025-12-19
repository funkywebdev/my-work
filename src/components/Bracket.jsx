
import React, { useEffect, useState } from "react";
import { motion } from "framer-motion";
import axios from "axios";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { useNavigate } from "react-router-dom";
import schoollogo from "../assets/images/schoollogo.png";
import { handleAxiosError } from "../utils/errorHandler";

const baseUrl = "https://bql-production.up.railway.app";
const token = localStorage.getItem("schoolToken");

const fadeUp = {
  hidden: { opacity: 0, y: 20 },
  show: { opacity: 1, y: 0 },
};

const Bracket = () => {
  const navigate = useNavigate();

  const [tournaments, setTournaments] = useState([]);
  const [selectedTournament, setSelectedTournament] = useState(null);
  const [schedule, setSchedule] = useState([]);
  const [loading, setLoading] = useState(false);
  const [checkInLoading, setCheckInLoading] = useState(null);

  const fetchTournaments = async () => {
    setLoading(true);
    try {
      const res = await axios.get(`${baseUrl}/tournaments`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      console.log("Tournaments response:", res.data);
      setTournaments(res.data || []);
    } catch (err) {
      toast.error("Unable to load tournaments");
    } finally {
      setLoading(false);
    }
  };

  const fetchSchedule = async (id) => {
    setLoading(true);
    try {
      const res = await axios.get(`${baseUrl}/tournaments/${id}/school-schedule`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      console.log("Schedule response:", res.data);
      setSchedule(res.data || []);
    } catch (err) {
      handleAxiosError(err);
    } finally {
      setLoading(false);
    }
  };

  const handleCheckIn = async (matchId) => {
    setCheckInLoading(matchId);
    try {
      const res = await axios.post(
        `${baseUrl}/tournaments/matches/${matchId}/check-in`,
        {},
        { headers: { Authorization: `Bearer ${token}` } }
      );
      console.log("Check-in response:", res.data);
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

  useEffect(() => {
    fetchTournaments();
  }, []);

  return (
    <div className=" bg-white px-6 py-10">
      <ToastContainer />
      <motion.h1
        variants={fadeUp}
        initial="hidden"
        animate="show"
        className="text-[18px] sm:text-2xl font-bold text-center mb-1"
      >
        Tournament Bracket
      </motion.h1>

      <p className="text-center mb-6 text-[16px]">Follow the incredible journey of young innovators on their path to the championship</p>

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
                {match.time !== "TBA" ? new Date(match.time).toLocaleString() : "TBA"}
              </p>
              <span
                className={`px-3 py-1 rounded-full text-xs font-semibold ${
                  match.status === "live"
                    ? "bg-[#001489] text-white animate-pulse"
                    : match.status === "pending"
                    ? "bg-gray-200 text-gray-700"
                    : "bg-gray-200 text-black"
                }`}
              >
                {match.status}
              </span>
            </div>

            

            {/* Teams */}
            {[match.school1, match.school2].map((school, idx) => (
              <div
                key={idx}
                className="flex justify-between items-center bg-[#F5F7FB] rounded-md p-3 mb-2"
              >
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
                <span className="font-bold text-black">
                  {idx === 0 ? match.school1Score : match.school2Score || 0}
                </span>
              </div>
            ))}

            {/* Check-in Button */}
            {match.status === "pending" && (
              <button
                onClick={() => handleCheckIn(match.id)}
                disabled={checkInLoading === match.id}
                className="w-full mt-3 bg-[#001489] text-white py-2 rounded-lg hover:bg-[#001489] disabled:opacity-50"
              >
                {checkInLoading === match.id ? "Checking in..." : "Check In"}
              </button>
            )}
          </motion.div>
        ))}
      </div>
    </div>
  );
};

export default Bracket;
