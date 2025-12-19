
import React, { useState, useEffect } from "react";
import axios from "axios";
import { useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import * as yup from "yup";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

// ---------------- CONFIG ----------------
const BASE_URL = "https://bql-production.up.railway.app";
const TOKEN = localStorage.getItem("adminToken");

// ---------------- VALIDATION SCHEMA ----------------
const schema = yup.object().shape({
  name: yup.string().required("Session name is required"),
  categories: yup.string().required("At least one category is required"),
  difficulties: yup.string().required("At least one difficulty is required"),
  questionLimit: yup
    .number()
    .typeError("Question limit must be a number")
    .positive("Question limit must be positive")
    .integer("Question limit must be an integer")
    .required("Question limit is required"),
});

// ---------------- MAIN COMPONENT ----------------
const Report = () => {
  const [sessions, setSessions] = useState([]);
  const [selectedSession, setSelectedSession] = useState(null);
  const [showCreate, setShowCreate] = useState(false);
  const [loading, setLoading] = useState(false);

  // ---------------- FETCH SESSIONS ----------------
  const fetchSessions = async () => {
    try {
      const res = await axios.get(`${BASE_URL}/quiz/sessions`, {
        headers: { Authorization: `Bearer ${TOKEN}` },
      });
      setSessions(res.data);
    } catch (err) {
      console.error("Failed to fetch sessions:", err);
      toast.error(err.response?.data?.message || "Failed to fetch sessions");
    }
  };

  useEffect(() => {
    fetchSessions();
  }, []);

  // ---------------- START / COMPLETE SESSION ----------------
  const startSession = async (id) => {
    try {
      await axios.post(
        `${BASE_URL}/quiz/sessions/${id}/start`,
        {},
        { headers: { Authorization: `Bearer ${TOKEN}` } }
      );
      setSessions((prev) =>
        prev.map((s) => (s.id === id ? { ...s, status: "active" } : s))
      );
      toast.success("Session started successfully");
    } catch (err) {
      console.error(err);
      toast.error(err.response?.data?.message || "Failed to start session");
    }
  };

  const completeSession = async (id) => {
    try {
      await axios.post(
        `${BASE_URL}/quiz/sessions/${id}/complete`,
        {},
        { headers: { Authorization: `Bearer ${TOKEN}` } }
      );
      setSessions((prev) =>
        prev.map((s) => (s.id === id ? { ...s, status: "completed" } : s))
      );
      toast.success("Session completed successfully");
    } catch (err) {
      console.error(err);
      toast.error(err.response?.data?.message || "Failed to complete session");
    }
  };

  // ---------------- FETCH SESSION DETAILS ----------------
  const fetchSessionDetails = async (id) => {
    try {
      const [answersRes, participantsRes] = await Promise.all([
        axios.get(`${BASE_URL}/quiz/sessions/${id}/answers`, {
          headers: { Authorization: `Bearer ${TOKEN}` },
        }),
        axios.get(`${BASE_URL}/quiz/sessions/${id}/participants`, {
          headers: { Authorization: `Bearer ${TOKEN}` },
        }),
      ]);



      const session = sessions.find((s) => s.id === id);
      setSelectedSession({
        ...session,
        participants: participantsRes.data || [],
        answers: answersRes.data?.length || 0,
      });
    } catch (err) {
      console.error(err);
      toast.error(err.response?.data?.message || "Failed to fetch session details");
    }
  };

  // ---------------- CREATE SESSION ----------------
  const handleCreate = async (data) => {
    setLoading(true);
    try {
      const res = await axios.post(
        `${BASE_URL}/quiz/sessions`,
        {
          name: data.name,
          categories: data.categories.split(",").map((c) => c.trim()),
          difficulties: data.difficulties.split(",").map((d) => d.trim()),
          questionLimit: Number(data.questionLimit),
        },
        { headers: { Authorization: `Bearer ${TOKEN}` } }
      );
      setSessions((prev) => [...prev, res.data]);
      setShowCreate(false);
      toast.success("Session created successfully");
    } catch (err) {
      console.error(err);
      toast.error(err.response?.data?.message || "Failed to create session");
    }
    setLoading(false);
  };

  return (
    <div className="space-y-6 bg-white px-6">
      <ToastContainer />

      {/* HEADER */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-xl sm:text-2xl font-bold">Run, Track & Manage Quizzes</h1>
          <p className="text-gray-600 text-sm sm:text-base">
            Monitor all quiz sessions, control their status, and view participant activity in real-time.
          </p>
        </div>
        <button
          onClick={() => setShowCreate(true)}
          className="px-4 py-2 bg-[#001489] text-white rounded-lg"
        >
          + Create Session
        </button>
      </div>

      {/* STATS */}
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4 shadow-md">
        <Stat label="Total" value={sessions.length} />
        <Stat label="Pending" value={sessions.filter((s) => s.status === "pending").length} />
        <Stat label="Active" value={sessions.filter((s) => s.status === "active").length} />
        <Stat label="Completed" value={sessions.filter((s) => s.status === "completed").length} />
      </div>

      {/* SESSIONS TABLE */}
      <div className="overflow-x-auto">
        <table className="table table-compact table-auto w-full min-w-[600px] border border-[#001489]">
          <thead className="bg-[#001489] text-white">
            <tr>
              <th>Session</th>
              <th>Categories</th>
              <th>Status</th>
              <th>Participants</th>
              <th>Answers</th>
              <th className="text-center">Actions</th>
            </tr>
          </thead>
          <tbody>
            {sessions.map((s) => (
              <tr key={s.id} className="hover:bg-gray-50">
                <td className="font-medium text-[#001489]">{s.name}</td>
                <td>{s.categories?.join(", ") || "-"}</td>
                <td>
                  <StatusBadge status={s.status} />
                </td>
                <td>{s.participants?.length ?? 0}</td>
                <td>{s.answers ?? 0}</td>
                <td className="flex flex-wrap justify-end gap-2">
                  <button
                    onClick={() => fetchSessionDetails(s.id)}
                    className="px-3 py-1 border border-[#001489] text-[#001489] rounded-lg hover:bg-[#001489] hover:text-white transition"
                  >
                    View
                  </button>
                  {s.status === "pending" && (
                    <button
                      onClick={() => startSession(s.id)}
                      className="px-3 py-1 bg-[#001489] text-white rounded-lg"
                    >
                      Start
                    </button>
                  )}
                  {s.status === "active" && (
                    <button
                      onClick={() => completeSession(s.id)}
                      className="px-3 py-1 bg-red-600 text-white rounded-lg"
                    >
                      Complete
                    </button>
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* SESSION DETAILS */}
      {selectedSession && (
        <SidePanel onClose={() => setSelectedSession(null)}>
          <h2 className="text-xl font-semibold text-[#001489]">{selectedSession.name}</h2>
          <Detail label="Categories" value={selectedSession.categories?.join(", ") || "-"} />
          <Detail label="Difficulty" value={selectedSession.difficulties?.join(", ") || "-"} />
          <Detail label="Questions" value={selectedSession.questionLimit ?? "-"} />
          <Detail label="Status" value={selectedSession.status ?? "-"} />

          <div className="pt-4 border-t">
            <p className="font-semibold mb-2 text-[#001489]">Participants</p>
            {selectedSession.participants.length === 0 ? (
              <p className="text-sm text-gray-500">No participants yet</p>
            ) : (
              selectedSession.participants.map((p, i) => (
                <div
                  key={i}
                  className="text-sm bg-gray-100 p-2 rounded mb-1 text-[#001489]"
                >
                  {p}
                </div>
              ))
            )}
          </div>

          <div className="pt-4 border-t">
            <p className="font-semibold text-[#001489]">Answers Submitted</p>
            <p className="text-2xl font-bold">{selectedSession.answers ?? 0}</p>
          </div>
        </SidePanel>
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

// ---------------- COMPONENTS ----------------
const Stat = ({ label, value }) => (
  <div className="bg-white p-4 rounded-xl shadow border border-[#001489]">
    <p className="text-sm text-gray-600">{label}</p>
    <p className="text-2xl font-bold text-[#001489]">{value}</p>
  </div>
);

const StatusBadge = ({ status }) => {
  const map = {
    pending: "bg-gray-200 text-gray-700",
    active: "bg-green-100 text-green-700",
    completed: "bg-[#001489] text-white",
  };
  return (
    <span className={`px-3 py-1 rounded-full text-xs font-medium ${map[status]}`}>
      {status}
    </span>
  );
};

const Detail = ({ label, value }) => (
  <div>
    <p className="text-sm text-gray-500">{label}</p>
    <p className="font-medium text-[#001489]">{value}</p>
  </div>
);

const SidePanel = ({ children, onClose }) => (
  <div className="fixed inset-0 bg-black/40 flex justify-end z-50">
    <div className="w-full sm:w-[420px] bg-white h-full p-4 sm:p-6 space-y-4 overflow-y-auto">
      <button
        onClick={onClose}
        className="text-gray-400 hover:text-[#001489] text-xl font-bold"
      >
        ✕
      </button>
      {children}
    </div>
  </div>
);

const CreateSessionModal = ({ onClose, onCreate, loading }) => {
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm({
    resolver: yupResolver(schema),
  });

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
      <div className="bg-white p-6 sm:p-8 rounded-xl w-full max-w-md md:max-w-lg space-y-4 overflow-auto shadow-lg">
        <h2 className="text-xl font-semibold text-[#001489] text-center sm:text-left">
          Create Quiz Session
        </h2>

        <form onSubmit={handleSubmit(onCreate)} className="space-y-2">
          <div>
            <input
              type="text"
              placeholder="Name"
              {...register("name")}
              className="input border border-[#001489] w-full p-2 rounded"
            />
            <p className="text-red-500 text-xs">{errors.name?.message}</p>
          </div>
          <div>
            <input
              type="text"
              placeholder="Categories (comma separated)"
              {...register("categories")}
              className="input border border-[#001489] w-full p-2 rounded"
            />
            <p className="text-red-500 text-xs">{errors.categories?.message}</p>
          </div>
          <div>
            <input
              type="text"
              placeholder="Difficulties (easy,medium)"
              {...register("difficulties")}
              className="input border border-[#001489] w-full p-2 rounded"
            />
            <p className="text-red-500 text-xs">{errors.difficulties?.message}</p>
          </div>
          <div>
            <input
              type="number"
              placeholder="Question Limit"
              {...register("questionLimit")}
              className="input border border-[#001489] w-full p-2 rounded"
            />
            <p className="text-red-500 text-xs">{errors.questionLimit?.message}</p>
          </div>

          <div className="flex flex-col sm:flex-row justify-end gap-2 mt-2">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 border border-[#001489] rounded w-full sm:w-auto"
              disabled={loading}
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-4 py-2 bg-[#001489] text-white rounded w-full sm:w-auto"
              disabled={loading}
            >
              {loading ? "Creating..." : "Create"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default Report;
