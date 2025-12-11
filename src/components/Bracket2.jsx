import React, { useEffect, useState, useRef } from "react";
import axios from "axios";
import { io } from "socket.io-client";




const Bracket = ({ baseUrl = "https://api.example.com", token = "" }) => {
  // auth
  const [authToken, setAuthToken] = useState(token);

  // UI state
  const [loading, setLoading] = useState(false);
  const [eligibility, setEligibility] = useState(null); // { eligible: bool, reason? }
  const [tournaments, setTournaments] = useState([]);
  const [selectedTournament, setSelectedTournament] = useState(null);
  const [bracket, setBracket] = useState(null); // structured bracket data
  const [matchCheckinLoading, setMatchCheckinLoading] = useState(false);

  // Create tournament modal form
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [newTournamentName, setNewTournamentName] = useState("");
  const [newTournamentYear, setNewTournamentYear] = useState(new Date().getFullYear());

  // Create session modal
  const [showSessionModal, setShowSessionModal] = useState(false);
  const [sessionMatchId, setSessionMatchId] = useState("");
  const [sessionName, setSessionName] = useState("");
  const [sessionCategories, setSessionCategories] = useState("STEM");
  const [sessionDifficulties, setSessionDifficulties] = useState("easy,medium");
  const [sessionQuestionLimit, setSessionQuestionLimit] = useState(10);

  // Socket
  const socketRef = useRef(null);

  // small toast-like messages
  const [notice, setNotice] = useState(null);

  // convenience axios instance
  const api = axios.create({
    baseURL: baseUrl,
    headers: {
      Authorization: authToken ? `Bearer ${authToken}` : "",
      "Content-Type": "application/json",
    },
  });

  useEffect(() => {
    if (authToken) {
      api.defaults.headers.Authorization = `Bearer ${authToken}`;
    }
  }, [authToken]);

  // load tournaments list on mount
  useEffect(() => {
    fetchTournaments();
    // cleanup socket on unmount
    return () => {
      if (socketRef.current) socketRef.current.disconnect();
    };
    // eslint-disable-next-line
  }, []);

  // connect socket when a tournament is selected
  useEffect(() => {
    if (selectedTournament && authToken) {
      connectSocket(selectedTournament.id);
    }
    // eslint-disable-next-line
  }, [selectedTournament, authToken]);

  // ---------- API calls ----------

  async function fetchTournaments() {
    try {
      setLoading(true);
      const res = await api.get("/tournaments");
      setTournaments(res.data || []);
    } catch (err) {
      console.error("fetchTournaments", err);
      setNotice("Failed to load tournaments");
    } finally {
      setLoading(false);
    }
  }

  async function checkEligibility() {
    try {
      setLoading(true);
      const res = await api.get("/tournaments/check-eligibility");
      setEligibility(res.data || { eligible: false });
      setNotice("Eligibility checked");
    } catch (err) {
      console.error("checkEligibility", err);
      setNotice("Eligibility check failed");
    } finally {
      setLoading(false);
    }
  }

  async function createTournament() {
    if (!newTournamentName) return setNotice("Give the tournament a name");
    try {
      setLoading(true);
      const res = await api.post("/tournaments", {
        name: newTournamentName,
        year: newTournamentYear,
      });
      setShowCreateModal(false);
      setNewTournamentName("");
      setNewTournamentYear(new Date().getFullYear());
      setNotice("Tournament created");
      fetchTournaments();
      // auto-select created tournament if returned
      if (res.data && res.data.id) {
        setSelectedTournament(res.data);
        fetchBracket(res.data.id);
      }
    } catch (err) {
      console.error("createTournament", err);
      setNotice("Failed to create tournament");
    } finally {
      setLoading(false);
    }
  }

  async function fetchBracket(tournamentId) {
    if (!tournamentId) return;
    try {
      setLoading(true);
      const res = await api.get(`/tournaments/${tournamentId}/bracket`);
      // res.data should contain bracket structure: rounds -> matches -> teams, winner etc.
      setBracket(res.data);
      setNotice("Bracket loaded");
    } catch (err) {
      console.error("fetchBracket", err);
      setNotice("Failed to load bracket");
    } finally {
      setLoading(false);
    }
  }

  async function checkInMatch(matchId) {
    if (!matchId) return setNotice("Provide match id to check-in");
    try {
      setMatchCheckinLoading(true);
      await api.post(`/tournaments/matches/${matchId}/check-in`);
      setNotice("Checked in successfully");
      // refresh bracket
      if (selectedTournament) fetchBracket(selectedTournament.id);
    } catch (err) {
      console.error("checkInMatch", err);
      setNotice("Check-in failed");
    } finally {
      setMatchCheckinLoading(false);
    }
  }

  async function createQuizSession() {
    // requires tournamentMatchId optionally
    if (!sessionName) return setNotice("Provide session name");
    try {
      setLoading(true);
      const categoriesArray = sessionCategories.split(",").map(s => s.trim()).filter(Boolean);
      const diffsArray = sessionDifficulties.split(",").map(s => s.trim()).filter(Boolean);
      const body = {
        name: sessionName,
        categories: categoriesArray,
        difficulties: diffsArray,
        questionLimit: sessionQuestionLimit,
        tournamentMatchId: sessionMatchId || null,
      };
      const res = await api.post("/quiz/sessions", body);
      setShowSessionModal(false);
      setSessionMatchId("");
      setSessionName("");
      setNotice("Quiz session created");
      // optionally navigate or store session id
      if (res.data && res.data.id) {
        setNotice(`Session created: ${res.data.id}`);
      }
    } catch (err) {
      console.error("createQuizSession", err);
      setNotice("Create session failed");
    } finally {
      setLoading(false);
    }
  }

  async function startSession(sessionId) {
    if (!sessionId) return setNotice("Provide session id");
    try {
      setLoading(true);
      await api.post(`/quiz/sessions/${sessionId}/start`);
      setNotice("Session started");
    } catch (err) {
      console.error("startSession", err);
      setNotice("Failed to start session");
    } finally {
      setLoading(false);
    }
  }

  // ---------- WebSocket (socket.io) ----------

  function connectSocket(tournamentId) {
    // disconnect existing
    if (socketRef.current) {
      socketRef.current.disconnect();
      socketRef.current = null;
    }

    // create socket; server expected to have namespace or route for tournaments; adjust path/auth as needed
    const socket = io(baseUrl, {
      path: "/socket.io",
      auth: { token: authToken },
      query: { tournamentId },
      transports: ["websocket"],
    });

    socketRef.current = socket;

    socket.on("connect", () => {
      console.log("socket connected", socket.id);
      setNotice("Connected to tournament updates");
    });

    // listen for bracket updates
    socket.on("bracket_update", data => {
      console.log("bracket_update", data);
      // Ideally server sends latest bracket — replace local bracket with server payload
      if (data && data.tournamentId === tournamentId) {
        setBracket(data.bracket || data);
        setNotice("Bracket updated");
      }
    });

    socket.on("match_updated", data => {
      console.log("match_updated", data);
      // refresh bracket or update match in local state
      if (data && data.tournamentId === tournamentId) {
        // simple strategy: re-fetch bracket
        fetchBracket(tournamentId);
      }
    });

    socket.on("disconnect", reason => {
      console.log("socket disconnect", reason);
      setNotice("Disconnected from updates");
    });

    socket.on("connect_error", err => {
      console.error("socket connect_error", err);
      setNotice("Real-time connection failed");
    });
  }

  // ---------- small helpers for UI ----------

  // Render a friendly bracket UI from `bracket` object. This is flexible — replace with SVG if you need lines.
  function renderBracket(bracketData) {
    if (!bracketData || !bracketData.rounds) return <div className="text-sm text-gray-500">No bracket yet</div>;

    // rounds is expected: [{ name: "Quarterfinals", matches: [{ id, teams: [{ id, name }], winnerId, status }] }, ...]
    return (
      <div className="overflow-x-auto py-4">
        <div className="flex gap-6">
          {bracketData.rounds.map((round, ri) => (
            <div key={ri} className="min-w-[220px]">
              <div className="text-sm font-semibold mb-3">{round.name}</div>
              <div className="space-y-3">
                {round.matches.map((m, mi) => (
                  <div key={m.id} className="bg-white p-3 rounded-lg shadow-sm border">
                    <div className="flex justify-between items-center mb-2">
                      <div className="text-xs text-gray-400">Match #{mi + 1}</div>
                      <div className="text-xs badge badge-ghost">{m.status || "scheduled"}</div>
                    </div>

                    <div className="space-y-2">
                      {(m.teams || []).map((t, idx) => (
                        <div key={t?.id || idx} className={`p-2 rounded flex justify-between items-center ${m.winnerId === t?.id ? "bg-green-50 border-l-4 border-l-green-400" : ""}`}>
                          <div className="flex items-center gap-3">
                            <div className="w-8 h-8 rounded-full bg-indigo-100 flex items-center justify-center text-indigo-600 text-sm">{(t?.name || "TBD").slice(0,1)}</div>
                            <div className="text-sm font-medium">{t?.name || "TBD"}</div>
                          </div>

                          <div className="flex items-center gap-2">
                            {/* check-in only actionable for teams that are not yet checked-in */}
                            <button
                              className="btn btn-xs btn-outline"
                              onClick={() => checkInMatch(m.id)}
                              disabled={m.checkedIn && m.checkedIn.includes(t?.id)}
                              title={m.checkedIn && m.checkedIn.includes(t?.id) ? "Already checked in" : "Check-in this team"}
                            >
                              {m.checkedIn && m.checkedIn.includes(t?.id) ? "Checked" : "Check-in"}
                            </button>
                          </div>
                        </div>
                      ))}
                    </div>

                    {/* match actions */}
                    <div className="flex gap-2 mt-3">
                      <button
                        className="btn btn-sm btn-success"
                        onClick={() => {
                          setShowSessionModal(true);
                          setSessionMatchId(m.id);
                        }}
                      >
                        Create Session
                      </button>
                      <button
                        className="btn btn-sm btn-primary"
                        onClick={() => {
                          // optional quick-create session and start
                          quickCreateAndStart(m.id);
                        }}
                      >
                        Quick Start
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>
      </div>
    );
  }

  // quick create session + start (for host flows)
  async function quickCreateAndStart(matchId) {
    try {
      setLoading(true);
      const createRes = await api.post("/quiz/sessions", {
        name: `Match ${matchId} quick session`,
        categories: ["General"],
        difficulties: ["easy"],
        questionLimit: 10,
        tournamentMatchId: matchId,
      });
      const sid = createRes.data?.id;
      if (sid) {
        await api.post(`/quiz/sessions/${sid}/start`);
        setNotice("Quick session started");
      } else {
        setNotice("Session created but id not returned");
      }
    } catch (err) {
      console.error("quickCreateAndStart", err);
      setNotice("Quick start failed");
    } finally {
      setLoading(false);
    }
  }

  // ---------- JSX UI ----------

  return (
    <div className="p-6 max-w-7xl mx-auto font-sans">
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-2xl font-bold">Tournament Manager</h1>
        <div className="flex items-center gap-3">
          <input
            placeholder="Paste Bearer token"
            value={authToken}
            onChange={e => setAuthToken(e.target.value)}
            className="input input-sm input-bordered w-80"
          />
          <button onClick={fetchTournaments} className="btn btn-sm">Refresh</button>
        </div>
      </div>

      {/* Notifier */}
      {notice && (
        <div className="mb-4">
          <div className="alert alert-info shadow-sm">
            <div>{notice}</div>
            <div className="ml-auto">
              <button className="btn btn-xs btn-ghost" onClick={() => setNotice(null)}>x</button>
            </div>
          </div>
        </div>
      )}

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left column: actions */}
        <div className="space-y-4">
          <div className="bg-white p-4 rounded-lg shadow-sm">
            <h3 className="font-semibold mb-2">Eligibility</h3>
            <div className="flex gap-2">
              <button className="btn" onClick={checkEligibility}>Check Eligibility</button>
              {eligibility && (
                <div className="ml-2 text-sm">
                  {eligibility.eligible ? <span className="text-green-600 font-medium">Eligible</span> : <span className="text-red-600">Not eligible</span>}
                  {eligibility.reason && <div className="text-xs text-gray-500">{eligibility.reason}</div>}
                </div>
              )}
            </div>
          </div>

          <div className="bg-white p-4 rounded-lg shadow-sm">
            <h3 className="font-semibold mb-2">Create Tournament</h3>
            <div className="space-y-2">
              <input placeholder="Tournament name" className="input input-bordered w-full" value={newTournamentName} onChange={e => setNewTournamentName(e.target.value)} />
              <select className="select select-bordered w-full" value={newTournamentYear} onChange={e => setNewTournamentYear(+e.target.value)}>
                {Array.from({length: 8}).map((_, i) => {
                  const y = new Date().getFullYear() + i;
                  return <option key={y} value={y}>{y}</option>
                })}
              </select>
              <div className="flex gap-2">
                <button className="btn btn-primary" onClick={createTournament}>Create</button>
                <button className="btn btn-ghost" onClick={() => { setNewTournamentName(""); setNewTournamentYear(new Date().getFullYear()); }}>Reset</button>
              </div>
            </div>
          </div>

          <div className="bg-white p-4 rounded-lg shadow-sm">
            <h3 className="font-semibold mb-2">Select Tournament</h3>
            <div className="space-y-2">
              {loading && <div className="text-sm text-gray-500">Loading tournaments...</div>}
              {!loading && tournaments.length === 0 && <div className="text-sm text-gray-500">No tournaments found</div>}
              <div className="space-y-2 max-h-56 overflow-auto">
                {tournaments.map(t => (
                  <div key={t.id} className={`p-2 rounded flex justify-between items-center ${selectedTournament?.id === t.id ? "bg-indigo-50 border-l-4 border-l-indigo-400" : "hover:bg-gray-50"}`}>
                    <div>
                      <div className="font-medium">{t.name}</div>
                      <div className="text-xs text-gray-400">{t.year} • {t.teams ?? "—"} teams</div>
                    </div>
                    <div className="flex gap-2">
                      <button className="btn btn-xs" onClick={() => { setSelectedTournament(t); fetchBracket(t.id); }}>Open</button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>

          <div className="bg-white p-4 rounded-lg shadow-sm">
            <h3 className="font-semibold mb-2">Create / Start Session</h3>
            <div className="space-y-2">
              <input placeholder="Match ID (optional)" className="input input-bordered w-full" value={sessionMatchId} onChange={e => setSessionMatchId(e.target.value)} />
              <input placeholder="Session name" className="input input-bordered w-full" value={sessionName} onChange={e => setSessionName(e.target.value)} />
              <input placeholder="Categories (comma)" className="input input-bordered w-full" value={sessionCategories} onChange={e => setSessionCategories(e.target.value)} />
              <input placeholder="Difficulties (comma)" className="input input-bordered w-full" value={sessionDifficulties} onChange={e => setSessionDifficulties(e.target.value)} />
              <div className="flex gap-2">
                <input type="number" className="input input-bordered w-24" value={sessionQuestionLimit} onChange={e => setSessionQuestionLimit(+e.target.value)} />
                <button className="btn btn-success" onClick={createQuizSession}>Create Session</button>
              </div>
            </div>
          </div>
        </div>

        {/* Middle column: bracket view */}
        <div className="col-span-2">
          <div className="bg-white p-4 rounded-lg shadow-sm mb-4 flex items-start justify-between">
            <div>
              <div className="text-sm text-gray-500">Tournament</div>
              <div className="text-lg font-semibold">{selectedTournament?.name || "Select a tournament"}</div>
              <div className="text-xs text-gray-400">{selectedTournament?.year || ""}</div>
            </div>
            <div className="flex gap-2">
              <button className="btn btn-ghost" onClick={() => selectedTournament && fetchBracket(selectedTournament.id)}>Refresh Bracket</button>
            </div>
          </div>

          <div className="bg-base-100 p-4 rounded-lg shadow-sm">
            {bracket ? renderBracket(bracket) : <div className="text-sm text-gray-500 p-6">Select a tournament and load bracket to view matches & check-in.</div>}
          </div>
        </div>
      </div>

      {/* Session modal (simple inline version) */}
      {showSessionModal && (
        <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50">
          <div className="bg-white p-6 rounded-lg w-full max-w-md shadow-lg">
            <h3 className="font-semibold mb-3">Create Quiz Session</h3>
            <input placeholder="Match ID" className="input input-bordered w-full mb-2" value={sessionMatchId} onChange={e => setSessionMatchId(e.target.value)} />
            <input placeholder="Name" className="input input-bordered w-full mb-2" value={sessionName} onChange={e => setSessionName(e.target.value)} />
            <input placeholder="Categories (comma)" className="input input-bordered w-full mb-2" value={sessionCategories} onChange={e => setSessionCategories(e.target.value)} />
            <input placeholder="Difficulties (comma)" className="input input-bordered w-full mb-2" value={sessionDifficulties} onChange={e => setSessionDifficulties(e.target.value)} />
            <div className="flex items-center gap-2 mt-3">
              <input type="number" className="input input-bordered w-28" value={sessionQuestionLimit} onChange={e => setSessionQuestionLimit(+e.target.value)} />
              <button className="btn btn-primary" onClick={createQuizSession}>Create</button>
              <button className="btn btn-ghost" onClick={() => setShowSessionModal(false)}>Cancel</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Bracket;
