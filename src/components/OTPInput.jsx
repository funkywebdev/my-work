import { useRef, useState } from "react";

const OTPInput = ({ length = 4, onComplete }) => {
  const inputRef = useRef(Array(length).fill(null));
  const [OTP, setOTP] = useState(Array(length).fill(""));

  const handleTextChange = (input, index) => {
    const newPin = [...OTP];
    newPin[index] = input;
    setOTP(newPin);

    if (input.length === 1 && index < length - 1) {
      inputRef.current[index + 1]?.focus();
    }

    if (input.length === 0 && index > 0) {
      inputRef.current[index - 1]?.focus();
    }

    if (newPin.every((digit) => digit !== "")) {
      onComplete(newPin.join(""));
    }
  };

  return (
    <div className={`grid grid-cols-6 gap-5`}>
      {Array.from({ length }, (_, index) => (
        <input
          key={index}
          type="text"
          maxLength={1}
          value={OTP[index]}
          onChange={(e) => handleTextChange(e.target.value, index)}
          ref={(ref) => (inputRef.current[index] = ref)}
          className="w-14 h-14 text-center text-lg font-semibold border border-gray-300 rounded-lg
                 focus:outline-none focus:ring-2 focus:ring-primary focus:border-primary
                 transition-all duration-200 ease-in-out
                 hover:border-primary mx-auto"
        />
      ))}
    </div>
  );
};

export default OTPInput;
