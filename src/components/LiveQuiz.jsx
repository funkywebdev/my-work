// import React, { useState, useEffect } from "react";
// import { motion } from "framer-motion";
// import schoollogo from "../assets/images/schoollogo.png";
// import Frame123 from "../assets/images/Frame123.png";

// // Timer component with clock icon
// const MatchTimer = ({ subject = "", startTime = 30 }) => {
//   const [timeLeft, setTimeLeft] = useState(startTime);

//   useEffect(() => {
//     if (timeLeft <= 0) return;

//     const interval = setInterval(() => {
//       setTimeLeft((prev) => (prev > 0 ? prev - 1 : 0));
//     }, 1000);

//     return () => clearInterval(interval);
//   }, [timeLeft]);

//   const rotation = ((startTime - timeLeft) / startTime) * 360;

//   return (
//     <motion.div
//       initial={{ opacity: 0, y: -20 }}
//       animate={{ opacity: 1, y: 0 }}
//       className="flex items-center gap-3"
//     >
//       <div className="relative w-12 h-12">
//         <svg viewBox="0 0 24 24" className="w-12 h-12 text-[#001489]">
//           <circle cx="12" cy="12" r="10" stroke="#001489" strokeWidth="2" fill="none" />
//           <line x1="12" y1="12" x2="12" y2="6" stroke="#001489" strokeWidth="2" />
//           <motion.line
//             x1="12"
//             y1="12"
//             x2="12"
//             y2="3"
//             stroke="#FF0000"
//             strokeWidth="2"
//             style={{ originX: 12, originY: 12 }}
//             animate={{ rotate: rotation }}
//             transition={{ ease: "linear", duration: 0.5 }}
//           />
//         </svg>
//         <span className="absolute inset-0 flex items-center justify-center font-bold text-sm">
//           {timeLeft > 0 ? `${timeLeft}s` : "⏰"}
//         </span>
//       </div>
//       <p className="font-semibold text-lg">{subject}</p>
//     </motion.div>
//   );
// };

// // Main Live Quiz Component
// const LiveQuiz = () => {
//   return (
//     <div className="py-10 px-4 sm:px-6 lg:px-8">
//       {/* Match Header */}
//       <div className="flex items-center justify-center gap-2 text-center mb-6">
//         <img src={Frame123} alt="Match" className="w-16 h-4" />
//         <span className="font-semibold text-[18px]">Quarter Final Match</span>
//       </div>

//       {/* Match Grid */}
//       <div className="grid grid-cols-3 sm:grid-cols-3 gap-4 items-center text-center mb-6">
//         {/* LEFT TEAM */}
//         <div>
//           <img src={schoollogo} alt="" className="w-14 mx-auto" />
//           <p className="font-semibold">Lagos Int’l School</p>
//           <p className="text-xl font-bold">0</p>
//           <p className="text-sm text-gray-600">Your Team</p>
//         </div>

//         {/* MIDDLE */}
//         <div className="space-y-3">
//           <p className="font-bold text-lg">VS</p>
//           <div className="w-full bg-gray-200 rounded-full h-3 overflow-hidden">
//             <motion.div
//               className="bg-[#001489] h-full rounded-full"
//               initial={{ width: 0 }}
//               animate={{ width: "40%" }}
//               transition={{ duration: 1 }}
//             />
//           </div>
//           <p className="text-sm">Question 1 of 10</p>
//         </div>

//         {/* RIGHT TEAM */}
//         <div>
//           <img src={schoollogo} alt="" className="w-14 mx-auto" />
//           <p className="font-semibold">Queen and King School</p>
//           <p className="text-xl font-bold">0</p>
//           <p className="text-sm text-gray-600">Opponent</p>
//         </div>
//       </div>

//       {/* Quiz Card */}
//       <div className="border border-[#C5CEFFFC] bg-white rounded-md p-6 max-w-[1200px] mx-auto shadow-md px-8">
//         {/* Header: Subject + Timer */}
//         <div className="flex flex-col sm:flex-row justify-between items-center mb-4 gap-2">
//           <div className="bg-[#C5CEFF4A] px-4 py-1 rounded-full text-[#001489]">
//             <p className="font-thin text-lg">Mathematics</p>
//           </div>
//           <MatchTimer startTime={30} />
//         </div>

