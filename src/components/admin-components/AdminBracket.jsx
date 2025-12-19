
import React, { useState, useEffect } from "react";
import axios from "axios";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

const baseUrl = "https://bql-production.up.railway.app";

const AdminPanelTabs = () => {
  const [token] = useState(localStorage.getItem("adminToken"));

  // Tabs state
  const [activeTab, setActiveTab] = useState("dashboard");

  // Data states
  const [tournaments, setTournaments] = useState([]);
  const [eligibleSchools, setEligibleSchools] = useState([]);
  const [eligibleTournaments, setEligibleTournaments] = useState([]);
  const [selectedTournament, setSelectedTournament] = useState(null);
  const [bracket, setBracket] = useState([]);
  const [availableSchools, setAvailableSchools] = useState([]);
  const [checkInStatus, setCheckInStatus] = useState({});
  const [quizSessions, setQuizSessions] = useState([]);

  // Form states
  const [tournamentName, setTournamentName] = useState("");
  const [tournamentYear, setTournamentYear] = useState(new Date().getFullYear());
  const [sessionName, setSessionName] = useState("");
  const [categories, setCategories] = useState([]);
  const [difficulties, setDifficulties] = useState([]);
  const [questionLimit, setQuestionLimit] = useState(10);
  const [replaceOldSchool, setReplaceOldSchool] = useState("");
  const [replaceNewSchool, setReplaceNewSchool] = useState("");

  // Loading states
  const [loadingTournaments, setLoadingTournaments] = useState(false);
  const [loadingSchools, setLoadingSchools] = useState(false);
  const [loadingBracket, setLoadingBracket] = useState(false);
  const [loadingEligibility, setLoadingEligibility] = useState(false);

  const authHeaders = () => ({
    Authorization: `Bearer ${token}`,
    "Content-Type": "application/json",
  });

  const handleError = (err, defaultMsg) => {
    console.error(err.response?.data || err.message);
    toast.error(err.response?.data?.message || defaultMsg);
  };

  // ------------------- API Calls -------------------
  const fetchTournaments = async () => {
    setLoadingTournaments(true);
    try {
      const res = await axios.get(`${baseUrl}/tournaments`, { headers: authHeaders() });
      setTournaments(res.data);
    } catch (err) {
      handleError(err, "Failed to fetch tournaments");
    } finally {
      setLoadingTournaments(false);
    }
  };

  const fetchEligibleSchools = async () => {
    setLoadingSchools(true);
    try {
      const res = await axios.get(`${baseUrl}/tournaments/eligible-schools`, { headers: authHeaders() });
      setEligibleSchools(res.data);
    } catch (err) {
      handleError(err, "Failed to fetch eligible schools");
    } finally {
      setLoadingSchools(false);
    }
  };

  const fetchEligibleTournaments = async () => {
    setLoadingEligibility(true);
    try {
      const res = await axios.get(`${baseUrl}/tournaments/check-eligibility`, { headers: authHeaders() });
      setEligibleTournaments(res.data);
    } catch (err) {
      handleError(err, "Failed to fetch eligible tournaments");
    } finally {
      setLoadingEligibility(false);
    }
  };

  const fetchBracket = async (tournamentId) => {
    setLoadingBracket(true);
    try {
      const res = await axios.get(`${baseUrl}/tournaments/${tournamentId}/bracket`, { headers: authHeaders() });
      console.log("Raw bracket data:", res.data);

      // Sort rounds by roundNumber
      const roundsSorted = res.data.sort((a, b) => a.roundNumber - b.roundNumber);

      // Flatten matches and sort by matchNumber within each round
      const allMatches = roundsSorted
        .map((round) =>
          round.matches
            .sort((a, b) => a.matchNumber - b.matchNumber)
            .map((m) => ({
              ...m,
              roundName: round.roundName,
              roundNumber: round.roundNumber,
            }))
        )
        .flat();

      setBracket(allMatches);
    } catch (err) {
      handleError(err, "Failed to fetch bracket");
    } finally {
      setLoadingBracket(false);
    }
  };

  const fetchAvailableSchools = async (tournamentId) => {
    try {
      const res = await axios.get(`${baseUrl}/tournaments/${tournamentId}/available-schools`, { headers: authHeaders() });
      setAvailableSchools(res.data);
    } catch (err) {
      handleError(err, "Failed to fetch available schools");
    }
  };

  const createTournament = async () => {
    if (!tournamentName) return toast.error("Tournament name required");
    try {
      await axios.post(
        `${baseUrl}/tournaments`,
        { name: tournamentName, year: tournamentYear },
        { headers: authHeaders() }
      );
      toast.success("Tournament created!");
      setTournamentName("");
      fetchTournaments();
    } catch (err) {
      handleError(err, "Failed to create tournament");
    }
  };

  const createQuizSession = async () => {
    if (!sessionName) return toast.error("Session name required");
    try {
      const body = { name: sessionName, categories, difficulties, questionLimit };
      await axios.post(`${baseUrl}/quiz/sessions`, body, { headers: authHeaders() });
      toast.success("Quiz session created!");
      setSessionName("");
      setCategories([]);
      setDifficulties([]);
      setQuestionLimit(10);
    } catch (err) {
      handleError(err, "Failed to create quiz session");
    }
  };

  const checkInTeam = async (matchId) => {
    try {
      await axios.post(`${baseUrl}/tournaments/matches/${matchId}/check-in`, {}, { headers: authHeaders() });
      setCheckInStatus((prev) => ({ ...prev, [matchId]: true }));
      toast.success("Team checked in!");
    } catch (err) {
      handleError(err, "Failed to check-in team");
    }
  };

  const replaceSchool = async () => {
    if (!selectedTournament || !replaceOldSchool || !replaceNewSchool) return toast.error("Select all fields");
    try {
      await axios.patch(
        `${baseUrl}/tournaments/${selectedTournament}/replace-school`,
        { oldSchoolId: replaceOldSchool, newSchoolId: replaceNewSchool },
        { headers: authHeaders() }
      );
      toast.success("School replaced!");
      setReplaceOldSchool("");
      setReplaceNewSchool("");
      fetchBracket(selectedTournament);
      fetchAvailableSchools(selectedTournament);
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
    if (selectedTournament) {
      fetchBracket(selectedTournament);
      fetchAvailableSchools(selectedTournament);
    }
  }, [selectedTournament]);

  // ------------------- Render -------------------
  return (
    <div className="p-4 min-h-screen bg-gray-100">
      <ToastContainer />

      {/* Tabs */}
      <div className="flex flex-wrap border-b mb-4">
        {["Dashboard", "Tournaments", "Quiz Sessions", "Eligible Schools", "Eligible Tournaments"].map((tab) => (
          <button
            key={tab}
            onClick={() => setActiveTab(tab.toLowerCase().replace(" ", "-"))}
            className={`px-4 py-2 -mb-px font-semibold border-b-2 ${
              activeTab === tab.toLowerCase().replace(" ", "-")
                ? "border-blue-600 text-blue-600"
                : "border-transparent hover:text-blue-500"
            }`}
          >
            {tab}
          </button>
        ))}
      </div>

      {/* Dashboard */}
      {activeTab === "dashboard" && (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4 mb-6">
          <div className="bg-white shadow p-4 rounded text-center sm:text-left">
            <h3 className="text-gray-500">Total Tournaments</h3>
            <p className="text-2xl font-bold">{tournaments.length}</p>
          </div>
          <div className="bg-white shadow p-4 rounded text-center sm:text-left">
            <h3 className="text-gray-500">Eligible Schools</h3>
            <p className="text-2xl font-bold">{eligibleSchools.length}</p>
          </div>
          <div className="bg-white shadow p-4 rounded text-center sm:text-left">
            <h3 className="text-gray-500">Selected Tournament</h3>
            <p className="text-2xl font-bold">{selectedTournament || "None"}</p>
          </div>
        </div>
      )}

      {/* Tournaments */}
      {activeTab === "tournaments" && (
        <div>
          <h2 className="text-xl font-bold mb-4">Tournaments</h2>
          <div className="bg-white p-4 rounded shadow mb-4 flex flex-col sm:flex-row gap-2 overflow-x-auto">
            <input
              type="text"
              placeholder="Tournament Name"
              value={tournamentName}
              onChange={(e) => setTournamentName(e.target.value)}
              className="border p-2 rounded flex-1 min-w-[120px]"
            />
            <input
              type="number"
              placeholder="Year"
              value={tournamentYear}
              onChange={(e) => setTournamentYear(Number(e.target.value))}
              className="border p-2 rounded w-full sm:w-32"
            />
            <button onClick={createTournament} className="bg-blue-600 text-white px-4 py-2 rounded">
              Create
            </button>
          </div>
          <div className="overflow-x-auto bg-white rounded shadow">
            <table className="w-full table-auto min-w-[400px]">
              <thead className="bg-gray-200">
                <tr>
                  <th className="px-4 py-2 text-left">Name</th>
                  <th className="px-4 py-2 text-left">Year</th>
                  <th className="px-4 py-2 text-left">Actions</th>
                </tr>
              </thead>
              <tbody>
                {tournaments.map((t) => (
                  <tr key={t.id}>
                    <td className="px-4 py-2">{t.name}</td>
                    <td className="px-4 py-2">{t.year}</td>
                    <td className="px-4 py-2">
                      <button
                        onClick={() => setSelectedTournament(t.id)}
                        disabled={loadingBracket && selectedTournament === t.id}
                        className="text-blue-600 hover:underline disabled:text-gray-400"
                      >
                        {loadingBracket && selectedTournament === t.id
                          ? "Loading..."
                          : "View Bracket"}
                      </button>

                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Quiz Sessions */}
      {activeTab === "quiz-sessions" && (
        <div>
          <h2 className="text-xl font-bold mb-4">Quiz Sessions</h2>
          <div className="bg-white p-4 rounded shadow flex flex-col sm:flex-row gap-2 mb-4 overflow-x-auto">
            <input
              type="text"
              placeholder="Session Name"
              value={sessionName}
              onChange={(e) => setSessionName(e.target.value)}
              className="border p-2 rounded flex-1 min-w-[120px]"
            />
            <input
              type="text"
              placeholder="Categories"
              value={categories.join(",")}
              onChange={(e) => setCategories(e.target.value.split(",").map((c) => c.trim()))}
              className="border p-2 rounded flex-1 min-w-[120px]"
            />
            <input
              type="text"
              placeholder="Difficulties"
              value={difficulties.join(",")}
              onChange={(e) => setDifficulties(e.target.value.split(",").map((c) => c.trim()))}
              className="border p-2 rounded flex-1 min-w-[120px]"
            />
            <input
              type="number"
              placeholder="Question Limit"
              value={questionLimit}
              onChange={(e) => setQuestionLimit(Number(e.target.value))}
              className="border p-2 rounded w-full sm:w-32"
            />
            <button onClick={createQuizSession} className="bg-blue-600 text-white px-4 py-2 rounded">
              Create
            </button>
          </div>
        </div>
      )}

      {/* Eligible Schools */}
      {activeTab === "eligible-schools" && (
        <div>
          <h2 className="text-xl font-bold mb-4">Eligible Schools</h2>
          <button onClick={fetchEligibleSchools} className="mb-2 bg-blue-600 text-white px-3 py-1 rounded">
            Refresh
          </button>
          <div className="overflow-x-auto bg-white rounded shadow">
            <table className="w-full table-auto min-w-[300px]">
              <thead className="bg-gray-200">
                <tr>
                  <th className="px-4 py-2 text-left">School Name</th>
                </tr>
              </thead>
              <tbody>
                {eligibleSchools.map((s) => (
                  <tr key={s.id}>
                    <td className="px-4 py-2">{s.name}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Eligible Tournaments */}
      {activeTab === "eligible-tournaments" && (
        <div>
          <h2 className="text-xl font-bold mb-4">Eligible Tournaments</h2>
          <button onClick={fetchEligibleTournaments} className="mb-2 bg-blue-600 text-white px-3 py-1 rounded">
            Refresh
          </button>
          <div className="overflow-x-auto bg-white rounded shadow">
            <table className="w-full table-auto min-w-[400px]">
              <thead className="bg-gray-200">
                <tr>
                  <th className="px-4 py-2 text-left">Tournament Name</th>
                  <th className="px-4 py-2 text-left">Year</th>
                  <th className="px-4 py-2 text-left">Eligible</th>
                </tr>
              </thead>
              <tbody>
                {eligibleTournaments.map((t) => (
                  <tr key={t.id}>
                    <td className="px-4 py-2">{t.name}</td>
                    <td className="px-4 py-2">{t.year}</td>
                    <td className="px-4 py-2">{t.isEligible ? "✅ Yes" : "❌ No"}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Tournament Bracket */}
      {activeTab === "tournaments" && selectedTournament && (
        <div className="mt-6">
          <h3 className="text-lg font-bold mb-2">Tournament Bracket</h3>
          <div className="overflow-x-auto bg-white rounded shadow">
            <table className="w-full table-auto min-w-[400px]">
              <thead className="bg-gray-200">
                <tr>
                  <th className="px-4 py-2 text-left">Match</th>
                  <th className="px-4 py-2 text-left">Round</th>
                  <th className="px-4 py-2 text-left">Status</th>
                </tr>
              </thead>
              <tbody>
                {bracket.map((match, idx) => (
                  <tr
                    key={
                      match.id ||
                      `${match.school1Id}-${match.school2Id}-${match.roundNumber}-${idx}`
                    }
                  >
                    <td className="px-4 py-2">
                      {match.school1?.name || "TBD"} vs {match.school2?.name || "TBD"}
                    </td>
                   <td className="px-4 py-2">
                    {match.roundName}
                  </td>
                  <td className="px-4 py-2 capitalize">
                    <span
                      className={`px-2 py-1 rounded text-sm font-medium ${
                        match.status === "completed"
                          ? "bg-green-100 text-green-700"
                          : match.status === "ongoing"
                          ? "bg-yellow-100 text-yellow-700"
                          : "bg-gray-100 text-gray-600"
                      }`}
                    >
                      {match.status}
                    </span>
                  </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* Replace School */}
          <div className="mt-4 bg-white p-4 rounded shadow flex flex-col sm:flex-row gap-2">
            <select
              value={replaceOldSchool}
              onChange={(e) => setReplaceOldSchool(e.target.value)}
              className="border p-2 rounded flex-1"
            >
              <option value="">Select Old School</option>
              {bracket
                .filter((m) => m.school1)
                .map((match) => (
                  <option key={match.school1Id} value={match.school1Id}>
                    {match.school1.name}
                  </option>
                ))}
            </select>
            <select
              value={replaceNewSchool}
              onChange={(e) => setReplaceNewSchool(e.target.value)}
              className="border p-2 rounded flex-1"
            >
              <option value="">Select New School</option>
              {availableSchools.map((s) => (
                <option key={s.id} value={s.id}>
                  {s.name}
                </option>
              ))}
            </select>
            <button
              onClick={replaceSchool}
              className="bg-blue-600 text-white px-4 py-2 rounded"
            >
              Replace
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default AdminPanelTabs;
