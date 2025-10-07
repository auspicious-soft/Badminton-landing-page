import React, { useState, useRef, useEffect } from "react";
import { postApi } from "../../utils/api";
import { URLS } from "../../utils/urls";
import { motion, AnimatePresence } from "framer-motion";
import Loader from "./Loader";
import { useAuth } from "../../utils/AuthContext";

interface VerifyPhoneModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (phone: string) => void;
}

const VerifyPhoneModal: React.FC<VerifyPhoneModalProps> = ({
  isOpen,
  onClose,
  onSubmit,
}) => {
  const [phone, setPhone] = useState<string>("");
  const [otp, setOtp] = useState<string[]>(Array(6).fill(""));
  const [step, setStep] = useState<"enterPhone" | "enterOTP">("enterPhone");
  const [error, setError] = useState<string | null>(null);
  const [isApiSuccess, setIsApiSuccess] = useState<boolean>(false);
  const [loading, setLoading] = useState(false);
  const { updateUserData } = useAuth();
  const otpRefs = useRef<HTMLInputElement[]>([]);

  const handlePhoneSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!phone) {
      setError("Please enter your phone number.");
      return;
    }
    setLoading(true);
    try {
      const res = await postApi(URLS.submitPhoneNumber, { phoneNumber:phone });
      if (res.status === 200) {
        setStep("enterOTP");
        setError(null);
      } else {
        setError("");
      }
    } catch (err:any) {
      console.error("Error sending phone number:", err);
      setError(err.response.data.message);
    } finally {
      setLoading(false);
    }
  };

