




// import React, { useState, useEffect } from "react";

// // ===============================
// // Match Timer Component
// // ===============================
// const MatchTimer = ({ startTime = 30, onTimeUp, resetKey }) => {
//   const [timeLeft, setTimeLeft] = useState(startTime);

//   useEffect(() => {
//     setTimeLeft(startTime); // Reset timer when resetKey changes
//   }, [resetKey, startTime]);

//   useEffect(() => {
//     if (timeLeft <= 0) {
//       onTimeUp(); // Notify parent that time is up
//       return;
//     }

//     const interval = setInterval(() => {
//       setTimeLeft((prev) => (prev > 0 ? prev - 1 : 0));
//     }, 1000);

//     return () => clearInterval(interval);
//   }, [timeLeft, onTimeUp]);

//   return (
//     <div className="flex items-center gap-2">
//       <p className="text-[#001489] font-semibold text-sm md:text-base">{timeLeft}s</p>
//     </div>
//   );
// };

// // ===============================
// // Quiz Component
// // ===============================
// const QuizUI = () => {
//   const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
//   const [selectedAnswer, setSelectedAnswer] = useState(null);
//   const [answersRecord, setAnswersRecord] = useState([]); // Store all answers
//   const [showScore, setShowScore] = useState(false);

//   // Example questions data
//   const questions = [
//     {
//       text: "What is the derivative of f(x) = x³ + 2x² - 5x + 3?",
//       options: [
//         { label: "A", text: "3x² + 4x - 5" },
//         { label: "B", text: "3x² + 2x - 5" },
//         { label: "C", text: "3x² + 4x - 5" },
//         { label: "D", text: "3x² + x - 5" },
//       ],
//       correct: "A",
//     },
//     {
//       text: "What is the value of π (pi) approximately?",
//       options: [
//         { label: "A", text: "3.14" },
//         { label: "B", text: "2.71" },
//         { label: "C", text: "1.61" },
//         { label: "D", text: "4.20" },
//       ],
//       correct: "A",
//     },
//     {
//       text: "Who is the President of Nigeria?",
//       options: [
//         { label: "A", text: "Buhari" },
//         { label: "B", text: "Tinubu" },
//         { label: "C", text: "Osinbajo" },
//         { label: "D", text: "Dele" },
//       ],
//       correct: "B",
//     },
//   ];

//   const currentQuestion = questions[currentQuestionIndex];

//   const handleSelectAnswer = (answer) => {
//     setSelectedAnswer(answer.label);
//   };

//   const handleNext = () => {
//     // Save current answer
//     setAnswersRecord((prev) => [
//       ...prev,
//       { question: currentQuestion.text, selected: selectedAnswer, correct: currentQuestion.correct },
//     ]);
//     setSelectedAnswer(null);

//     if (currentQuestionIndex + 1 < questions.length) {
//       setCurrentQuestionIndex(currentQuestionIndex + 1);
//     } else {
//       setShowScore(true);
//     }
//   };

//   const handlePrev = () => {
//     if (currentQuestionIndex === 0) return;
//     setCurrentQuestionIndex(currentQuestionIndex - 1);
//     setSelectedAnswer(answersRecord[currentQuestionIndex - 1]?.selected || null);
//   };

//   const handleTimeUp = () => {
//     handleNext(); // Auto move to next question
//   };

//   if (showScore) {
//     const score = answersRecord.filter((a) => a.selected === a.correct).length;
//     return (
//       <div className="min-h-screen p-6 bg-white text-center">
//         <h1 className="text-3xl font-bold text-[#001489] mb-4">Quiz Completed!</h1>
//         <p className="text-xl mb-4">Your Score: {score} / {questions.length}</p>
//         <div className="text-left max-w-xl mx-auto space-y-3">
//           {answersRecord.map((q, i) => (
//             <div key={i} className="border p-3 rounded-md shadow">
//               <p className="font-semibold">{q.question}</p>
//               <p>
//                 Your answer: <span className={q.selected === q.correct ? "text-green-600" : "text-red-600"}>{q.selected}</span>
//               </p>
//               <p>Correct answer: <span className="text-green-600">{q.correct}</span></p>
//             </div>
//           ))}
//         </div>
//       </div>
//     );
//   }

