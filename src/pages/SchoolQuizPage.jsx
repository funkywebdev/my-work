import React, { useEffect, useState } from "react";
import { socket } from "../socket";
import { useLocation } from "react-router-dom";

const SchoolQuizPage = () => {
  const { state } = useLocation();
  const sessionId = state?.sessionId;

  const [quizStarted, setQuizStarted] = useState(false);
  const [question, setQuestion] = useState(null);
  const [selectedAnswer, setSelectedAnswer] = useState("");
  const [participants, setParticipants] = useState(0);

  useEffect(() => {
    if (!sessionId) return;

    // Connect student socket
    socket.connect();

    socket.on("connect", () => {
      console.log("✅ Student socket connected:", socket.id);

      // Join the session room
      socket.emit("join_session", {
        sessionId,
        name: "Student",
      });
    });

    // Debug all incoming events
    socket.onAny((event, payload) => {
      console.log("📡 EVENT:", event, payload);
    });

    // Update participant count
    socket.on("session_joined_update", (data) => {
      console.log("👥 Session update:", data);
      setParticipants(data.participantCount);
    });

    // Admin started the quiz
    socket.on("questions_starting", () => {
      console.log("🚀 questions_starting received!");
      setQuizStarted(true);
    });

    // Receive a new question
    socket.on("new_question", (data) => {
      console.log("🧠 New question received:", data);
      setQuestion(data);
      setSelectedAnswer("");
    });

    // Quiz completed
    socket.on("quiz_completed", () => {
      alert("🎉 Quiz completed!");
    });

    socket.on("error", (err) => {
      console.error("❌ Socket error:", err);
    });

    return () => {
      socket.disconnect();
    };
  }, [sessionId]);

  const submitAnswer = () => {
    if (!question || !selectedAnswer) return;

    socket.emit("submit_answer", {
      sessionId,
      questionId: question.id,
      answer: selectedAnswer,
    });
  };

  // Waiting for admin to start
  if (!quizStarted) {
    return (
      <div className="p-6 text-center space-y-2">
        <p className="font-semibold">✅ Connected</p>
        <p>👥 Participants: {participants}</p>
        <p className="text-yellow-600">⏳ Waiting for admin to start the quiz...</p>
      </div>
    );
  }

  // Quiz started but waiting for the first question
  if (!question) {
    return <div className="p-6 text-center">Waiting for question...</div>;
  }

  // Active quiz UI
  return (
    <div className="min-h-screen p-6 max-w-xl mx-auto">
      <h2 className="font-bold mb-4">{question.text}</h2>

      <div className="space-y-2">
        {question.options.map((opt) => (
          <button
            key={opt}
            onClick={() => setSelectedAnswer(opt)}
            className={`w-full p-3 border rounded transition ${
              selectedAnswer === opt ? "bg-blue-600 text-white" : "bg-white hover:bg-gray-100"
            }`}
          >
            {opt}
          </button>
        ))}
      </div>

      <button
        disabled={!selectedAnswer}
        onClick={submitAnswer}
        className="mt-4 w-full bg-blue-600 text-white py-2 rounded disabled:opacity-50"
      >
        Submit Answer
      </button>
    </div>
  );
};

export default SchoolQuizPage;
