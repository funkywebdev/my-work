



import React, { useEffect, useState } from "react";
import axios from "axios";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

const BASE_URL = "https://bql-production.up.railway.app";
const TOKEN = localStorage.getItem("schoolToken");

const SchoolAssessmentPanel = () => {
  const [availableSessions, setAvailableSessions] = useState([]);
  const [mySessions, setMySessions] = useState([]);
  const [selectedSession, setSelectedSession] = useState(null);
  const [loadingSessionId, setLoadingSessionId] = useState(null);
  const [pageLoading, setPageLoading] = useState(true);

  /* ================= AXIOS ERROR HANDLER ================= */

  const handleAxiosError = (error, customMessage) => {
    console.error(customMessage, error);

    if (!error.response) {
      toast.error("Network error. Please check your internet.");
      return;
    }

    const status = error.response.status;

    if (status === 401) {
      toast.error("Session expired. Please login again.");
    } else if (status === 403) {
      toast.error("You are not allowed to perform this action.");
    } else if (status >= 500) {
      toast.error("Server error. Please try again later.");
    } else {
      toast.error(
        error.response.data?.message || "Something went wrong."
      );
    }
  };

  /* ================= FETCH DATA ================= */

  const fetchAvailableSessions = async () => {
    try {
      const res = await axios.get(
        `${BASE_URL}/quiz/sessions/available`,
        { headers: { Authorization: `Bearer ${TOKEN}` } }
      );
      console.log("AVAILABLE SESSIONS:", res.data);
      return res.data;
    } catch (err) {
      handleAxiosError(err, "FETCH AVAILABLE ERROR:");
      return [];
    }
  };

  const fetchMySessions = async () => {
    try {
      const res = await axios.get(
        `${BASE_URL}/quiz/school/sessions`,
        { headers: { Authorization: `Bearer ${TOKEN}` } }
      );
      console.log("MY SESSIONS:", res.data);
      return res.data;
    } catch (err) {
      handleAxiosError(err, "FETCH MY SESSIONS ERROR:");
      return [];
    }
  };

  useEffect(() => {
    if (!TOKEN) {
      toast.error("No school admin token found. Please login.");
      setPageLoading(false);
      return;
    }

    const loadData = async () => {
      try {
        const [available, mine] = await Promise.all([
          fetchAvailableSessions(),
          fetchMySessions(),
        ]);
        setAvailableSessions(available);
        setMySessions(mine);
      } finally {
        setPageLoading(false);
      }
    };

    loadData();
  }, []);

  /* ================= ACTIONS ================= */

  const joinSession = async (id) => {
    setLoadingSessionId(id);
    try {
      await axios.post(
        `${BASE_URL}/quiz/sessions/${id}/join`,
        {},
        { headers: { Authorization: `Bearer ${TOKEN}` } }
      );

      toast.success("Successfully joined session 🎉");

      const mine = await fetchMySessions();
      setMySessions(mine);
    } catch (err) {
      handleAxiosError(err, "JOIN SESSION ERROR:");
    } finally {
      setLoadingSessionId(null);
    }
  };

  const viewSession = async (session) => {
    setLoadingSessionId(session.id);
    try {
      const [answersRes, participantsRes] = await Promise.all([
        axios.get(
          `${BASE_URL}/quiz/sessions/${session.id}/answers`,
          { headers: { Authorization: `Bearer ${TOKEN}` } }
        ),
        axios.get(
          `${BASE_URL}/quiz/sessions/${session.id}/participants`,
          { headers: { Authorization: `Bearer ${TOKEN}` } }
        ),
      ]);

      console.log("ANSWERS:", answersRes.data);
      console.log("PARTICIPANTS:", participantsRes.data);

      setSelectedSession({
        ...session,
        answers: answersRes.data?.length || 0,
        participants: participantsRes.data || [],
      });
    } catch (err) {
      handleAxiosError(err, "VIEW SESSION ERROR:");
    } finally {
      setLoadingSessionId(null);
    }
  };

  if (pageLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center text-[#001489] font-semibold">
        Loading sessions...
      </div>
    );
  }

  return (
    <div className="bg-white min-h-screen p-6 text-black flex flex-col items-center">

      {/* TOAST CONTAINER */}
      <ToastContainer position="top-right" autoClose={4000} />

      <h1 className="text-2xl font-bold text-[#001489] mb-4 text-center">
        Quiz Session
      </h1>

      {/* AVAILABLE */}
      <Section title="Available Quizzes">
        {availableSessions.length === 0 ? (
          <p>No available sessions</p>
        ) : (
          availableSessions.map((s) => (
            <SessionCard
              key={s.id}
              session={s}
              actionLabel="Join"
              loading={loadingSessionId === s.id}
              onAction={() => joinSession(s.id)}
              onView={() => viewSession(s)}
            />
          ))
        )}
      </Section>

      {/* MY SESSIONS */}
      <Section title="My Sessions">
        {mySessions.length === 0 ? (
          <p>You have not joined any session</p>
        ) : (
          mySessions.map((s) => (
            <SessionCard
              key={s.id}
              session={s}
              loading={loadingSessionId === s.id}
              onView={() => viewSession(s)}
            />
          ))
        )}
      </Section>

      {/* SIDE PANEL */}
      {selectedSession && (
        <SidePanel onClose={() => setSelectedSession(null)}>
          <h2 className="text-xl font-bold text-[#001489]">
            {selectedSession.name}
          </h2>

          <p>Categories: {selectedSession.categories?.join(", ")}</p>
          <p>Difficulty: {selectedSession.difficulties?.join(", ")}</p>
          <p>Status: {selectedSession.status}</p>
          <p>Answers Submitted: {selectedSession.answers}</p>

          <div className="mt-4">
            <p className="font-semibold">Participants</p>
            {selectedSession.participants.length === 0 ? (
              <p>No participants yet</p>
            ) : (
              selectedSession.participants.map((p, i) => (
                <div
                  key={i}
                  className="bg-[#001489] text-white p-2 rounded mt-1 text-sm"
                >
                  {p}
                </div>
              ))
            )}
          </div>
        </SidePanel>
      )}
    </div>
  );
};