//         {/* Question */}
//         <p className="font-semibold text-lg mb-4 text-center sm:text-left">
//           What is the derivative of f(x) = x³ + 2x² - 5x + 3?
//         </p>

//         {/* Answers */}
//         <div className="space-y-3">
//           {[
//             { label: "A", text: "3x² + 4x - 5" },
//             { label: "B", text: "3x² + 2x - 5" },
//             { label: "C", text: "3x² + 4x - 5" },
//             { label: "D", text: "3x² + x - 5" },
//           ].map((answer) => (
//             <div
//               key={answer.label}
//               className="flex items-center gap-3 border border-[#C5CEFFFC] rounded-full px-4 py-2 hover:bg-[#001489] hover:text-white transition cursor-pointer"
//             >
//               <span className="flex items-center justify-center w-8 h-8 bg-[#C5CEFFFC] text-[#001489] rounded-full font-bold text-center">
//                 {answer.label}
//               </span>
//               <span className="flex-1">{answer.text}</span>
//             </div>
//           ))}
//         </div>
//       </div>
//       <div className="flex justify-center mt-6">
//         <button className="bg-[#001489] text-white font-semibold px-6 py-2 rounded-md hover:bg-[#0022b3] transition-colors duration-300">
//             Next Question
//         </button>
//         </div>

//     </div>
//   );
// };

// export default LiveQuiz;


// import React, { useState, useEffect } from "react";
// import { motion } from "framer-motion";
// import schoollogo from "../assets/images/schoollogo.png";
// import Frame123 from "../assets/images/Frame123.png";

// // Timer component
// const MatchTimer = ({ startTime = 30, onTimeUp }) => {
//   const [timeLeft, setTimeLeft] = useState(startTime);

//   useEffect(() => {
//     if (timeLeft <= 0) {
//       onTimeUp && onTimeUp();
//       return;
//     }

//     const interval = setInterval(() => {
//       setTimeLeft((prev) => (prev > 0 ? prev - 1 : 0));
//     }, 1000);

//     return () => clearInterval(interval);
//   }, [timeLeft]);

//   const rotation = ((startTime - timeLeft) / startTime) * 360;

//   return (
//     <motion.div className="flex items-center gap-3">
//       <div className="relative w-12 h-12">
//         <svg viewBox="0 0 24 24" className="w-12 h-12 text-[#001489]">
//           <circle cx="12" cy="12" r="10" stroke="#001489" strokeWidth="2" fill="none" />
//           <motion.line
//             x1="12"
//             y1="12"
//             x2="12"
//             y2="3"
//             stroke={timeLeft <= 5 ? "red" : "#FF0000"}
//             strokeWidth="2"
//             style={{ originX: 12, originY: 12 }}
//             animate={{ rotate: rotation }}
//             transition={{ ease: "linear", duration: 0.5 }}
//           />
//         </svg>
//         <span className="absolute inset-0 flex items-center justify-center font-bold text-sm">
//           {timeLeft > 0 ? `${timeLeft}s` : "⏰"}
//         </span>
//       </div>
//     </motion.div>
//   );
// };

// // Sample questions
// const sampleQuestions = [
//   {
//     questionText: "What is the derivative of f(x) = x³ + 2x² - 5x + 3?",
//     category: "Mathematics",
//     options: [
//       { label: "A", text: "3x² + 4x - 5" },
//       { label: "B", text: "3x² + 2x - 5" },
//       { label: "C", text: "3x² + 4x - 5" },
//       { label: "D", text: "3x² + x - 5" },
//     ],
//     correctAnswer: "A",
//     explanation: "The derivative is 3x² + 4x - 5",
//   },
//   {
//     questionText: "Value of π (pi) approximately?",
//     category: "Mathematics",
//     options: [
//       { label: "A", text: "3.14" },
//       { label: "B", text: "2.71" },
//       { label: "C", text: "1.61" },
//       { label: "D", text: "4.20" },
//     ],
//     correctAnswer: "A",
//     explanation: "π is approximately 3.14159",
//   },
// ];

// const LiveQuiz = () => {
//   const [currentIndex, setCurrentIndex] = useState(0);
//   const [selectedAnswer, setSelectedAnswer] = useState(null);
//   const [score, setScore] = useState(0);
//   const currentQuestion = sampleQuestions[currentIndex];

