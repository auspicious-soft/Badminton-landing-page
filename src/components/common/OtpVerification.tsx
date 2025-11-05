import React, { useState, useEffect } from "react";
import { postOtpApi } from "../../utils/api";
import { useToast } from "../../utils/ToastContext";
import { URLS } from "../../utils/urls";
import { useAuth } from "../../utils/AuthContext";

type OtpType = "email" | "phone";

interface OtpVerificationProps {
  type: OtpType;
  onVerified: () => void;
  onBothVerified?: () => void; // ← NEW: called after both OTPs done
}

const OtpVerification: React.FC<OtpVerificationProps> = ({
  type,
  onVerified,
  onBothVerified,
}) => {
  const [otp, setOtp] = useState("");
  const [loading, setLoading] = useState(false);
  const [resendLoading, setResendLoading] = useState(false);
  const [countdown, setCountdown] = useState(60); // 60 seconds
  const [resendCooldown, setResendCooldown] = useState(60);
  const [canResend, setCanResend] = useState(false);
  const { login } = useAuth();

  const { successToast, errorToast } = useToast();

  // Countdown timer
  useEffect(() => {
    if (countdown > 0) {
      const timer = setTimeout(() => setCountdown(countdown - 1), 1000);
      setCanResend(false);
      return () => clearTimeout(timer);
    } else {
      setCanResend(true);
    }
  }, [countdown]);

  // Format seconds → MM:SS
  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins.toString().padStart(2, "0")}:${secs
      .toString()
      .padStart(2, "0")}`;
  };

  const handleVerify = async () => {
    if (!otp.trim()) {
      return errorToast("Please enter the OTP");
    }
    if (otp.length !== 6) {
      return errorToast("OTP must be exactly 6 digits");
    }
    setLoading(true);
    try {
      const payload = {
        [type === "email" ? "emailOtp" : "phoneOtp"]: otp,
      };
      const { status, data } = await postOtpApi(URLS.verifyOtp, payload);

      if (status === 200) {
        successToast(`${type === "email" ? "Email" : "Phone"} verified!`);
        onVerified();

        if (type === "phone" && onBothVerified) {
          localStorage.removeItem("verificationToken");
          localStorage.removeItem("signupEmail");
          localStorage.removeItem("signupPhone");

          const userData = data?.data;
          if (userData) {
            login(userData);
          }
          onBothVerified();
        }
      } else {
        errorToast(data?.message ?? "Invalid OTP");
        setOtp("");
      }
    } catch (err: any) {
      errorToast(err.response?.data?.message ?? "Verification failed");
      setOtp("");
    } finally {
      setLoading(false);
    }
  };

  const handleResend = async () => {
    if (!canResend) return;
    setResendLoading(true);

    try {
      const signupEmail = localStorage.getItem("signupEmail");
      const signupPhone = localStorage.getItem("signupPhone");

      const payload: any = {};
      if (type === "email" && signupEmail) {
        payload.email = signupEmail;
      } else if (type === "phone" && signupPhone) {
        payload.phoneNumber = signupPhone;
      }

      const { status } = await postOtpApi(URLS.resendOtp, payload);

      if (status === 200) {
        successToast(`OTP resent to your ${type}`);
        const nextCooldown = resendCooldown === 60 ? 120 : resendCooldown; // 2 min
        setResendCooldown(nextCooldown);
        setCountdown(nextCooldown);
      } else {
        errorToast("Failed to resend OTP");
      }
    } catch (err: any) {
      errorToast(err.response?.data?.message ?? "Resend error");
    } finally {
      setResendLoading(false);
    }
  };

  return (
    <div
      className="
        flex flex-col items-center gap-6 
        p-8 sm:p-10 md:p-12 
        bg-white rounded-[28px] shadow-xl 
        w-full max-w-lg mx-auto 
        min-h-[420px] sm:min-h-[480px]
        border border-gray-100
      "
    >
      {/* Icon */}
      <div className="w-20 h-20 bg-blue-100 rounded-full flex items-center justify-center shadow-sm">
        <svg
          className="w-11 h-11 text-blue-600"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M3 8l9-6 9 6v10a2 2 0 01-2 2H5a2 2 0 01-2-2V8z"
          />
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M8 12h.01M12 12h.01M16 12h.01"
          />
        </svg>
      </div>

      {/* Title */}
      <h3 className="text-2xl sm:text-3xl font-bold text-gray-800 font-['Raleway'] text-center">
        Verify {type === "email" ? "Email" : "Phone"}
      </h3>

      {/* Subtitle */}
      <p className="text-sm sm:text-base text-gray-600 text-center font-['Raleway'] max-w-xs">
        We sent a <strong>6-digit code</strong> to your{" "}
        <span className="font-medium">
          {type === "email" ? "email" : "phone"}
        </span>
        .
        <br className="hidden sm:block" /> Enter it below to continue.
      </p>

      {/* OTP Input */}
      <input
        type="text"
        maxLength={6}
        placeholder="— — — — — —"
        value={otp}
        onChange={(e) => setOtp(e.target.value.replace(/\D/g, ""))}
        className="
          w-full max-w-xs h-12 text-center text-xl tracking-[0.5em]
          bg-gray-50 rounded-[66px] 
          outline outline-2 outline-gray-200
          focus:outline-2 focus:outline-blue-500 
          transition-all duration-200
          font-['Raleway'] font-medium
          placeholder:text-gray-300 placeholder:tracking-normal
        "
      />

      {/* Verify Button */}
      <button
        onClick={handleVerify}
        disabled={loading}
        className="
          w-full max-w-sm h-12 rounded-[66px] bg-blue-600 text-white
          font-semibold text-base font-['Raleway']
          flex items-center justify-center
          hover:bg-blue-700 active:bg-blue-800 
          transition-all duration-200
          disabled:bg-blue-400 disabled:cursor-not-allowed
          shadow-md hover:shadow-lg
        "
      >
        {loading ? "Verifying…" : "Verify OTP"}
      </button>

      {/* Resend Button with Countdown */}
      <div className="flex flex-col items-center gap-1">
        <button
          onClick={handleResend}
          disabled={!canResend || resendLoading}
          className={`
            text-sm sm:text-base font-['Raleway'] transition-all
            ${
              canResend
                ? "text-blue-600 hover:text-blue-700 underline underline-offset-2 cursor-pointer"
                : "text-gray-400 cursor-not-allowed"
            }
            ${resendLoading ? "opacity-70" : ""}
          `}
        >
          {resendLoading
            ? "Sending..."
            : canResend
            ? "Resend OTP"
            : `Resend in ${formatTime(countdown)}`}
        </button>
      </div>
    </div>
  );
};

export default OtpVerification;
