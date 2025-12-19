
import React, { useEffect, useState } from "react";
import axios from "axios";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

const BASE_URL = "https://bql-production.up.railway.app";
const TOKEN = localStorage.getItem("schoolToken");

// Words to rotate under the heading
const rotatingTexts = [
  "Explore available quizzes and join your sessions to monitor progress.",
  "Test your knowledge and track your improvements.",
  "Challenge yourself with quizzes and see your results.",
  "Stay sharp by participating in school assessments.",
];

const SchoolAssessmentPanel = () => {
  const [availableSessions, setAvailableSessions] = useState([]);
  const [mySessions, setMySessions] = useState([]);
  const [selectedSession, setSelectedSession] = useState(null);
  const [loadingJoinId, setLoadingJoinId] = useState(null);
  const [loadingViewId, setLoadingViewId] = useState(null);
  const [pageLoading, setPageLoading] = useState(true);
  const [currentTextIndex, setCurrentTextIndex] = useState(0);

  // Rotate text every 3 seconds
  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentTextIndex((prev) => (prev + 1) % rotatingTexts.length);
    }, 3000);

    return () => clearInterval(interval);
  }, []);

  // ================= AXIOS ERROR HANDLER =================
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
      toast.error(error.response.data?.message || "Something went wrong.");
    }
  };

  // ================= FETCH DATA =================
  const fetchAvailableSessions = async () => {
    try {
      const res = await axios.get(`${BASE_URL}/quiz/sessions/available`, {
        headers: { Authorization: `Bearer ${TOKEN}` },
      });
      return res.data;
    } catch (err) {
      handleAxiosError(err, "FETCH AVAILABLE ERROR:");
      return [];
    }
  };

  const fetchMySessions = async () => {
    try {
      const res = await axios.get(`${BASE_URL}/quiz/school/sessions`, {
        headers: { Authorization: `Bearer ${TOKEN}` },
      });
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

  // ================= ACTIONS =================
  const joinSession = async (id) => {
    setLoadingJoinId(id);
    try {
      await axios.post(`${BASE_URL}/quiz/sessions/${id}/join`, {}, {
        headers: { Authorization: `Bearer ${TOKEN}` },
      });

      toast.success("Successfully joined session 🎉");

      const mine = await fetchMySessions();
      setMySessions(mine);
    } catch (err) {
      handleAxiosError(err, "JOIN SESSION ERROR:");
    } finally {
      setLoadingJoinId(null);
    }
  };

  const viewSession = async (session) => {
    setLoadingViewId(session.id);
    try {
      const [answersRes, participantsRes] = await Promise.all([
        axios.get(`${BASE_URL}/quiz/sessions/${session.id}/answers`, {
          headers: { Authorization: `Bearer ${TOKEN}` },
        }),
        axios.get(`${BASE_URL}/quiz/sessions/${session.id}/participants`, {
          headers: { Authorization: `Bearer ${TOKEN}` },
        }),
      ]);

      setSelectedSession({
        ...session,
        answers: answersRes.data?.length || 0,
        participants: participantsRes.data || [],
      });
    } catch (err) {
      handleAxiosError(err, "VIEW SESSION ERROR:");
    } finally {
      setLoadingViewId(null);
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
    <div className="bg-gray-50 min-h-screen p-6 text-black flex flex-col items-center">
      <ToastContainer position="top-right" autoClose={4000} />

      <h1 className="text-3xl font-bold text-[#001489] mb-2 text-center">
        Quiz Sessions
      </h1>
      <p className="text-center text-gray-600 mb-8 text-14px sm:text-[18px] h-12">
        {rotatingTexts[currentTextIndex]}
      </p>

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
              loadingJoin={loadingJoinId === s.id}
              loadingView={loadingViewId === s.id}
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
              loadingView={loadingViewId === s.id}
              onView={() => viewSession(s)}
            />
          ))
        )}
      </Section>

      {/* SIDE PANEL */}
      {selectedSession && (
        <SidePanel onClose={() => setSelectedSession(null)}>
          <h2 className="text-2xl font-bold text-[#001489] mb-4">
            {selectedSession.name}
          </h2>

          <div className="mb-2">
            <span className="font-semibold">Categories:</span>{" "}
            {selectedSession.categories?.join(", ")}
          </div>
          <div className="mb-2">
            <span className="font-semibold">Difficulty:</span>{" "}
            {selectedSession.difficulties?.join(", ")}
          </div>
          <div className="mb-2">
            <span className="font-semibold">Status:</span> {selectedSession.status}
          </div>
          <div className="mb-2">
            <span className="font-semibold">Answers Submitted:</span> {selectedSession.answers}
          </div>

          <div className="mt-4">
            <p className="font-semibold mb-2">Participants</p>
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
    <h2 className="text-xl font-semibold text-[#001489] mb-4">{title}</h2>
    <div className="grid gap-6 sm:grid-cols-2">{children}</div>
  </section>
);

const SessionCard = ({ session, actionLabel, onAction, onView, loadingJoin, loadingView }) => {
  const statusColor = {
    active: "bg-green-100 text-green-800",
    pending: "bg-yellow-100 text-yellow-800",
    closed: "bg-red-100 text-red-800",
  };

  return (
    <div className="border border-gray-200 p-5 rounded-xl shadow-md flex flex-col justify-between hover:shadow-xl transition-shadow duration-300 group">
      <div>
        <h3 className="font-bold text-lg text-[#001489] mb-2">{session.name}</h3>
        <p className="text-sm text-gray-500 mb-1">
          Categories: <span className="font-medium">{session.categories?.join(", ")}</span>
        </p>
        <p className="text-sm text-gray-500 mb-1">
          Difficulty: <span className="font-medium">{session.difficulties?.join(", ")}</span>
        </p>
        <span
          className={`inline-block px-2 py-1 rounded-full text-xs font-semibold ${statusColor[session.status] || "bg-gray-100 text-gray-800"}`}
        >
          {session.status.toUpperCase()}
        </span>
      </div>

      <div className="flex gap-2 mt-4">
        {actionLabel && (
          <button
            onClick={onAction}
            disabled={loadingJoin}
            className="flex-1 bg-[#001489] text-white px-4 py-2 rounded-lg font-medium hover:bg-[#0022cc] transition-colors duration-200 disabled:opacity-50"
          >
            {loadingJoin ? "Processing..." : actionLabel}
          </button>
        )}
        <button
          onClick={onView}
          disabled={loadingView}
          className="flex-1 border border-[#001489] text-[#001489] px-4 py-2 rounded-lg font-medium hover:bg-[#001489] hover:text-white transition-colors duration-200 disabled:opacity-50"
        >
          {loadingView ? "Loading..." : "View"}
        </button>
      </div>

      <div className="mt-3 opacity-0 group-hover:opacity-100 transition-opacity duration-300 text-sm text-gray-400">
        Participants: {session.participants?.length || 0} | Answers: {session.answers || 0}
      </div>
    </div>
  );
};

const SidePanel = ({ children, onClose }) => (
  <div className="fixed inset-0 bg-black/40 flex justify-end z-50">
    <div className="w-full sm:w-[450px] bg-white h-full p-6 overflow-y-auto relative">
      <button
        onClick={onClose}
        className="absolute top-4 right-4 font-bold text-2xl"
      >
        ✕
      </button>
      {children}
    </div>
  </div>
);

export default SchoolAssessmentPanel;