//   const handleAnswer = (label) => {
//     if (selectedAnswer) return; // Prevent multiple clicks
//     setSelectedAnswer(label);
//     if (label === currentQuestion.correctAnswer) setScore((prev) => prev + 1);
//   };

//   const nextQuestion = () => {
//     setSelectedAnswer(null);
//     if (currentIndex < sampleQuestions.length - 1) setCurrentIndex(currentIndex + 1);
//   };

//   const previousQuestion = () => {
//     setSelectedAnswer(null);
//     if (currentIndex > 0) setCurrentIndex(currentIndex - 1);
//   };

//   const submitQuiz = () => {
//     alert(`Quiz Submitted! Your score: ${score}/${sampleQuestions.length}`);
//   };

//   const handleTimeUp = () => {
//     setSelectedAnswer("Time Up!");
//     nextQuestion();
//   };

//   return (
//     <div className="py-10 px-4 sm:px-6 lg:px-8">
//       {/* Header */}
//       <div className="flex items-center justify-center gap-2 text-center mb-6">
//         <img src={Frame123} alt="Match" className="w-16 h-4" />
//         <span className="font-semibold text-[18px]">Live Quiz</span>
//       </div>

//       {/* Progress Bar */}
//       <div className="w-full bg-gray-200 rounded-full h-3 mb-4">
//         <div
//           className="bg-[#001489] h-full rounded-full transition-all duration-500"
//           style={{ width: `${((currentIndex + 1) / sampleQuestions.length) * 100}%` }}
//         />
//       </div>
//       <p className="text-center mb-4 font-semibold">
//         Question {currentIndex + 1} of {sampleQuestions.length}
//       </p>

//       {/* Quiz Card */}
//       <div className="border border-[#C5CEFFFC] bg-white rounded-md p-6 max-w-[800px] mx-auto shadow-md">
//         {/* Header */}
//         <div className="flex flex-col sm:flex-row justify-between items-center mb-4 gap-2">
//           <div className="bg-[#C5CEFF4A] px-4 py-1 rounded-full text-[#001489]">
//             <p className="font-thin text-lg">{currentQuestion.category}</p>
//           </div>
//           <MatchTimer startTime={30} onTimeUp={handleTimeUp} />
//         </div>

//         {/* Question */}
//         <p className="font-semibold text-lg mb-4">{currentQuestion.questionText}</p>

//         {/* Answers */}
//         <div className="space-y-3">
//           {currentQuestion.options.map((answer) => (
//             <div
//               key={answer.label}
//               onClick={() => handleAnswer(answer.label)}
//               className={`flex items-center gap-3 border rounded-full px-4 py-2 cursor-pointer transition ${
//                 selectedAnswer === answer.label
//                   ? answer.label === currentQuestion.correctAnswer
//                     ? "bg-green-500 text-white"
//                     : "bg-red-500 text-white"
//                   : "border-[#C5CEFFFC] hover:bg-[#001489] hover:text-white"
//               }`}
//             >
//               <span className="flex items-center justify-center w-8 h-8 bg-[#C5CEFFFC] text-[#001489] rounded-full font-bold text-center">
//                 {answer.label}
//               </span>
//               <span className="flex-1">{answer.text}</span>
//             </div>
//           ))}
//         </div>

//         {/* Explanation */}
//         {selectedAnswer && selectedAnswer !== "Time Up!" && (
//           <p className="mt-3 text-sm text-gray-700">{currentQuestion.explanation}</p>
//         )}
//       </div>

//       {/* Navigation Buttons */}
//       <div className="flex justify-center mt-6 gap-4">
//         <button
//           onClick={previousQuestion}
//           className="bg-gray-300 text-black px-6 py-2 rounded-md hover:bg-gray-400"
//           disabled={currentIndex === 0}
//         >
//           Previous
//         </button>
//         {currentIndex < sampleQuestions.length - 1 ? (
//           <button
//             onClick={nextQuestion}
//             className="bg-[#001489] text-white px-6 py-2 rounded-md hover:bg-[#0022b3]"
//           >
//             Next
//           </button>
//         ) : (
//           <button
//             onClick={submitQuiz}
//             className="bg-green-600 text-white px-6 py-2 rounded-md hover:bg-green-700"
//           >
//             Submit
//           </button>
//         )}
//       </div>

