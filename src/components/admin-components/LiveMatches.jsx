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

const LiveMatches = () => {
  const [sessions, setSessions] = useState([]);
  const [selectedSession, setSelectedSession] = useState(null);
  const [showCreate, setShowCreate] = useState(false);
  const [loading, setLoading] = useState(false);
  const [socketReady, setSocketReady] = useState(false);
  const socketConnected = useRef(false);

  /* ---------------- ADMIN SOCKET SETUP ---------------- */
  useEffect(() => {
    adminSocket.connect();

    adminSocket.on("connect", () => {
      console.log("✅ ADMIN SOCKET CONNECTED:", adminSocket.id);
      toast.success("Admin socket connected");
      socketConnected.current = true;
      setSocketReady(true);
    });

    adminSocket.on("disconnect", () => {
      console.log("❌ ADMIN SOCKET DISCONNECTED");
      setSocketReady(false);
    });

    adminSocket.on("error", (err) => {
      console.error("❌ SOCKET ERROR:", err);
      toast.error(err?.message || "Socket error");
    });

    adminSocket.onAny((event, payload) => {
      console.log("📡 ADMIN EVENT:", event, payload);
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
    try {
      await axios.post(
        `${BASE_URL}/quiz/sessions/${id}/start`,
        {},
        { headers: { Authorization: `Bearer ${TOKEN}` } }
      );
      toast.success("Session started");
      fetchSessions();
    } catch {
      toast.error("Failed to start session");
    }
  };

  const completeSession = async (id) => {
    try {
      await axios.post(
        `${BASE_URL}/quiz/sessions/${id}/complete`,
        {},
        { headers: { Authorization: `Bearer ${TOKEN}` } }
      );
      toast.success("Session completed");
      fetchSessions();
    } catch {
      toast.error("Failed to complete session");
    }
  };

  /* ---------------- JOIN SESSION ---------------- */
  const fetchSessionDetails = (id) => {
    if (!socketConnected.current) {
      toast.info("Connecting socket...");
      adminSocket.connect();
    }

    if (socketConnected.current) {
      adminSocket.emit("join_session", { sessionId: id, role: "admin" });
    }

    const session = sessions.find((s) => s.id === id);
    setSelectedSession(session);
  };

  /* ---------------- QUIZ CONTROLS ---------------- */
  const startQuiz = (id) => {
    if (!socketReady) return toast.error("Socket not ready yet!");

    // Normal start quiz
    adminSocket.emit("start_quiz", { sessionId: id });

    // Broadcast to all students
    adminSocket.emit("quiz_started", { sessionId: id });

    toast.success("Quiz started & students notified");
  };

  const pauseQuiz = (id) => {
    if (!socketReady) return toast.error("Socket not ready!");
    adminSocket.emit("pause_quiz", { sessionId: id });
  };

  const resumeQuiz = (id) => {
    if (!socketReady) return toast.error("Socket not ready!");
    adminSocket.emit("resume_quiz", { sessionId: id });
  };

  const skipQuestion = (id) => {
    if (!socketReady) return toast.error("Socket not ready!");
    adminSocket.emit("skip_question", { sessionId: id });
  };

  const restartQuiz = (id) => {
    if (!socketReady) return toast.error("Socket not ready!");
    adminSocket.emit("restart_quiz", { sessionId: id });
  };

  /* ---------------- CREATE SESSION ---------------- */
  const handleCreate = async (data) => {
    setLoading(true);
    try {
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
    } catch {
      toast.error("Failed to create session");
    }
    setLoading(false);
  };

  return (
    <div className="p-6 space-y-6">
      <ToastContainer />
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-bold text-gray-800">Quiz Sessions</h1>
        <button
          onClick={() => setShowCreate(true)}
          className="bg-blue-700 hover:bg-blue-800 text-white px-4 py-2 rounded transition"
        >
          + Create
        </button>
      </div>

      <table className="w-full bg-white border rounded shadow mt-4">
        <thead>
          <tr className="bg-gray-100">
            <th className="p-3 text-left">Session</th>
            <th className="p-3">Status</th>
            <th className="p-3 text-right">Actions</th>
          </tr>
        </thead>
        <tbody>
          {sessions.map((s) => (
            <tr key={s.id} className="border-t hover:bg-gray-50">
              <td className="p-3">{s.name}</td>
              <td className="p-3 text-center font-medium">{s.status}</td>
              <td className="p-3 text-right space-x-2">
                <button
                  onClick={() => fetchSessionDetails(s.id)}
                  className="bg-gray-200 px-3 py-1 rounded hover:bg-gray-300"
                >
                  View
                </button>
                {s.status === "pending" && (
                  <button
                    onClick={() => startSession(s.id)}
                    className="bg-green-600 text-white px-3 py-1 rounded hover:bg-green-700"
                  >
                    Start
                  </button>
                )}
                {s.status === "active" && (
                  <button
                    onClick={() => completeSession(s.id)}
                    className="bg-red-600 text-white px-3 py-1 rounded hover:bg-red-700"
                  >
                    Complete
                  </button>
                )}
              </td>
            </tr>
          ))}
        </tbody>
      </table>

      {/* QUIZ CONTROLS MODAL */}
      {selectedSession && (
        <div className="fixed inset-0 bg-black/40 flex justify-center items-center z-50">
          <div className="bg-white w-[400px] p-6 rounded shadow-lg space-y-3">
            <h2 className="font-bold text-xl">{selectedSession.name}</h2>
            <div className="flex flex-col gap-2">
              <button
                onClick={() => startQuiz(selectedSession.id)}
                className={`px-4 py-2 rounded ${
                  socketReady
                    ? "bg-green-600 text-white hover:bg-green-700"
                    : "bg-gray-400 text-gray-200 cursor-not-allowed"
                }`}
                disabled={!socketReady}
              >
                ▶ Start Quiz
              </button>
              <button
                onClick={() => pauseQuiz(selectedSession.id)}
                className="px-4 py-2 bg-yellow-500 text-white rounded hover:bg-yellow-600"
              >
                Pause
              </button>
              <button
                onClick={() => resumeQuiz(selectedSession.id)}
                className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
              >
                Resume
              </button>
              <button
                onClick={() => skipQuestion(selectedSession.id)}
                className="px-4 py-2 bg-purple-600 text-white rounded hover:bg-purple-700"
              >
                Skip
              </button>
              <button
                onClick={() => restartQuiz(selectedSession.id)}
                className="px-4 py-2 bg-red-500 text-white rounded hover:bg-red-600"
              >
                Restart
              </button>
              <button
                onClick={() => setSelectedSession(null)}
                className="px-4 py-2 bg-gray-300 rounded hover:bg-gray-400"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}

      {/* CREATE SESSION MODAL */}
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
    <div className="fixed inset-0 bg-black/40 flex justify-center items-center z-50">
      <form
        onSubmit={handleSubmit(onCreate)}
        className="bg-white p-6 rounded shadow-lg space-y-3 w-[350px]"
      >
        <h2 className="font-bold text-lg">Create Session</h2>
        <input
          placeholder="Name"
          {...register("name")}
          className="border px-3 py-2 w-full rounded"
        />
        <input
          placeholder="Categories (comma separated)"
          {...register("categories")}
          className="border px-3 py-2 w-full rounded"
        />
        <input
          placeholder="Difficulties (comma separated)"
          {...register("difficulties")}
          className="border px-3 py-2 w-full rounded"
        />
        <input
          type="number"
          placeholder="Question Limit"
          {...register("questionLimit")}
          className="border px-3 py-2 w-full rounded"
        />

        <div className="flex gap-2 justify-end mt-2">
          <button
            type="button"
            onClick={onClose}
            className="px-4 py-2 bg-gray-300 rounded hover:bg-gray-400"
          >
            Cancel
          </button>
          <button
            type="submit"
            disabled={loading}
            className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 disabled:bg-gray-400"
          >
            {loading ? "Creating..." : "Create"}
          </button>
        </div>
      </form>
    </div>
  );
};

export default LiveMatches;