//   return (
//     <div className="w-full min-h-screen p-4 md:p-6 bg-white max-w-3xl mx-auto">
//       {/* Question Header */}
//       <div className="flex justify-between items-center mb-4">
//         <p className="font-semibold text-lg md:text-2xl">Question {currentQuestionIndex + 1} of {questions.length}</p>
//         <MatchTimer startTime={30} onTimeUp={handleTimeUp} resetKey={currentQuestionIndex} />
//       </div>

//       {/* Question Text */}
//       <p className="font-semibold text-base md:text-lg mb-4">{currentQuestion.text}</p>

//       {/* Options */}
//       <div className="space-y-3 mb-4">
//         {currentQuestion.options.map((option) => (
//           <div
//             key={option.label}
//             onClick={() => handleSelectAnswer(option)}
//             className={`flex items-center gap-3 border border-[#C5CEFFFC] rounded-full px-3 py-2 sm:px-4 sm:py-2 cursor-pointer transition
//               ${selectedAnswer === option.label ? "bg-[#001489] text-white" : "hover:bg-[#001489] hover:text-white"}`}
//           >
//             <span
//               className={`flex items-center justify-center w-8 h-8 rounded-full font-bold
//                 ${selectedAnswer === option.label ? "bg-white text-[#001489]" : "bg-[#C5CEFFFC] text-[#001489]"}`}
//             >
//               {option.label}
//             </span>
//             <span className="flex-1 text-sm sm:text-base">{option.text}</span>
//           </div>
//         ))}
//       </div>

//       {/* Navigation Buttons */}
//       <div className="flex justify-between mt-4">
//         <button
//           onClick={handlePrev}
//           disabled={currentQuestionIndex === 0}
//           className="bg-gray-300 text-black px-4 py-2 rounded hover:bg-gray-400 disabled:opacity-50"
//         >
//           Previous
//         </button>
//         <button
//           onClick={handleNext}
//           disabled={!selectedAnswer}
//           className="bg-[#001489] text-white px-4 py-2 rounded hover:bg-blue-800 disabled:opacity-50"
//         >
//           {currentQuestionIndex + 1 === questions.length ? "Submit" : "Next"}
//         </button>
//       </div>
//     </div>
//   );
// };

// export default QuizUI;



import React, { useState, useEffect } from "react";

// ===============================
// Global Timer Component
// ===============================
const QuizTimer = ({ totalTime = 30, onTimeUp, isPaused }) => {
  const [timeLeft, setTimeLeft] = useState(totalTime);

  useEffect(() => {
    if (timeLeft <= 0) {
      onTimeUp();
      return;
    }
    if (isPaused) return;

    const interval = setInterval(() => {
      setTimeLeft((prev) => prev - 1);
    }, 1000);

    return () => clearInterval(interval);
  }, [timeLeft, onTimeUp, isPaused]);

  const minutes = Math.floor(timeLeft / 60);
  const seconds = timeLeft % 60;

  return (
    <div className="text-[#001489] font-semibold text-lg">
      {minutes.toString().padStart(2, "0")}:{seconds.toString().padStart(2, "0")}
    </div>
  );
};

