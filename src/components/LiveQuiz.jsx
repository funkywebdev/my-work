




import React, { useState, useEffect } from "react"; 
import { motion } from "framer-motion";
import axios from "axios";
import Frame123 from "../assets/images/Frame123.png";
import schoollogo from "../assets/images/schoollogo.png";

/* ================= TIMER ================= */
const MatchTimer = ({ startTime = 30, onTimeUp, questionIndex, isSubmitted }) => {
  const [timeLeft, setTimeLeft] = useState(startTime);

  useEffect(() => {
    setTimeLeft(startTime);
  }, [questionIndex, startTime]);

  useEffect(() => {
    if (timeLeft <= 0) {
      onTimeUp?.();
      return;
    }
    if (isSubmitted) return; // Stop timer after submission
    const interval = setInterval(() => {
      setTimeLeft((prev) => prev - 1);
    }, 1000);
    return () => clearInterval(interval);
  }, [timeLeft, onTimeUp, isSubmitted]);

  const progress = (timeLeft / startTime) * 100;

  return (
    <div className="relative w-12 h-12">
      <svg viewBox="0 0 36 36" className="w-full h-full">
        <circle
          cx="18"
          cy="18"
          r="16"
          stroke="#E5E7EB"
          strokeWidth="4"
          fill="none"
        />
        <circle
          cx="18"
          cy="18"
          r="16"
          stroke={timeLeft <= 5 ? "red" : "#001489"}
          strokeWidth="4"
          fill="none"
          strokeDasharray="100"
          strokeDashoffset={100 - progress}
          strokeLinecap="round"
          transform="rotate(-90 18 18)"
        />
      </svg>
      <span className="absolute inset-0 flex items-center justify-center font-semibold text-sm">
        {timeLeft}s
      </span>
    </div>
  );
};

