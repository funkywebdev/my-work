import React, { useState, useEffect } from "react";

// ===============================
// Match Timer Component
// ===============================
const MatchTimer = ({ startTime = 30 }) => {
  const [timeLeft, setTimeLeft] = useState(startTime);

  useEffect(() => {
    if (timeLeft <= 0) return;

    const interval = setInterval(() => {
      setTimeLeft((prev) => (prev > 0 ? prev - 1 : 0));
    }, 1000);

    return () => clearInterval(interval);
  }, [timeLeft]);

  return (
    <div className="flex items-center gap-2">
      <p className="text-[#001489] font-semibold text-sm md:text-base">
        {timeLeft}s
      </p>
    </div>
  );
};

// ===============================
// Matches Component
// ===============================
const Matches = () => {
  return (
    <div className="w-full p-3 md:p-4">
      {/* Top Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2 w-full">
        <p className="font-semibold text-base md:text-2xl">Live Match Monitor</p>

        <div className="grid grid-cols-2 sm:grid-cols-2 items-center gap-2 w-full sm:w-auto">
          <p className="bg-[#FF004F] text-white text-[10px] md:text-[12px] px-2 py-1 rounded-md text-center">
            LIVE
          </p>
          <p className="bg-[#001489] text-white text-[10px] md:text-[12px] px-2 py-1 rounded-md text-center">
            Question 10 of 20
          </p>
        </div>
      </div>

      {/* Match Progress */}
      <div className="w-full py-4">
        <p className="font-semibold text-base mb-1">Match Progress</p>

        <div className="flex justify-between items-center mb-1">
          <p className="text-xs text-gray-600">Current Progress</p>
          <p className="text-xs font-medium">60%</p>
        </div>

        {/* Progress Bar */}
        <div className="w-full bg-gray-200 rounded-full h-2 mb-4">
          <div
            className="bg-[#001489] h-2 rounded-full"
            style={{ width: "60%" }}
          ></div>
        </div>

        {/* Question Box */}
        <div className="border border-[#C5CEFFFC] bg-white rounded-md p-4 md:p-6 max-w-[1200px] mx-auto shadow-md">
          
          {/* Subject & Timer */}
          <div className="flex flex-col sm:flex-row justify-between items-center mb-4 gap-3">
            <div className="text-center sm:text-left">
              <p className="font-semibold text-base sm:text-lg">Current Question</p>
              <p className="text-sm">Question 10 of 20</p>
            </div>

            <MatchTimer startTime={30} />
          </div>

          {/* Question */}
          <p className="font-semibold text-base sm:text-lg mb-4 text-center sm:text-left">
            What is the derivative of f(x) = x³ + 2x² - 5x + 3?
          </p>

          {/* Answers */}
          <div className="space-y-3">
            {[
              { label: "A", text: "3x² + 4x - 5" },
              { label: "B", text: "3x² + 2x - 5" },
              { label: "C", text: "3x² + 4x - 5" },
              { label: "D", text: "3x² + x - 5" },
            ].map((answer) => (
              <div
                key={answer.label}
                className="flex items-center gap-3 border border-[#C5CEFFFC] rounded-full px-3 py-2 sm:px-4 sm:py-2 hover:bg-[#001489] hover:text-white transition cursor-pointer"
              >
                <span className="flex items-center justify-center w-8 h-8 bg-[#C5CEFFFC] text-[#001489] rounded-full font-bold">
                  {answer.label}
                </span>
                <span className="flex-1 text-sm sm:text-base">{answer.text}</span>
              </div>
            ))}
          </div>
               <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 py-4 px-2">
          {[1, 2].map((card, idx) => (
            <div
              key={idx}
              className="border border-[#001489] shadow-md rounded-lg p-4 space-y-3 w-full"
            >
              {/* Card Header */}
              <div className="flex flex-col sm:flex-row justify-between font-semibold text-black rounded-md p-2 ">
                <p className="text-sm sm:text-base">Queen and King School</p>
                <p className="text-sm sm:text-base mt-1 sm:mt-0">1500 points</p>
              </div>

              {/* Card Items */}
              {[1, 2, 3].map((item, i) => (
                <div
                  key={i}
                  className="flex flex-col sm:flex-row justify-between items-start sm:items-center bg-[#AEB6E84A] rounded-md text-[#001489] px-3 py-2 text-sm sm:text-base"
                >
                <p>Alex Johnson</p>
                <p className="mt-1 sm:mt-0">8000 points</p>
              </div>
      ))}
    </div>
  ))}
</div>


        </div>
      </div>
    </div>
  );
};

export default Matches;
