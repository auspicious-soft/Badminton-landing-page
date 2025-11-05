import React, { useState } from "react";
import OtpVerification from "./OtpVerification";

type Step = "email" | "phone" | "done";

interface VerifyAccountScreenProps {
  onComplete: () => void;
}

const VerifyAccountScreen: React.FC<VerifyAccountScreenProps> = ({ onComplete }) => {
  const [step, setStep] = useState<Step>("email");


  const handleBothVerified = () => {
    setStep("done");
    setTimeout(() => {
      onComplete(); // e.g. navigate("/venues")
    }, 1500);
  };

const handleNext = () => {
    if (step === "email") setStep("phone");
    else if (step === "phone") handleBothVerified();
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-[calc(100dvh-120px)] p-4">
   {step === "email" && (
        <OtpVerification type="email" onVerified={handleNext} onBothVerified={handleBothVerified} />
      )}
      {step === "phone" && (
        <OtpVerification type="phone" onVerified={handleNext} onBothVerified={handleBothVerified} />
      )}
      {/* Done step */}
      {step === "done" && (
        <div className="flex flex-col items-center gap-4 animate-fadeIn">
          <svg
            className="w-20 h-20 text-green-600"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"
            />
          </svg>
    
        </div>
      )}
    </div>
  );
};

export default VerifyAccountScreen;