// ===============================
// CBT Quiz Component
// ===============================
const QuizUI = () => {
  const TOTAL_TIME = 30;

  const questions = [
    {
      text: "What is the derivative of f(x) = x³ + 2x² - 5x + 3?",
      options: [
        { label: "A", text: "3x² + 4x - 5" },
        { label: "B", text: "3x² + 2x - 5" },
        { label: "C", text: "3x² + 4x - 5" },
        { label: "D", text: "3x² + x - 5" },
      ],
      correct: "A",
    },
    {
      text: "What is the value of π (pi) approximately?",
      options: [
        { label: "A", text: "3.14" },
        { label: "B", text: "2.71" },
        { label: "C", text: "1.61" },
        { label: "D", text: "4.20" },
      ],
      correct: "A",
    },
    {
      text: "Who is the President of Nigeria?",
      options: [
        { label: "A", text: "Buhari" },
        { label: "B", text: "Tinubu" },
        { label: "C", text: "Osinbajo" },
        { label: "D", text: "Dele" },
      ],
      correct: "B",
    },
  ];

  const [answers, setAnswers] = useState(Array(questions.length).fill(null));
  const [quizCompleted, setQuizCompleted] = useState(false);
  const [timeUp, setTimeUp] = useState(false);

  const handleSelectAnswer = (questionIndex, label) => {
    if (!quizCompleted) {
      setAnswers((prev) => {
        const copy = [...prev];
        copy[questionIndex] = label;
        return copy;
      });
    }
  };

  const handleSubmit = () => {
    setQuizCompleted(true);
  };

  const handleTimeUp = () => {
    setTimeUp(true);
    setQuizCompleted(true);
  };

  const score = answers.filter((ans, i) => ans === questions[i].correct).length;

  return (
    <div className="w-full min-h-screen bg-gray-50 flex flex-col items-center p-4">
      <div className="w-full max-w-5xl flex flex-col md:flex-row gap-6">
        {/* Sidebar */}
        <div className="md:w-1/4 bg-white rounded-xl shadow p-4 flex flex-col items-center gap-4">
          <QuizTimer totalTime={TOTAL_TIME} onTimeUp={handleTimeUp} isPaused={quizCompleted} />
          <div className="grid grid-cols-5 gap-3 mt-4 w-full">
            {questions.map((_, idx) => (
              <div
                key={idx}
                className={`w-10 h-10 flex items-center justify-center rounded-full font-semibold ${
                  answers[idx] ? "bg-green-500 text-white" : "bg-gray-200 text-black"
                }`}
              >
                {idx + 1}
              </div>
            ))}
          </div>
        </div>

        {/* Questions Panel */}
        <div className="md:w-3/4 bg-white rounded-2xl shadow p-6 flex-1 space-y-6">
          {questions.map((q, qIndex) => (
            <div key={qIndex} className="border rounded-xl p-4">
              <p className="font-semibold mb-3">
                {qIndex + 1}. {q.text}
              </p>
              <div className="space-y-2">
                {q.options.map((opt) => (
                  <div
                    key={opt.label}
                    className={`flex items-center gap-3 border px-3 py-2 rounded-full cursor-pointer transition
                      ${
                        answers[qIndex] === opt.label
                          ? "bg-[#001489] text-white border-[#001489]"
                          : "hover:bg-[#001489] hover:text-white border-gray-300"
                      }`}
                    onClick={() => handleSelectAnswer(qIndex, opt.label)}
                  >
                    <span
                      className={`w-8 h-8 flex items-center justify-center rounded-full font-bold ${
                        answers[qIndex] === opt.label ? "bg-white text-[#001489]" : "bg-gray-200 text-[#001489]"
                      }`}
                    >
                      {opt.label}
                    </span>
                    <span>{opt.text}</span>
                  </div>
                ))}
              </div>
            </div>
          ))}

          {!quizCompleted && (
            <button
              onClick={handleSubmit}
              className="bg-[#001489] text-white px-6 py-2 rounded-2xl hover:bg-blue-800 transition font-semibold mt-4"
            >
              Submit Quiz
            </button>
          )}
        </div>
      </div>

      {/* Modal */}
      {quizCompleted && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50 p-4">
          <div className="bg-white rounded-3xl shadow-2xl p-8 w-full max-w-3xl text-center animate-fadeIn overflow-y-auto max-h-[90vh]">
            <h2 className="text-4xl font-bold text-[#001489] mb-4">
              {timeUp ? "Time's Up!" : "Quiz Completed!"}
            </h2>
            <p className="text-2xl font-semibold mb-6">Your Score: {score} / {questions.length}</p>
            <div className="space-y-3 mb-6">
              {questions.map((q, i) => (
                <div key={i} className="border p-3 rounded-lg text-left">
                  <p className="font-semibold">{i + 1}. {q.text}</p>
                  <p>
                    Your answer:{" "}
                    <span className={answers[i] === q.correct ? "text-green-600" : "text-red-600"}>
                      {answers[i] || "Not Answered"}
                    </span>
                  </p>
                  <p>
                    Correct answer: <span className="text-green-600">{q.correct}</span>
                  </p>
                </div>
              ))}
            </div>
            <div className="flex justify-center gap-4">
              <button
                onClick={() => window.location.reload()}
                className="bg-[#001489] text-white px-6 py-2 rounded-2xl hover:bg-blue-800 transition font-semibold"
              >
                Retry Quiz
              </button>
            </div>
          </div>
        </div>
      )}

      <style>{`
        @keyframes fadeIn {
          from {opacity:0; transform: translateY(-20px);}
          to {opacity:1; transform: translateY(0);}
        }
        .animate-fadeIn { animation: fadeIn 0.5s ease-in-out; }
      `}</style>
    </div>
  );
};

export default QuizUI;