//       {/* Score */}
//       <p className="text-center mt-4 font-semibold">
//         Score: {score} / {sampleQuestions.length}
//       </p>
//     </div>
//   );
// };

// export default LiveQuiz;


import React, { useState, useEffect } from "react";
import { motion } from "framer-motion";
import schoollogo from "../assets/images/schoollogo.png";
import Frame123 from "../assets/images/Frame123.png";

// Timer component
const MatchTimer = ({ startTime = 30, onTimeUp }) => {
  const [timeLeft, setTimeLeft] = useState(startTime);

  useEffect(() => {
    if (timeLeft <= 0) {
      onTimeUp && onTimeUp();
      return;
    }
    const interval = setInterval(() => {
      setTimeLeft(prev => (prev > 0 ? prev - 1 : 0));
    }, 1000);
    return () => clearInterval(interval);
  }, [timeLeft]);

  const rotation = ((startTime - timeLeft) / startTime) * 360;

  return (
    <motion.div className="flex items-center gap-3">
      <div className="relative w-10 h-10 sm:w-12 sm:h-12">
        <svg viewBox="0 0 24 24" className="w-full h-full text-[#001489]">
          <circle cx="12" cy="12" r="10" stroke="#001489" strokeWidth="2" fill="none" />
          <motion.line
            x1="12"
            y1="12"
            x2="12"
            y2="3"
            stroke={timeLeft <= 5 ? "red" : "#FF0000"}
            strokeWidth="2"
            style={{ originX: 12, originY: 12 }}
            animate={{ rotate: rotation }}
            transition={{ ease: "linear", duration: 0.5 }}
          />
        </svg>
        <span className="absolute inset-0 flex items-center justify-center font-bold text-xs sm:text-sm">
          {timeLeft > 0 ? `${timeLeft}s` : "⏰"}
        </span>
      </div>
    </motion.div>
  );
};

// Sample questions
const sampleQuestions = [
  {
    questionText: "What is the derivative of f(x) = x³ + 2x² - 5x + 3?",
    category: "Mathematics",
    options: [
      { label: "A", text: "3x² + 4x - 5" },
      { label: "B", text: "3x² + 2x - 5" },
      { label: "C", text: "3x² + 4x - 5" },
      { label: "D", text: "3x² + x - 5" },
    ],
    correctAnswer: "A",
    explanation: "The derivative is 3x² + 4x - 5",
  },
  {
    questionText: "Value of π (pi) approximately?",
    category: "Mathematics",
    options: [
      { label: "A", text: "3.14" },
      { label: "B", text: "2.71" },
      { label: "C", text: "1.61" },
      { label: "D", text: "4.20" },
    ],
    correctAnswer: "A",
    explanation: "π is approximately 3.14159",
  },
];