/* ================= LIVE QUIZ ================= */
const LiveQuiz = () => {
  const [questions, setQuestions] = useState([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [selectedAnswers, setSelectedAnswers] = useState({});
  const [score, setScore] = useState(0);
  const [loading, setLoading] = useState(true);
  const [token, setToken] = useState(null);
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [submitting, setSubmitting] = useState(false);

  const baseUrl = "https://bql-production.up.railway.app";

  useEffect(() => {
    setToken(localStorage.getItem("schoolToken"));
  }, []);

  useEffect(() => {
    if (!token) return;

    const fetchQuestions = async () => {
      try {
        setLoading(true);
        const res = await axios.get(
          `${baseUrl}/questions/quiz?categories=mathematics,physics&difficulties=easy,medium&limit=10`,
          { headers: { Authorization: `Bearer ${token}` } }
        );
        const data = Array.isArray(res.data) ? res.data : res.data?.data || [];
        setQuestions(
          data.map((q) => ({
            questionText: q.questionText,
            category: q.category,
            options: [
              { label: "A", text: q.optionA },
              { label: "B", text: q.optionB },
              { label: "C", text: q.optionC },
              { label: "D", text: q.optionD },
            ],
            correctAnswer: q.correctAnswer,
            timeLimit: q.timeLimit || 30,
          }))
        );
      } catch (err) {
        console.error("Fetch error:", err);
      } finally {
        setLoading(false);
      }
    };
    fetchQuestions();
  }, [token]);

  if (loading) return <p className="text-center py-10">Loading...</p>;
  if (!questions.length) return <p className="text-center py-10">No questions available</p>;

  const currentQuestion = questions[currentIndex];
  const progress = ((currentIndex + 1) / questions.length) * 100;

  const handleAnswer = (label) => {
    if (selectedAnswers[currentIndex] || isSubmitted) return;
    setSelectedAnswers({
      ...selectedAnswers,
      [currentIndex]: label,
    });
  };

  const nextQuestion = () => {
    setCurrentIndex((prev) => Math.min(prev + 1, questions.length - 1));
  };

  const prevQuestion = () => {
    setCurrentIndex((prev) => Math.max(prev - 1, 0));
  };

  const handleTimeUp = () => {
    if (selectedAnswers[currentIndex]) return;
    setSelectedAnswers({
      ...selectedAnswers,
      [currentIndex]: "Time Up",
    });
    setTimeout(nextQuestion, 500);
  };

  const handleSubmit = async () => {
    if (submitting) return;
    setSubmitting(true);

    // Simulate async operation (e.g., sending answers to server)
    await new Promise((resolve) => setTimeout(resolve, 500));

    let calculatedScore = 0;
    questions.forEach((q, idx) => {
      if (selectedAnswers[idx] === q.correctAnswer) calculatedScore += 1;
    });
    setScore(calculatedScore);
    setIsSubmitted(true);
    setSubmitting(false);
  };

  return (
    <div className="py-10 px-4 max-w-6xl mx-auto">
      {/* Header */}
      <div className="flex justify-center items-center gap-2 mb-6">
        <img src={Frame123} alt="Match" className="w-16 h-4" />
        <span className="font-semibold text-xl">Quarter Final Match</span>
      </div>

      {/* Team vs Team */}
      <div className="grid grid-cols-3 gap-4 items-center mb-6 text-center">
        <div>
          <img src={schoollogo} alt="Team 1" className="mx-auto mb-1 rounded-full" />
          <p className="font-semibold">Lagos Int’l School</p>
          <p className="text-lg font-bold">0</p>
          <p>Your Team</p>
        </div>
        <div>
          <p className="font-bold text-xl mb-2">VS</p>
          <div className="w-full h-3 bg-gray-200 rounded-full mb-2">
            <div
              className="h-3 bg-[#001489] rounded-full transition-all"
              style={{ width: `${progress}%` }}
            />
          </div>
          <p className="text-sm font-medium">
            Question {currentIndex + 1} of {questions.length}
          </p>
        </div>
        <div>
          <img src={schoollogo} alt="Team 2" className="mx-auto mb-1 rounded-full" />
          <p className="font-semibold">Royal Academy</p>
          <p className="text-lg font-bold">0</p>
          <p>Opponent</p>
        </div>
      </div>

      {/* Quiz Card */}
      <div className="border border-[#00148938] bg-white rounded-md p-6 shadow-lg mb-6">
        <div className="flex justify-between mb-4">
          <span className="bg-[#C5CEFF4A] px-3 py-1 rounded-md text-[#001489] font-medium">
            {currentQuestion.category}
          </span>
          <MatchTimer
            startTime={currentQuestion.timeLimit}
            questionIndex={currentIndex}
            onTimeUp={handleTimeUp}
            isSubmitted={isSubmitted}
          />
        </div>

        <p className="font-semibold text-lg mb-6">{currentQuestion.questionText}</p>

        <div className="grid gap-3">
          {currentQuestion.options.map((opt) => {
            const userAnswer = selectedAnswers[currentIndex];
            const isCorrect = opt.label === currentQuestion.correctAnswer;
            const isSelected = userAnswer === opt.label;

            // Only show correct/incorrect after submission
            const bgClass = !isSubmitted
              ? isSelected
                ? "bg-gray-200"
                : "hover:bg-[#001489] hover:text-white"
              : isSelected
              ? isCorrect
                ? "bg-green-500 text-white"
                : "bg-red-500 text-white"
              : isCorrect
              ? "bg-green-500 text-white"
              : "";

            return (
              <button
                key={opt.label}
                onClick={() => handleAnswer(opt.label)}
                className={`w-full text-left border border-[#00148938] rounded-lg px-4 py-3 font-medium transition ${bgClass}`}
                disabled={!!userAnswer || isSubmitted}
              >
                <strong>{opt.label}.</strong> {opt.text}
              </button>
            );
          })}
        </div>

        {/* Navigation */}
        <div className="flex justify-between mt-6">
          <button
            onClick={prevQuestion}
            disabled={currentIndex === 0}
            className="bg-gray-400 text-white px-6 py-2 rounded-lg disabled:bg-gray-200"
          >
            Previous
          </button>

          {currentIndex === questions.length - 1 ? (
            <button
              onClick={handleSubmit}
              disabled={isSubmitted || submitting}
              className="bg-[#001489] text-white px-6 py-2 rounded-lg disabled:bg-gray-300 flex items-center justify-center"
            >
              {submitting ? (
                <span className="animate-spin border-2 border-white border-t-transparent rounded-full w-5 h-5"></span>
              ) : (
                "Submit"
              )}
            </button>
          ) : (
            <button
              onClick={nextQuestion}
              disabled={currentIndex === questions.length - 1}
              className="bg-[#001489] text-white px-6 py-2 rounded-lg disabled:bg-gray-300"
            >
              Next Question
            </button>
          )}
        </div>
      </div>

      {isSubmitted && (
        <p className="text-center font-semibold text-lg">
          Score: {score} / {questions.length}
        </p>
      )}
    </div>
  );
};

export default LiveQuiz;
