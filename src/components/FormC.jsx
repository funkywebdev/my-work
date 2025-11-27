import React from "react";
import { ArrowLeft } from "lucide-react"; 
import schoollogo from '../assets/images/schoollogo.png'
import { Check } from "lucide-react";


const FormC = ({ step, setStep }) => {
  const handleSubmit = () => {
    console.log("Form submitted!");
    // You can send data to backend here or navigate to success page
  };

  return (
    <div className="py-8 sm:px-20 px-4">
      
 
    <h1 className="font-semibold text-xl">Review & Submit</h1>
    <p className="text-gray-600">Review your information before submitting</p>

    <p className="bg-[#D0FFD9] text-[#05B125] px-3 py-2 rounded w-full mt-2 flex items-center gap-2">
      <Check size={18} />
      Almost Done!
    </p>


     {/* School Info */}
<div className="mt-6 p-4 rounded-lg bg-[#F9F9FB] border border-[#E5E7EB] shadow-sm">

  <h2 className="font-semibold text-lg mb-4">School Information</h2>

  {/* Row */}
  <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center mb-3">
    <p className="font-medium">School Logo:</p>
    <img src={schoollogo} className="w-12 h-12 bg-gray-200 rounded mt-1 sm:mt-0" />
  </div>

  <div className="flex flex-col sm:flex-row sm:justify-between mb-3">
    <p className="font-medium">School:</p>
    <p>Queen and King International School</p>
  </div>

  <div className="flex flex-col sm:flex-row sm:justify-between mb-3">
    <p className="font-medium">Contact:</p>
    <p>N0 13, Gbongan road Osogbo, Osun State</p>
  </div>

  <div className="flex flex-col sm:flex-row sm:justify-between">
    <p className="font-medium">Email:</p>
    <p>queenandking20@gmail.com</p>
  </div>
</div>


{/* Team Info */}
<div className="mt-4 p-4 rounded-lg bg-[#F9F9FB] border border-[#E5E7EB] shadow-sm">

  <h1 className="font-semibold text-lg mb-4">Team Information</h1>

  <div className="flex flex-col sm:flex-row sm:justify-between mb-3">
    <p className="font-medium">Team Name:</p>
    <p>Amazingly Squad</p>
  </div>

  <div className="flex flex-col sm:flex-row sm:justify-between mb-3">
    <p className="font-medium">School:</p>
    <p>Queen and King International School</p>
  </div>

  <div className="flex flex-col sm:flex-row sm:justify-between mb-3">
    <p className="font-medium">Contact:</p>
    <p>N0 13, Gbongan road Osogbo, Osun State</p>
  </div>

  <div className="flex flex-col sm:flex-row sm:justify-between">
    <p className="font-medium">Email:</p>
    <p>queenandking20@gmail.com</p>
  </div>
</div>

    

      {/* Buttons */}
      <div className="flex justify-between px-2 py-4">
        {/* BACK BUTTON */}
        <button
          onClick={() => setStep(step - 1)}
          className="flex items-center px-6 py-2 bg-[#F9F9FB] text-[#001489] border-[#E5E7EB] rounded hover:bg-[#001489] hover:text-white"
        >
          <ArrowLeft size={16} className="mr-2" />
          Back
        </button>

        {/* SUBMIT BUTTON */}
        <button
          onClick={handleSubmit}
          className="px-6 py-2 bg-[#001489] text-white rounded hover:bg-blue-800"
        >
          Submit
        </button>
      </div>
    </div>
  );
};

export default FormC;
