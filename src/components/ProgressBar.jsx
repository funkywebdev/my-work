import React from "react";
import { GraduationCap, Users, CheckCircle } from "lucide-react";

const ProgressBar = ({ step }) => {
  const steps = [
    { label: "School Info", icon: <GraduationCap size={20} /> },
    { label: "Team Details", icon: <Users size={20} /> },
    { label: "Confirmation", icon: <CheckCircle size={20} /> },
  ];

  const progressPercent = ((step - 1) / (steps.length - 1)) * 100;

  return (
    <div className="text-center my-4 px-4 sm:px-6">
      {/* Title */}
      <h1 className="text-2xl sm:text-3xl font-bold mb-2">School Registration</h1>
      <p className="mb-4 text-gray-600 font-medium text-[16px]">
        Register your school to compete in STEM Laague 2025
      </p>

      {/* Step Circles */}
      <div className="relative flex justify-between items-center max-w-3xl mx-auto">
        {steps.map((s, idx) => {
          const isCompleted = idx + 1 <= step;

          return (
            <div key={idx} className="flex flex-col items-center z-10 flex-1">
              <div
                className={`w-12 h-12 sm:w-14 sm:h-14 flex items-center justify-center rounded-full border-2 border-gray-400 transition-colors duration-300
                  ${isCompleted ? "bg-[#001489] text-white border-[#001489]" : "bg-white text-gray-400"}`}
              >
                {s.icon}
              </div>
              <p
                className={`mt-1 sm:mt-2 text-sm sm:text-base font-medium ${
                  isCompleted ? "text-[#001489]" : "text-gray-400"
                }`}
              >
                {s.label}
              </p>
            </div>
          );
        })}

        {/* Horizontal Progress Bar */}
        <div className="absolute top-6 left-0 w-full h-2 bg-gray-300 rounded z-0"></div>
        <div
          className="absolute top-6 left-0 h-2 bg-[#001489] rounded z-0 transition-all duration-500"
          style={{ width: `${progressPercent}%` }}
        ></div>
      </div>
    </div>
  );
};

export default ProgressBar;

