import React, { useState, useEffect } from "react";
import axios from "axios";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

const baseUrl = "https://bql-production.up.railway.app";

const TournamentAdmin = () => {
  const [token, setToken] = useState(localStorage.getItem("adminToken"));

  // States
  const [tournamentName, setTournamentName] = useState("");
  const [year, setYear] = useState(new Date().getFullYear());
  const [categories, setCategories] = useState([]);
  const [difficulties, setDifficulties] = useState([]);
  const [questionLimit, setQuestionLimit] = useState(10);
  const [tournamentMatchId, setTournamentMatchId] = useState("");
  const [sessions, setSessions] = useState([]);
  const [tournaments, setTournaments] = useState([]);
  const [eligibleSchools, setEligibleSchools] = useState([]);
  const [selectedTournamentId, setSelectedTournamentId] = useState("");
  const [bracket, setBracket] = useState([]);
  const [checkInStatus, setCheckInStatus] = useState({});
  const [availableSchools, setAvailableSchools] = useState([]);
  const [replaceOldSchool, setReplaceOldSchool] = useState("");
  const [replaceNewSchool, setReplaceNewSchool] = useState("");

  // ------------------- Helper -------------------
  const authHeaders = () => {
    if (!token) {
      toast.error("Admin token missing. Please log in.");
      return null;
    }
    return {
      Authorization: `Bearer ${token}`,
      "Content-Type": "application/json",
    };
  };

  const handleError = (err, defaultMsg) => {
    console.error(err.response?.data || err.message);
    toast.error(err.response?.data?.message || defaultMsg);
  };

  // ------------------- API Calls -------------------
  const fetchTournaments = async () => {
    const headers = authHeaders();
    if (!headers) return;

    try {
      const response = await axios.get(`${baseUrl}/tournaments`, { headers });
      setTournaments(response.data);
    } catch (err) {
      handleError(err, "Failed to fetch tournaments");
    }
  };

  const fetchEligibleSchools = async () => {
    const headers = authHeaders();
    if (!headers) return;

    try {
      const response = await axios.get(`${baseUrl}/tournaments/eligible-schools`, { headers });
      setEligibleSchools(response.data);
    } catch (err) {
      handleError(err, "Failed to fetch eligible schools");
    }
  };

  const fetchAvailableSchools = async (tournamentId) => {
    const headers = authHeaders();
    if (!headers) return;

    try {
      const response = await axios.get(`${baseUrl}/tournaments/${tournamentId}/available-schools`, { headers });
      setAvailableSchools(response.data);
    } catch (err) {
      handleError(err, "Failed to fetch available schools");
    }
  };

  const fetchBracket = async (tournamentId) => {
    const headers = authHeaders();
    if (!headers) return;

    try {
      const response = await axios.get(`${baseUrl}/tournaments/${tournamentId}/bracket`, { headers });
      setBracket(response.data.matches || []);
    } catch (err) {
      handleError(err, "Failed to fetch tournament bracket");
    }
  };

  const createTournament = async () => {
    if (!tournamentName) return toast.error("Tournament name required");
    const headers = authHeaders();
    if (!headers) return;

    try {
      const body = {
        name: tournamentName,
        year,
        categories: categories.length ? categories : ["General"],
        difficulties: difficulties.length ? difficulties : ["easy"],
        questionLimit: questionLimit || 10,
      };

      await axios.post(`${baseUrl}/tournaments`, body, { headers });
      toast.success("Tournament created!");
      setTournamentName("");
      setCategories([]);
      setDifficulties([]);
      setQuestionLimit(10);
      fetchTournaments();
    } catch (err) {
      handleError(err, "Failed to create tournament");
    }
  };

  const createQuizSession = async () => {
    if (!tournamentName) return toast.error("Session name required");
    const headers = authHeaders();
    if (!headers) return;

    try {
      const body = {
        name: tournamentName,
        categories: categories.length ? categories : ["General"],
        difficulties: difficulties.length ? difficulties : ["easy"],
        questionLimit: questionLimit || 10,
        tournamentMatchId: tournamentMatchId || undefined,
      };

      const response = await axios.post(`${baseUrl}/quiz/sessions`, body, { headers });
      toast.success("Quiz session created!");
      setSessions((prev) => [...prev, response.data]);
      setTournamentName("");
      setCategories([]);
      setDifficulties([]);
      setQuestionLimit(10);
      setTournamentMatchId("");
    } catch (err) {
      handleError(err, "Failed to create quiz session");
    }
  };

  const startQuizSession = async (sessionId) => {
    const headers = authHeaders();
    if (!headers) return;

    try {
      await axios.post(`${baseUrl}/quiz/sessions/${sessionId}/start`, {}, { headers });
      toast.success("Quiz session started!");
    } catch (err) {
      handleError(err, "Failed to start quiz session");
    }
  };

  const checkInTeam = async (matchId) => {
    const headers = authHeaders();
    if (!headers) return;

    try {
      await axios.post(`${baseUrl}/tournaments/matches/${matchId}/check-in`, {}, { headers });
      toast.success("Team checked in!");
      setCheckInStatus((prev) => ({ ...prev, [matchId]: true }));
    } catch (err) {
      handleError(err, "Failed to check in team");
    }
  };

  const replaceSchool = async () => {
    if (!selectedTournamentId || !replaceOldSchool || !replaceNewSchool) return toast.error("Select all fields");
    const headers = authHeaders();
    if (!headers) return;

    try {
      await axios.patch(
        `${baseUrl}/tournaments/${selectedTournamentId}/replace-school`,
        { oldSchoolId: replaceOldSchool, newSchoolId: replaceNewSchool },
        { headers }
      );
      toast.success("School replaced!");
      setReplaceOldSchool("");
      setReplaceNewSchool("");
      fetchBracket(selectedTournamentId);
      fetchAvailableSchools(selectedTournamentId);
    } catch (err) {
      handleError(err, "Failed to replace school");
    }
  };

  // ------------------- Effects -------------------
  useEffect(() => {
    fetchTournaments();
    fetchEligibleSchools();
  }, []);

  useEffect(() => {
    if (selectedTournamentId) {
      fetchBracket(selectedTournamentId);
      fetchAvailableSchools(selectedTournamentId);
    }
  }, [selectedTournamentId]);

  // ------------------- Render -------------------
  return (
    <div className="p-2 md:p-6 text-sm md:text-base">
      <ToastContainer />

      {/* Create Tournament */}
      <div className="bg-white p-3 rounded shadow mb-4">
        <h2 className="font-semibold text-lg md:text-xl">Create Tournament</h2>
        <div className="flex flex-col sm:flex-row gap-2 mt-2">
          <input
            type="text"
            placeholder="Tournament Name"
            value={tournamentName}
            onChange={(e) => setTournamentName(e.target.value)}
            className="border border-gray-300 p-2 rounded flex-1 focus:outline-none focus:ring-1 focus:ring-blue-400"
          />
          <input
            type="number"
            placeholder="Year"
            value={year}
            onChange={(e) => setYear(Number(e.target.value))}
            className="border border-gray-300 p-2 rounded w-full sm:w-32 focus:outline-none focus:ring-1 focus:ring-blue-400"
          />
          <button onClick={createTournament} className="bg-[#001489] text-white px-4 py-2 rounded hover:bg-[#001489]">
            Create
          </button>
        </div>
      </div>

      {/* All Tournaments */}
      <div className="bg-white p-3 rounded shadow mb-4">
        <h2 className="font-semibold text-lg md:text-xl">All Tournaments</h2>
        {tournaments.length === 0 ? (
          <p>No tournaments yet.</p>
        ) : (
          <ul className="space-y-1 mt-2">
            {tournaments.map((t) => (
              <li key={t.id} className="flex justify-between items-center border border-gray-200 p-2 rounded">
                <span>{t.name} ({t.year})</span>
                <button
                  className="text-blue-600 hover:underline"
                  onClick={() => setSelectedTournamentId(t.id)}
                >
                  View Bracket
                </button>
              </li>
            ))}
          </ul>
        )}
      </div>

      {/* Tournament Bracket */}
      {selectedTournamentId && (
        <div className="bg-white p-3 rounded shadow mb-4">
          <h2 className="font-semibold text-lg md:text-xl">Tournament Bracket</h2>
          {bracket.length === 0 ? (
            <p>No matches found.</p>
          ) : (
            <ul className="space-y-2 mt-2">
              {bracket.map((match) => (
                <li key={match.id} className="border border-gray-200 p-2 rounded flex justify-between items-center">
                  <span>{match.teamA?.name || "TBD"} vs {match.teamB?.name || "TBD"}</span>
                  <button
                    className={`px-2 py-1 rounded ${checkInStatus[match.id] ? "bg-gray-400 cursor-not-allowed" : "bg-blue-600 text-white hover:bg-blue-700"}`}
                    onClick={() => checkInTeam(match.id)}
                    disabled={checkInStatus[match.id]}
                  >
                    {checkInStatus[match.id] ? "Checked In" : "Check In"}
                  </button>
                </li>
              ))}
            </ul>
          )}

          {/* Replace School */}
          <div className="mt-4 border-t border-gray-200 pt-4">
            <h3 className="font-semibold">Replace School</h3>
            <div className="flex flex-col sm:flex-row gap-2 mt-2">
              <select
                value={replaceOldSchool}
                onChange={(e) => setReplaceOldSchool(e.target.value)}
                className="border border-gray-300 p-2 rounded flex-1 focus:outline-none focus:ring-1 focus:ring-blue-400"
              >
                <option value="">Select Old School</option>
                {bracket.map((m) => (
                  [m.teamA, m.teamB].map((team) => 
                    team && <option key={team.id} value={team.id}>{team.name}</option>
                  )
                ))}
              </select>
              <select
                value={replaceNewSchool}
                onChange={(e) => setReplaceNewSchool(e.target.value)}
                className="border border-gray-300 p-2 rounded flex-1 focus:outline-none focus:ring-1 focus:ring-blue-400"
              >
                <option value="">Select New School</option>
                {availableSchools.map((school) => (
                  <option key={school.id} value={school.id}>{school.name}</option>
                ))}
              </select>
              <button onClick={replaceSchool} className="bg-green-600 text-white px-4 py-2 rounded hover:bg-green-700">
                Replace
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Quiz Sessions */}
      <div className="bg-white p-3 rounded shadow mb-4">
        <h2 className="font-semibold text-lg md:text-xl">Quiz Sessions</h2>
        <div className="flex flex-col gap-2 mt-2">
          <input
            type="text"
            placeholder="Session Name"
            value={tournamentName}
            onChange={(e) => setTournamentName(e.target.value)}
            className="border border-gray-300 p-2 rounded w-full focus:outline-none focus:ring-1 focus:ring-blue-400"
          />
          <input
            type="text"
            placeholder="Categories (comma separated)"
            value={categories.join(",")}
            onChange={(e) => setCategories(e.target.value.split(",").map(c => c.trim()))}
            className="border border-gray-300 p-2 rounded w-full focus:outline-none focus:ring-1 focus:ring-blue-400"
          />
          <input
            type="text"
            placeholder="Difficulties (comma separated)"
            value={difficulties.join(",")}
            onChange={(e) => setDifficulties(e.target.value.split(",").map(d => d.trim()))}
            className="border border-gray-300 p-2 rounded w-full focus:outline-none focus:ring-1 focus:ring-blue-400"
          />
          <input
            type="number"
            placeholder="Question Limit"
            value={questionLimit}
            onChange={(e) => setQuestionLimit(Number(e.target.value))}
            className="border border-gray-300 p-2 rounded w-full focus:outline-none focus:ring-1 focus:ring-blue-400"
          />
          <input
            type="text"
            placeholder="Tournament Match ID (optional)"
            value={tournamentMatchId}
            onChange={(e) => setTournamentMatchId(e.target.value)}
            className="border border-gray-300 p-2 rounded w-full focus:outline-none focus:ring-1 focus:ring-blue-400"
          />
          <button onClick={createQuizSession} className="bg-[#001489] text-white px-4 py-2 rounded hover:bg-[#001489]">
            Create Session
          </button>
        </div>
      </div>

      {/* Eligible Schools */}
      <div className="bg-white p-3 rounded shadow mb-4">
        <div className="flex items-center justify-between mb-2">
          <h2 className="font-semibold text-lg md:text-xl">Eligible Schools</h2>
          <button
            onClick={fetchEligibleSchools}
            className="bg-[#001489] text-white px-3 py-1 rounded hover:bg-[#001489]"
          >
            Check Eligibility
          </button>
        </div>
        {eligibleSchools.length === 0 ? (
          <p>No eligible schools found.</p>
        ) : (
          <ul className="list-disc pl-5">
            {eligibleSchools.map((school) => (
              <li key={school.id}>{school.name}</li>
            ))}
          </ul>
        )}
      </div>
    </div>
  );
};

export default TournamentAdmin;