const LiveQuiz = () => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [selectedAnswer, setSelectedAnswer] = useState(null);
  const [score, setScore] = useState(0);
  const currentQuestion = sampleQuestions[currentIndex];

  const handleAnswer = (label) => {
    if (selectedAnswer) return;
    setSelectedAnswer(label);
    if (label === currentQuestion.correctAnswer) setScore(prev => prev + 1);
  };

  const nextQuestion = () => {
    setSelectedAnswer(null);
    if (currentIndex < sampleQuestions.length - 1) setCurrentIndex(currentIndex + 1);
  };

  const previousQuestion = () => {
    setSelectedAnswer(null);
    if (currentIndex > 0) setCurrentIndex(currentIndex - 1);
  };

  const submitQuiz = () => {
    alert(`Quiz Submitted! Your score: ${score}/${sampleQuestions.length}`);
  };

  const handleTimeUp = () => {
    setSelectedAnswer("Time Up!");
    nextQuestion();
  };

  return (
    <div className="py-10 px-4 sm:px-6 lg:px-8">
      {/* Header */}
      <div className="flex items-center justify-center gap-2 text-center mb-6">
        <img src={Frame123} alt="Match" className="w-16 h-4" />
        <span className="font-semibold text-[18px]">Live Quiz</span>
      </div>

      {/* Teams & Progress Bar */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between max-w-6xl mx-auto mb-6 gap-4">
        {/* Team A */}
        <div className="flex flex-col items-center">
          <img src={schoollogo} alt="Team A" className="w-14" />
          <p className="font-semibold mt-1 text-center sm:text-left">Lagos Int’l School</p>
          <p className="text-xl font-bold mt-1 text-[#001489]">0</p>
          <p className="mt-1 text-sm">Your Team</p>
        </div>

        {/* Progress Bar */}
        <div className="flex-1 mx-0 sm:mx-4">
          <div className="w-full bg-gray-200 rounded-full h-3">
            <div
              className="bg-[#001489] h-full rounded-full transition-all duration-500"
              style={{ width: `${((currentIndex + 1) / sampleQuestions.length) * 100}%` }}
            />
          </div>
          <p className="text-center mt-1 text-sm">
            Question {currentIndex + 1} of {sampleQuestions.length}
          </p>
        </div>

        {/* Team B */}
        <div className="flex flex-col items-center">
          <img src={schoollogo} alt="Team B" className="w-14" />
          <p className="font-semibold mt-1 text-center sm:text-right">Queen and King School</p>
          <p className="text-xl font-bold mt-1 text-[#001489]">0</p>
          <p className="mt-1 text-sm">Opponent</p>
        </div>
      </div>

      {/* Quiz Card */}
      <div className="border border-[#C5CEFFFC] bg-white rounded-md p-4 sm:p-6 max-w-6xl mx-auto shadow-md">
        {/* Header */}
        <div className="flex flex-col sm:flex-row justify-between items-center mb-4 gap-2">
          <div className="bg-[#C5CEFF4A] px-4 py-1 rounded-full text-[#001489]">
            <p className="font-thin text-lg">{currentQuestion.category}</p>
          </div>
          <MatchTimer startTime={30} onTimeUp={handleTimeUp} />
        </div>

        {/* Question */}
        <p className="font-semibold text-base sm:text-lg mb-4">{currentQuestion.questionText}</p>

        {/* Answers */}
        <div className="space-y-2 sm:space-y-3">
          {currentQuestion.options.map(answer => (
            <div
              key={answer.label}
              onClick={() => handleAnswer(answer.label)}
              className={`flex items-center gap-3 border rounded-full px-3 sm:px-4 py-2 cursor-pointer transition ${
                selectedAnswer === answer.label
                  ? answer.label === currentQuestion.correctAnswer
                    ? "bg-green-500 text-white"
                    : "bg-red-500 text-white"
                  : "border-[#C5CEFFFC] hover:bg-[#001489] hover:text-white"
              }`}
            >
              <span className="flex items-center justify-center w-6 h-6 sm:w-8 sm:h-8 bg-[#C5CEFFFC] text-[#001489] rounded-full font-bold text-center">
                {answer.label}
              </span>
              <span className="flex-1 text-sm sm:text-base">{answer.text}</span>
            </div>
          ))}
        </div>

        {/* Explanation */}
        {selectedAnswer && selectedAnswer !== "Time Up!" && (
          <p className="mt-2 sm:mt-3 text-sm text-gray-700">{currentQuestion.explanation}</p>
        )}
      </div>

      {/* Navigation Buttons */}
      <div className="flex flex-col sm:flex-row justify-center mt-4 sm:mt-6 gap-3 sm:gap-4">
        <button
          onClick={previousQuestion}
          className="bg-gray-300 text-black px-6 py-2 rounded-md hover:bg-gray-400"
          disabled={currentIndex === 0}
        >
          Previous
        </button>
        {currentIndex < sampleQuestions.length - 1 ? (
          <button
            onClick={nextQuestion}
            className="bg-[#001489] text-white px-6 py-2 rounded-md hover:bg-[#0022b3]"
          >
            Next
          </button>
        ) : (
          <button
            onClick={submitQuiz}
            className="bg-[#0022b3] text-white px-6 py-2 rounded-md hover:bg-green-700"
          >
            Submit
          </button>
        )}
      </div>

      {/* Score */}
      <p className="text-center mt-4 font-semibold">
        Score: {score} / {sampleQuestions.length}
      </p>
    </div>
  );
};

export default LiveQuiz;