/* ================= REUSABLE COMPONENTS ================= */

const Section = ({ title, children }) => (
  <section className="w-full max-w-5xl mb-10">
    <h2 className="text-lg font-semibold text-[#001489] mb-4">{title}</h2>
    <div className="grid gap-6 sm:grid-cols-2">{children}</div>
  </section>
);

const SessionCard = ({ session, actionLabel, onAction, onView, loading }) => (
  <div className="border border-black p-5 rounded-xl flex flex-col justify-between">
    <div>
      <h3 className="font-semibold text-[#001489]">{session.name}</h3>
      <p className="text-sm">Categories: {session.categories?.join(", ")}</p>
      <p className="text-sm">Difficulty: {session.difficulties?.join(", ")}</p>
      <p className="text-sm">Status: {session.status}</p>
    </div>

    <div className="flex gap-2 mt-4">
      {actionLabel && (
        <button
          onClick={onAction}
          disabled={loading}
          className="bg-[#001489] text-white px-4 py-1 rounded"
        >
          {loading ? "..." : actionLabel}
        </button>
      )}
      <button
        onClick={onView}
        className="border border-black px-4 py-1 rounded hover:bg-[#001489] hover:text-white"
      >
        View
      </button>
    </div>
  </div>
);

const SidePanel = ({ children, onClose }) => (
  <div className="fixed inset-0 bg-black/40 flex justify-end z-50">
    <div className="w-full sm:w-[420px] bg-white h-full p-6 overflow-y-auto relative">
      <button
        onClick={onClose}
        className="absolute top-4 right-4 font-bold text-xl"
      >
        ✕
      </button>
      {children}
    </div>
  </div>
);

export default SchoolAssessmentPanel;