const handleOtpChange = (index: number, value: string) => {
  // allow only digits
  if (!/^\d?$/.test(value)) return;

  const newOtp = [...otp];
  newOtp[index] = value;
  setOtp(newOtp);

  if (value && index < 5) {
    otpRefs.current[index + 1]?.focus();
  }
};

  const handleOtpKeyDown = (index: number, e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Backspace" && !otp[index] && index > 0) {
      otpRefs.current[index - 1]?.focus();
    }
  };

  const handleOtpPaste = (e: React.ClipboardEvent<HTMLInputElement>) => {
    const pasteData = e.clipboardData.getData("text").slice(0, 6).split("");
    const newOtp = [...otp];
    pasteData.forEach((char, i) => {
      if (i < 6) newOtp[i] = char;
    });
    setOtp(newOtp);
    const lastFilledIndex = pasteData.length - 1;
    if (lastFilledIndex < 5) {
      otpRefs.current[lastFilledIndex]?.focus();
    } else {
      otpRefs.current[5]?.focus();
    }
  };

  const handleOtpSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const otpCode = otp.join("");
    if (otpCode.length !== 6) {
      setError("Please enter a 6-digit OTP.");
      return;
    }
    setLoading(true);
    try {
      const response = await postApi(URLS.verifyPhoneNumber, { phone, otp: otpCode });
      if (response.status === 200) {
        setIsApiSuccess(true);
        updateUserData({
          phoneVerified: true,
          phone,
        });
        onSubmit(phone);
        setPhone("");
        setOtp(Array(6).fill(""));
        setStep("enterPhone");
        onClose();
      } else {
       setError("Invalid OTP. Please try again.");
  const empty = Array(6).fill("");
  setOtp(empty);

  // also clear the actual input values
  otpRefs.current.forEach((input) => {
    if (input) input.value = "";
  });

  // focus back to first input
  otpRefs.current[0]?.focus();
    }
    } catch (err) {
      console.error("Error verifying OTP:", err);
      setError("Failed to verify. Please try again.");
       const empty = Array(6).fill("");
  setOtp(empty);

  // also clear the actual input values
  otpRefs.current.forEach((input) => {
    if (input) input.value = "";
  });

  // focus back to first input
  otpRefs.current[0]?.focus();
      setIsApiSuccess(false);
    } finally {
      setLoading(false);
    }
  };

  const handleClose = () => {
    if (isApiSuccess) {
      onClose();
    } else {
      setError("Please complete the verification before closing.");
    }
  };

  useEffect(() => {
    if (step === "enterOTP" && otpRefs.current[0]) {
      otpRefs.current[0].focus();
    }
  }, [step]);

  if (!isOpen) return null;

  return (
    <>
      {loading && <Loader fullScreen />}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        transition={{ duration: 0.3 }}
        className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50 backdrop-blur-2xl"
      >
       <motion.div
  initial={{ scale: 0.8, y: 50 }}
  animate={{ scale: 1, y: 0 }}
  transition={{ duration: 0.3, ease: "easeOut" }}
  className={`bg-white rounded-lg shadow-xl p-4 sm:p-6 w-full max-w-md sm:max-w-lg mx-4 sm:mx-0 ${
    step === "enterOTP" ? "min-h-[400px]" : "min-h-[300px]"
  } transition-all duration-300`}
>
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-dark-blue text-lg sm:text-xl font-semibold font-['Raleway']">
              Verify Phone Number
            </h2>
            <button
              onClick={handleClose}
              className={`text-gray-600 hover:text-gray-800 text-lg sm:text-xl font-bold ${
                !isApiSuccess ? "opacity-50 cursor-not-allowed" : ""
              }`}
              disabled={!isApiSuccess}
            >
              &times;
            </button>
          </div>
          {step === "enterPhone" ? (
            <form onSubmit={handlePhoneSubmit} className="flex flex-col gap-6">
              <div className="mb-4 flex flex-col gap-4">
                <label className="block text-gray-600 text-sm sm:text-base font-medium font-['Raleway'] mb-2">
                  Please Enter your Phone number
                </label>
                <input
                  type="tel"
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                  className="w-full px-3 py-2 rounded-md text-sm sm:text-base font-['Raleway'] bg-white border border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500"
                  placeholder="Enter your phone number"
                  required
                />
              </div>
              {error && (
                <div className="text-red-600 text-sm sm:text-base font-medium font-['Raleway'] mb-4">
                  {error}
                </div>
              )}
              <div className="flex justify-center">
                <button
                  type="submit"
                  className="w-full px-4 py-2 rounded-md text-sm sm:text-base font-medium font-['Raleway'] bg-blue-600 text-white hover:bg-blue-700 transition-colors duration-200"
                >
                  Submit
                </button>
              </div>
            </form>
          ) : (
            <form onSubmit={handleOtpSubmit} className="flex flex-col gap-6">
              <div className="mb-4 flex flex-col gap-4">
                <label className="block text-gray-600 text-sm sm:text-base font-medium font-['Raleway'] mb-2">
                  Please verify OTP
                </label>
                <div className="flex justify-between gap-2">
                  {otp.map((digit, index) => (
                    <input
                      key={index}
                      type="numeric"
                      value={digit}
                      onChange={(e) => handleOtpChange(index, e.target.value)}
                      onKeyDown={(e) => handleOtpKeyDown(index, e)}
                      onPaste={index === 0 ? handleOtpPaste : undefined}
                      maxLength={1}
                      ref={(el) => (otpRefs.current[index] = el!)}
                      className="w-full px-3 py-2 rounded-md text-sm sm:text-base font-['Raleway'] bg-white border border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500 text-center"
                      required
                    />
                  ))}
                </div>
              </div>
              {error && (
                <div className="text-red-600 text-sm sm:text-base font-medium font-['Raleway'] mb-4">
                  {error}
                </div>
              )}
              <div className="flex justify-center">
                <button
                  type="submit"
                  className="w-full px-4 py-2 rounded-md text-sm sm:text-base font-medium font-['Raleway'] bg-blue-600 text-white hover:bg-blue-700 transition-colors duration-200"
                >
                  Verify
                </button>
              </div>
            </form>
          )}
        </motion.div>
      </motion.div>
    </>
  );
};

export default VerifyPhoneModal;