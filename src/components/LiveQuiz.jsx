



import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useNavigate } from "react-router-dom";
import Frame123 from "../assets/images/Frame123.png";
import schoollogo from "../assets/images/schoollogo.png";

/* ================= TIMER ================= */
const MatchTimer = ({ timeLeft, totalTime, className = "w-10 h-10" }) => {
  const progress = Math.max(0, Math.min(100, (timeLeft / totalTime) * 100));

  return (
    <div className={`${className} relative`}>
      <svg viewBox="0 0 36 36" className="w-full h-full">
        <circle cx="18" cy="18" r="16" stroke="#E5E7EB" strokeWidth="4" fill="none" />
        <circle
          cx="18"
          cy="18"
          r="16"
          stroke={timeLeft <= 10 ? "red" : "#001489"}
          strokeWidth="4"
          fill="none"
          strokeDasharray="100"
          strokeDashoffset={100 - progress}
          strokeLinecap="round"
          transform="rotate(-90 18 18)"
        />
      </svg>
      <span className="absolute inset-0 flex items-center justify-center font-semibold text-[10px] md:text-sm">
        {timeLeft}s
      </span>
    </div>
  );
};

/* ================= LIVE QUIZ ================= */
const LiveQuiz = () => {
  const navigate = useNavigate();

  // Dummy local questions (no API)
  const dummyQuestions = [
    {
      category: "Mathematics",
      questionText: "What is 2 + 2?",
      options: [
        { label: "A", text: "3" },
        { label: "B", text: "4" },
        { label: "C", text: "5" },
        { label: "D", text: "6" },
      ],
      correctAnswer: "B",
    },
    {
      category: "Physics",
      questionText: "What is the unit of force?",
      options: [
        { label: "A", text: "Newton" },
        { label: "B", text: "Pascal" },
        { label: "C", text: "Joule" },
        { label: "D", text: "Watt" },
      ],
      correctAnswer: "A",
    },
    {
      category: "General",
      questionText: "Which planet is known as the Red Planet?",
      options: [
        { label: "A", text: "Earth" },
        { label: "B", text: "Mars" },
        { label: "C", text: "Jupiter" },
        { label: "D", text: "Venus" },
      ],
      correctAnswer: "B",
    },
  ];

  const totalTime = 90; // overall quiz time in seconds
  const [questions] = useState(dummyQuestions);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [selectedAnswers, setSelectedAnswers] = useState({}); // { index: 'A' }
  const [markedForReview, setMarkedForReview] = useState({});
  const [score, setScore] = useState(0);
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [lobbyCountdown, setLobbyCountdown] = useState(5);
  const [showModal, setShowModal] = useState(false);
  const [timeLeft, setTimeLeft] = useState(totalTime);
  const [missedQuestions, setMissedQuestions] = useState([]); // { question, correctAnswerText, selectedAnswerText }

  /* ---------- Lobby Countdown ---------- */
  useEffect(() => {
    if (lobbyCountdown === 0) return;
    const timer = setInterval(() => setLobbyCountdown((prev) => prev - 1), 1000);
    return () => clearInterval(timer);
  }, [lobbyCountdown]);

  /* ---------- Overall Quiz Timer (stops after submission) ---------- */
  useEffect(() => {
    if (lobbyCountdown > 0 || isSubmitted) return;
    if (timeLeft <= 0) {
      handleSubmit();
      return;
    }
    const interval = setInterval(() => setTimeLeft((prev) => prev - 1), 1000);
    return () => clearInterval(interval);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [timeLeft, lobbyCountdown, isSubmitted]);

  const currentQuestion = questions[currentIndex];
  const progress = ((currentIndex + 1) / questions.length) * 100;

  /* ---------- Handlers ---------- */
  const handleAnswer = (label) => {
    if (isSubmitted) return; // block after submission
    // allow changing answers freely before submission
    setSelectedAnswers((prev) => ({ ...prev, [currentIndex]: label }));
  };

  const toggleMarkReview = () => {
    setMarkedForReview((prev) => ({ ...prev, [currentIndex]: !prev[currentIndex] }));
  };

  const nextQuestion = () => setCurrentIndex((prev) => Math.min(prev + 1, questions.length - 1));
  const prevQuestion = () => setCurrentIndex((prev) => Math.max(prev - 1, 0));

  const handleSubmit = async () => {
    if (submitting) return;
    setSubmitting(true);

    // optional small delay for UX
    await new Promise((resolve) => setTimeout(resolve, 300));

    let calculatedScore = 0;
    const missed = [];

    questions.forEach((q, idx) => {
      const selectedLabel = selectedAnswers[idx];
      if (selectedLabel === q.correctAnswer) {
        calculatedScore += 1;
      } else {
        const correctOption = q.options.find((o) => o.label === q.correctAnswer);
        const selectedOption = q.options.find((o) => o.label === selectedLabel);
        missed.push({
          question: q.questionText,
          correctAnswerLabel: q.correctAnswer,
          correctAnswerText: correctOption ? correctOption.text : "—",
          selectedAnswerLabel: selectedLabel ?? null,
          selectedAnswerText: selectedOption ? selectedOption.text : (selectedLabel ? "Unknown" : "No answer"),
        });
      }
    });

    setScore(calculatedScore);
    setMissedQuestions(missed);
    setIsSubmitted(true);
    setShowModal(true);
    setSubmitting(false);

    // NOTE: no automatic navigation — user must click the button
  };

  const formatAnswerClass = (opt) => {
    const userAnswer = selectedAnswers[currentIndex];
    const isCorrect = opt.label === currentQuestion.correctAnswer;
    const isSelected = userAnswer === opt.label;

    if (!isSubmitted) {
      return isSelected ? "bg-gray-200" : "hover:bg-[#001489] hover:text-white";
    } else {
      if (isSelected) return isCorrect ? "bg-green-500 text-white" : "bg-red-500 text-white";
      if (isCorrect) return "bg-green-500 text-white";
      return "";
    }
  };

  if (lobbyCountdown > 0) {
    return (
  <div className="min-h-screen flex items-center justify-center bg-white px-4">
  <div className="text-center max-w-md w-full">
    <h1 className="text-xl sm:text-2xl font-semibold text-gray-900 mb-3">
      Waiting for players
    </h1>

    <p className="text-sm sm:text-base text-gray-600 mb-6">
      The quiz will begin shortly.
    </p>

    <div className="text-4xl sm:text-5xl font-bold text-gray-900 mb-2">
      {lobbyCountdown}
    </div>

    <p className="text-xs sm:text-sm text-gray-500">
      seconds remaining
    </p>
  </div>
</div>

    );
  }

  return (
    <div className="py-8 px-4 sm:py-10 sm:px-6 max-w-7xl mx-auto">
      {/* VS Match Header */}
      <div className="flex justify-center items-center gap-2 mb-4 sm:mb-6">
        <img src={Frame123} alt="Match" className="w-10 h-3 md:w-16 md:h-4" />
        <span className="font-semibold text-[14px] md:text-xl">Quarter Final Match</span>
      </div>

      <div className="grid grid-cols-3 gap-4 items-center mb-4 sm:mb-6 text-center">
        <div>
          <img src={schoollogo} alt="Team 1" className="mx-auto mb-1 rounded-full w-10 h-10 md:w-16 md:h-16" />
          <p className="font-bold  text-[13px] md:text-base">Lagos Int’l School</p>
          <p className="text-[12px] md:text-lg font-bold">0</p>
          <p className="text-[12px] md:text-sm">Your Team</p>
        </div>

        <div>
          <p className="font-bold text-lg mb-2 md:text-xl">VS</p>
          <div className="w-full h-2 md:h-3 bg-gray-200 rounded-full mb-2">
            <div className="h-2 md:h-3 bg-[#001489] rounded-full transition-all" style={{ width: `${progress}%` }} />
          </div>
          <p className="text-xs md:text-sm">
            Question {currentIndex + 1} of {questions.length}
          </p>
        </div>

        <div>
          <img src={schoollogo} alt="Team 2" className="mx-auto mb-1 rounded-full w-10 h-10 md:w-16 md:h-16" />
          <p className="font-bold text-[13px] md:text-base">Royal Academy</p>
          <p className="text-[12px] md:text-lg font-bold">0</p>
          <p className="text-[12px] md:text-sm">Opponent</p>
        </div>
      </div>

      {/* Question Card */}
      <AnimatePresence exitBeforeEnter>
        <motion.div
          key={currentIndex}
          initial={{ opacity: 0, x: 40 }}
          animate={{ opacity: 1, x: 0 }}
          exit={{ opacity: 0, x: -40 }}
          transition={{ duration: 0.28 }}
          className="border border-[#00148920] bg-white rounded-md p-4 sm:p-6 shadow-lg mb-6"
        >
          <div className="flex justify-between items-start mb-3">
            <span className="bg-[#C5CEFF4A] px-2 py-1 rounded-md text-[#001489] text-xs sm:text-sm font-medium">
              {currentQuestion.category}
            </span>
            <MatchTimer timeLeft={timeLeft} totalTime={totalTime} className="w-9 h-9 sm:w-11 sm:h-11 md:w-12 md:h-12" />
          </div>

          <p className="font-semibold text-base sm:text-lg mb-4">{currentQuestion.questionText}</p>

          <div className="grid gap-3">
            {currentQuestion.options.map((opt) => (
              <button
                key={opt.label}
                onClick={() => handleAnswer(opt.label)}
                className={`w-full text-left border border-[#00148920] rounded-lg px-3 py-2 sm:px-4 sm:py-3 font-medium transition ${formatAnswerClass(
                  opt
                )}`}
                disabled={isSubmitted}
              >
                <strong className="mr-2">{opt.label}.</strong>
                <span className="text-sm sm:text-base">{opt.text}</span>
              </button>
            ))}
          </div>

          <div className="flex items-center justify-between mt-3">
            <button
              onClick={toggleMarkReview}
              className={`mt-3 px-3 py-1.5 rounded-full text-sm sm:px-4 sm:py-2 font-semibold transition-all ${
                markedForReview[currentIndex] ? "bg-yellow-400 text-white hover:bg-yellow-500" : "bg-gray-200 text-gray-700 hover:bg-gray-300"
              }`}
            >
              {markedForReview[currentIndex] ? "Unmark Review" : "Mark for Review"}
            </button>

            {/* Navigation */}
            <div className="flex items-center gap-2">
              <button onClick={prevQuestion} disabled={currentIndex === 0} className="bg-gray-400 text-white px-3 py-1.5 rounded-md disabled:bg-gray-200 text-sm">
                Previous
              </button>

              {currentIndex === questions.length - 1 ? (
                <button
                  onClick={handleSubmit}
                  disabled={isSubmitted || submitting}
                  className="bg-[#001489] text-white px-3 py-1.5 sm:py-2 rounded-md disabled:bg-gray-300 text-sm flex items-center justify-center"
                >
                  {submitting ? <span className="animate-spin border-2 border-white border-t-transparent rounded-full w-4 h-4" /> : "Submit"}
                </button>
              ) : (
                <button onClick={nextQuestion} disabled={currentIndex === questions.length - 1} className="bg-[#001489] text-white px-3 py-1.5 rounded-md disabled:bg-gray-300 text-sm">
                  Next
                </button>
              )}
            </div>
          </div>
        </motion.div>
      </AnimatePresence>

      {/* Submission Modal */}
     

  {showModal && (
  <motion.div
    initial={{ opacity: 0 }}
    animate={{ opacity: 1 }}
    exit={{ opacity: 0 }}
    transition={{ duration: 0.3 }}
    className="fixed inset-0 z-50 bg-white overflow-y-auto"
  >
  
    <div className="min-h-screen px-4 py-8 sm:py-12">
      <div className="max-w-3xl mx-auto">
        
      
        <div className="mb-8">
          <h1 className="text-2xl sm:text-3xl font-semibold text-gray-900 mb-2">
            Quiz Submitted
          </h1>
          <p className="text-sm sm:text-base text-gray-600">
            Your responses have been saved successfully.
          </p>
        </div>

        {/* Score */}
        <div className="border border-gray-200 rounded-xl p-6 mb-8">
          <p className="text-sm text-gray-500 mb-2">Your Score</p>
          <p className="text-4xl font-bold text-gray-900">
            {score} / {questions.length}
          </p>
        </div>

        {/* Review section */}
        {missedQuestions.length > 0 ? (
          <div className="mb-10">
            <h2 className="text-lg font-semibold text-gray-900 mb-4">
              Review incorrect answers
            </h2>

            <div className="space-y-4">
              {missedQuestions.map((m, i) => (
                <div
                  key={i}
                  className="border border-gray-200 rounded-lg p-4"
                >
                  <p className="font-medium text-gray-900 mb-2">
                    {m.question}
                  </p>

                  <p className="text-sm text-gray-600 mb-1">
                    Your answer:{" "}
                    <span className={m.selectedAnswerLabel ? "font-medium" : "italic"}>
                      {m.selectedAnswerText}
                    </span>
                  </p>

                  <p className="text-sm text-gray-800">
                    Correct answer:{" "}
                    <span className="font-medium">
                      {m.correctAnswerText}
                    </span>
                  </p>
                </div>
              ))}
            </div>
          </div>
        ) : (
          <p className="text-gray-700 mb-10">
            Excellent work. You answered all questions correctly.
          </p>
        )}

        {/* Actions */}
        <div className="flex justify-end gap-4 border-t pt-6">
          <button
            onClick={() => setShowModal(false)}
            className="px-4 py-2 text-sm rounded border border-gray-300 text-gray-700 hover:bg-gray-100"
          >
            Back
          </button>

          <button
            onClick={() => navigate("/dashboard")}
            className="px-4 py-2 text-sm rounded bg-[#001489] text-white hover:opacity-90"
          >
            Go to Dashboard
          </button>
        </div>

      </div>
    </div>
  </motion.div>
)}

    </div>
  );
};

export default LiveQuiz;
