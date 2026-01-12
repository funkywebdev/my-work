import React, { useState, useEffect, useRef } from "react";
import axios from "axios";
import { useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import * as yup from "yup";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { adminSocket } from "../../socketAdmin";

/* ---------------- CONFIG ---------------- */
const BASE_URL = "https://bql-production.up.railway.app";
const TOKEN = localStorage.getItem("adminToken");

/* ---------------- VALIDATION ---------------- */
const schema = yup.object().shape({
  name: yup.string().required("Session name is required"),
  categories: yup.string().required(),
  difficulties: yup.string().required(),
  questionLimit: yup.number().positive().integer().required(),
});

/* ================= MAIN ================= */
const Report = () => {
  const [sessions, setSessions] = useState([]);
  const [selectedSession, setSelectedSession] = useState(null);
  const [showCreate, setShowCreate] = useState(false);
  const [loading, setLoading] = useState(false);
  const socketConnected = useRef(false);

  /* ---------------- ADMIN SOCKET SETUP ---------------- */
  useEffect(() => {
    adminSocket.connect();

    adminSocket.on("connect", () => {
      console.log("✅ ADMIN SOCKET CONNECTED:", adminSocket.id);
      toast.success("Admin socket connected");
    });

    adminSocket.on("disconnect", () => {
      console.log("❌ ADMIN SOCKET DISCONNECTED");
    });

    adminSocket.on("error", (err) => {
      console.error("❌ SOCKET ERROR:", err);
      toast.error(err?.message || "Socket error");
    });

    // 🔍 LOG EVERY EVENT FROM GATEWAY
    adminSocket.onAny((event, payload) => {
      console.log("📡 ADMIN EVENT:", event, payload);
    });

    // 🎯 QUIZ FLOW CONFIRMATION
    adminSocket.on("lobby_countdown_started", () => {
      toast.info("Lobby countdown started");
    });

    adminSocket.on("questions_starting", () => {
      toast.success("Quiz officially started");
    });

    adminSocket.on("new_question", (q) => {
      console.log("🧠 First question sent:", q);
    });

    return () => {
      adminSocket.off();
    };
  }, []);

  /* ---------------- FETCH SESSIONS ---------------- */
  const fetchSessions = async () => {
    try {
      const res = await axios.get(`${BASE_URL}/quiz/sessions`, {
        headers: { Authorization: `Bearer ${TOKEN}` },
      });

      const data = Array.isArray(res.data)
        ? res.data
        : res.data?.sessions || res.data?.data || [];

      setSessions(data);
    } catch {
      toast.error("Failed to fetch sessions");
    }
  };

  useEffect(() => {
    fetchSessions();
  }, []);

  /* ---------------- SESSION STATUS ---------------- */
  const startSession = async (id) => {
    await axios.post(
      `${BASE_URL}/quiz/sessions/${id}/start`,
      {},
      { headers: { Authorization: `Bearer ${TOKEN}` } }
    );
    toast.success("Session started");
    fetchSessions();
  };

  const completeSession = async (id) => {
    await axios.post(
      `${BASE_URL}/quiz/sessions/${id}/complete`,
      {},
      { headers: { Authorization: `Bearer ${TOKEN}` } }
    );
    toast.success("Session completed");
    fetchSessions();
  };

  /* ---------------- JOIN SESSION (ADMIN) ---------------- */
  const fetchSessionDetails = (id) => {
    if (!socketConnected.current) {
      adminSocket.connect();
      socketConnected.current = true;
    }

    console.log("👑 Admin joining session:", id);
    adminSocket.emit("join_session", { sessionId: id, role: "admin" });

    const session = sessions.find((s) => s.id === id);
    setSelectedSession(session);
  };

  /* ---------------- QUIZ CONTROLS ---------------- */
  const startQuiz = (id) => {
    console.log("▶️ START QUIZ:", id);
    adminSocket.emit("start_quiz", { sessionId: id });
  };

  const pauseQuiz = (id) => adminSocket.emit("pause_quiz", { sessionId: id });
  const resumeQuiz = (id) => adminSocket.emit("resume_quiz", { sessionId: id });
  const skipQuestion = (id) =>
    adminSocket.emit("skip_question", { sessionId: id });
  const restartQuiz = (id) =>
    adminSocket.emit("restart_quiz", { sessionId: id });

  /* ---------------- CREATE SESSION ---------------- */
  const handleCreate = async (data) => {
    setLoading(true);
    await axios.post(
      `${BASE_URL}/quiz/sessions`,
      {
        ...data,
        categories: data.categories.split(","),
        difficulties: data.difficulties.split(","),
        questionLimit: Number(data.questionLimit),
      },
      { headers: { Authorization: `Bearer ${TOKEN}` } }
    );
    toast.success("Session created");
    setShowCreate(false);
    fetchSessions();
    setLoading(false);
  };

  return (
    <div className="p-6 space-y-6">
      <ToastContainer />

      <div className="flex justify-between">
        <h1 className="text-xl font-bold">Quiz Sessions</h1>
        <button
          onClick={() => setShowCreate(true)}
          className="bg-[#001489] text-white px-4 py-2 rounded"
        >
          + Create
        </button>
      </div>

      <table className="w-full bg-white border rounded">
        <thead>
          <tr className="bg-gray-100">
            <th className="p-3 text-left">Session</th>
            <th>Status</th>
            <th className="text-right p-3">Actions</th>
          </tr>
        </thead>
        <tbody>
          {sessions.map((s) => (
            <tr key={s.id} className="border-t">
              <td className="p-3">{s.name}</td>
              <td>{s.status}</td>
              <td className="p-3 text-right space-x-2">
                <button onClick={() => fetchSessionDetails(s.id)}>View</button>
                {s.status === "pending" && (
                  <button onClick={() => startSession(s.id)}>Start</button>
                )}
                {s.status === "active" && (
                  <button onClick={() => completeSession(s.id)}>
                    Complete
                  </button>
                )}
              </td>
            </tr>
          ))}
        </tbody>
      </table>

      {selectedSession && (
        <div className="fixed inset-0 bg-black/40 flex justify-end">
          <div className="bg-white w-[400px] p-6 space-y-3">
            <h2 className="font-bold">{selectedSession.name}</h2>

            <button onClick={() => startQuiz(selectedSession.id)}>
              ▶ Start Quiz
            </button>
            <button onClick={() => pauseQuiz(selectedSession.id)}>Pause</button>
            <button onClick={() => resumeQuiz(selectedSession.id)}>Resume</button>
            <button onClick={() => skipQuestion(selectedSession.id)}>
              Skip
            </button>
            <button onClick={() => restartQuiz(selectedSession.id)}>
              Restart
            </button>

            <button onClick={() => setSelectedSession(null)}>Close</button>
          </div>
        </div>
      )}

      {showCreate && (
        <CreateSessionModal
          onClose={() => setShowCreate(false)}
          onCreate={handleCreate}
          loading={loading}
        />
      )}
    </div>
  );
};

/* ================= CREATE MODAL ================= */
const CreateSessionModal = ({ onClose, onCreate, loading }) => {
  const { register, handleSubmit } = useForm({
    resolver: yupResolver(schema),
  });

  return (
    <div className="fixed inset-0 bg-black/40 flex justify-center items-center">
      <form
        onSubmit={handleSubmit(onCreate)}
        className="bg-white p-6 rounded space-y-2"
      >
        <input placeholder="Name" {...register("name")} />
        <input placeholder="Categories" {...register("categories")} />
        <input placeholder="Difficulties" {...register("difficulties")} />
        <input type="number" {...register("questionLimit")} />

        <div className="flex gap-2">
          <button type="button" onClick={onClose}>
            Cancel
          </button>
          <button type="submit" disabled={loading}>
            {loading ? "Creating..." : "Create"}
          </button>
        </div>
      </form>
    </div>
  );
};

export default Report;
