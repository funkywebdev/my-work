
import React, { useState } from "react";
import FormA from "./SchoolInformation";
import FormB from "./FormB";
import FormC from "./FormC";
import ProgressBar from "../components/ProgressBar";

const Registration = () => {
  const [step, setStep] = useState(1);
  const [schoolData, setSchoolData] = useState();

  console.log(schoolData);

  return (
    <div>

     <ProgressBar step={step} />

      {step === 1 && (
        <FormA
          step={step}
          setStep={setStep}
          setSchoolData={setSchoolData}
        />
      )}

      {step === 2 && (
        <FormB
          step={step}
          setStep={setStep}
          schoolData={schoolData}
        />
      )}

      {step === 3 && (
        <FormC
          step={step}
          setStep={setStep}
          formData={formData}
        />
      )}
    </div>
  );
};

export default Registration;
