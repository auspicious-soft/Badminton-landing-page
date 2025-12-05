import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import backgroundImage from "../assets/newbg.png";
import logoImage from "../assets/logo1.png";
import googleIcon from "../assets/googleIcon.png";
import { useGoogleLogin } from "@react-oauth/google";
import axios from "axios";
import { postApi } from "../utils/api";
import { URLS } from "../utils/urls";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../utils/AuthContext";
import { useToast } from "../utils/ToastContext";
import Loader from "../components/common/Loader";
import VerifyAccountScreen from "../components/common/VerifyAccountScreen";
import { Calendar, Eye, EyeOff } from "lucide-react";
import { getBrowserToken, requestNotificationPermission } from "../utils/firebase";

const Dashboard = () => {
  const navigate = useNavigate();
  const { login } = useAuth();
  const [loading, setLoading] = useState(false);
  const [isLogin, setIsLogin] = useState(true);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [name, setName] = useState({
    firstName: "",
    lastName: "",
    email: "",
    phoneNumber: "",
    countryCode: "+91",
    password: "",
    dob: "",
  });
  const [showVerification, setShowVerification] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const { successToast, errorToast } = useToast();

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (token) navigate("/venues");
  }, [navigate]);

 
 const loginWithGoogle = useGoogleLogin({
  onSuccess: async (tokenResponse) => {
    setLoading(true);
    try {
      const fcmToken = await getBrowserToken();
      console.log('fcmToken: ', fcmToken);
      const payload = {
        authType: "Google",
        accessToken: tokenResponse.access_token,
        fcmToken: fcmToken || "abcd",
      };

      const response = await postApi(`${URLS.socialLogin}`, payload);

      if (response?.status === 200) {
        const responseData = response.data.data;
        login(responseData);
        successToast("Login Successfully.");
        navigate("/venues");
      } else {
        errorToast("Error While Login, Please try Again");
      }
    } catch (err) {
      errorToast("Google login error");
    } finally {
      setLoading(false);
    }
  },

  onError: () => errorToast("Login Failed"),
});
useEffect(()=>{
  requestNotificationPermission()
},[])
  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
   const fcmToken = await getBrowserToken();
    if (isLogin) {
      if (!email.trim()) {
        errorToast("Please enter your email");
        return;
      }
      if (!password.trim()) {
        errorToast("Please enter your password");
        return;
      }

      setLoading(true);
      try {
        const payload = { email, password, authType: "Email-Phone",fcmToken: fcmToken || "abcd" };
        console.log('payload: ', payload);
        const response = await postApi(URLS.normalLogin, payload);

        if (response?.status === 200) {
          const userData = response.data.data;
          login(userData);
          successToast("Login Successful");
          navigate("/venues");
        } else {
          errorToast(response?.data?.message || "Invalid credentials");
        }
      } catch (err: any) {
        errorToast(err.response?.data?.message || "Something went wrong");
      } finally {
        setLoading(false);
      }
      return;
    }

    const errors: string[] = [];

    if (!name.firstName.trim()) errors.push("First Name");
    if (!name.lastName.trim()) errors.push("Last Name");
    if (!name.email.trim()) errors.push("Email");
    if (!name.phoneNumber.trim()) errors.push("Phone Number");
    if (!name.countryCode.trim()) errors.push("Country Code");
    if (!name.password.trim()) errors.push("Password");
    if (!name.dob) errors.push("Date of Birth");

    if (errors.length > 0) {
      errorToast(`Please fill in: ${errors.join(", ")}`);
      return;
    }

    // Optional: Basic format checks
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(name.email)) {
      errorToast("Please enter a valid email");
      return;
    }

    const phoneRegex = /^\d{10}$/;
    if (!phoneRegex.test(name.phoneNumber.replace(/\D/g, ""))) {
      errorToast("Phone number must be 10 digits");
      return;
    }

    if (name.password.length < 6) {
      errorToast("Password must be at least 6 characters");
      return;
    }

    setLoading(true);
    try {
      const payload = {
        firstName: name.firstName,
        lastName: name.lastName,
        email: name.email,
        phoneNumber: name.phoneNumber,
        countryCode: name.countryCode,
        password: name.password,
        dob: name.dob,
      };

      const response = await postApi(URLS.signUp, payload);

      if (response?.status === 200 || response?.status === 201) {
        successToast(
          "Account created successfully! Please verify your email & phone."
        );
        setShowVerification(true);

        const verificationToken = response?.data?.data?.token;
        if (verificationToken) {
          localStorage.setItem("verificationToken", verificationToken);
        }
        localStorage.setItem("signupEmail", payload.email);
        localStorage.setItem("signupPhone", payload.phoneNumber);
      } else {
        errorToast(response?.data?.message || "Signup failed");
      }
    } catch (err: any) {
      errorToast(err.response?.data?.message || "Something went wrong");
    } finally {
      setLoading(false);
    }
  };

  const containerVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: {
      opacity: 1,
      y: 0,
      transition: { duration: 0.4 },
    },
    exit: {
      opacity: 0,
      y: -20,
      transition: { duration: 0.3 },
    },
  };

  return (
    <>
      {loading && <Loader fullScreen />}
      <div
        className={`w-screen h-[100dvh] relative bg-[#e9f5ff] bg-cover bg-no-repeat bg-center no-scroll-root `}
        style={{ backgroundImage: `url(${backgroundImage})` }}
      >
        <div
          className={`absolute inset-0 flex justify-center items-center z-10 dashboard-container ${
            showVerification ? "backdrop-blur-lg" : ""
          }`}
        >
          {/* NOTE: login-box uses a fixed height based on viewport so it never overflows */}
          <div
            className={`${
              showVerification
                ? "w-full bg-none max-w-l p-6  "
                : "w-full max-w-md mx-4 bg-white rounded-[20px] flex flex-col justify-start items-center gap-4 sm:gap-6 login-box"
            }`}
            style={{
              padding: "0rem 2rem 0rem 2rem",
            }}
          >
            {/* Logo + Heading */}
            {showVerification ? (
              <VerifyAccountScreen onComplete={() => navigate("/venues")} />
            ) : (
              <>
                <div className="flex flex-col justify-start items-center gap-2 sm:gap-3">
                  <img
                    src={logoImage}
                    alt="Logo"
                    className="w-40 h-20 sm:w-60 sm:h-20 object-contain logo-img"
                  />
                  <AnimatePresence mode="wait">
                    <motion.div
                      key={isLogin ? "login-title" : "signup-title"}
                      initial={{ opacity: 0, y: -10 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: 10 }}
                      transition={{ duration: 0.3 }}
                      className="text-center text-dark-blue text-2xl sm:text-3xl font-semibold font-['Raleway'] mb-2 sm:mb-6"
                    >
                      {isLogin ? "Welcome Back" : "Create Account"}
                    </motion.div>
                  </AnimatePresence>
                </div>

                {/* Google Button + form container */}
                <motion.div
                  variants={containerVariants}
                  initial="hidden"
                  animate="visible"
                  exit="exit"
                  className={`w-full flex flex-col gap-2 hide-scrollbar ${
                    !isLogin ? "max-h-[60vh] overflow-y-auto p-2" : ""
                  }`}
                >
                  {isLogin ? (
                    <>
                      <motion.button
                        whileHover={{ scale: 1.02 }}
                        whileTap={{ scale: 0.98 }}
                        onClick={() => loginWithGoogle()}
                        className="w-full h-14 px-4 py-3 bg-white rounded-[66px] shadow-[0px_1px_2px_0px_rgba(228,229,231,0.24)] outline outline-1 outline-offset-[-1px] outline-gray-200 flex justify-center items-center gap-2.5 cursor-pointer hover:bg-blue-500 hover:shadow-lg transition-all duration-200 active:bg-blue-600 group"
                      >
                        <img
                          src={googleIcon}
                          alt="Google Icon"
                          className="w-6 h-6 object-contain"
                        />
                        <div className="text-black/60 font-medium font-['Raleway'] group-hover:text-white transition-colors duration-200">
                          {isLogin
                            ? "Sign in With Google"
                            : "Sign up With Google"}{" "}
                        </div>
                      </motion.button>

                      <div className="w-full flex items-center gap-4">
                        <div className="flex-1 h-[1px] bg-gray-200"></div>
                        <span className="text-gray-400 text-sm font-['Raleway']">
                          or
                        </span>
                        <div className="flex-1 h-[1px] bg-gray-200"></div>
                      </div>
                    </>
                  ) : (
                    <></>
                  )}
                  {/* Form */}
                  <form
                    onSubmit={handleSubmit}
                    className="w-full flex flex-col gap-3"
                  >
                    {/* Signup Fields */}
                    {!isLogin && (
                      <>
                        <div className="flex gap-2">
                          <input
                            type="text"
                            placeholder="First Name"
                            value={name.firstName || ""}
                            onChange={(e) =>
                              setName((prev) => ({
                                ...prev,
                                firstName: e.target.value,
                              }))
                            }
                            className="w-1/2 h-12 px-4 py-3 rounded-[66px] shadow-[0px_1px_2px_0px_rgba(228,229,231,0.24)] outline outline-1 outline-offset-[-1px] outline-gray-200 font-['Raleway'] text-black/80 placeholder:text-black/40 focus:outline-2 focus:outline-blue-500 transition-all duration-200"
                          />
                          <input
                            type="text"
                            placeholder="Last Name"
                            value={name.lastName || ""}
                            onChange={(e) =>
                              setName((prev) => ({
                                ...prev,
                                lastName: e.target.value,
                              }))
                            }
                            className="w-1/2 h-12 px-4 py-3 rounded-[66px] shadow-[0px_1px_2px_0px_rgba(228,229,231,0.24)] outline outline-1 outline-offset-[-1px] outline-gray-200 font-['Raleway'] text-black/80 placeholder:text-black/40 focus:outline-2 focus:outline-blue-500 transition-all duration-200"
                          />
                        </div>
                        <div className="flex gap-2">
                          <input
                            type="text"
                            placeholder="Country Code"
                            value={name.countryCode || ""}
                            className="w-1/3 h-12 px-4 py-3 rounded-[66px] shadow-[0px_1px_2px_0px_rgba(228,229,231,0.24)] outline outline-1 outline-offset-[-1px] outline-gray-200 font-['Raleway'] text-black/80 placeholder:text-black/40 focus:outline-2 focus:outline-blue-500 transition-all duration-200"
                          />
                          <input
                            type="tel"
                            placeholder="Phone Number"
                            value={name.phoneNumber || ""}
                            onChange={(e) =>
                              setName((prev) => ({
                                ...prev,
                                phoneNumber: e.target.value,
                              }))
                            }
                            className="w-2/3 h-12 px-4 py-3 rounded-[66px] shadow-[0px_1px_2px_0px_rgba(228,229,231,0.24)] outline outline-1 outline-offset-[-1px] outline-gray-200 font-['Raleway'] text-black/80 placeholder:text-black/40 focus:outline-2 focus:outline-blue-500 transition-all duration-200"
                          />
                        </div>
                        <input
                          type="email"
                          placeholder="Email"
                          value={name.email || ""}
                          onChange={(e) =>
                            setName((prev) => ({
                              ...prev,
                              email: e.target.value,
                            }))
                          }
                          className="w-full h-12 px-4 py-3 rounded-[66px] shadow-[0px_1px_2px_0px_rgba(228,229,231,0.24)] outline outline-1 outline-offset-[-1px] outline-gray-200 font-['Raleway'] text-black/80 placeholder:text-black/40 focus:outline-2 focus:outline-blue-500 transition-all duration-200"
                        />
                        <div className="relative">
                          <input
                            type={showPassword ? "text" : "password"}
                            placeholder="Password"
                            value={name.password || ""}
                            onChange={(e) =>
                              setName((prev) => ({
                                ...prev,
                                password: e.target.value,
                              }))
                            }
                            className="w-full h-12 px-4 py-3 pr-12 rounded-[66px] shadow-[0px_1px_2px_0px_rgba(228,229,231,0.24)] outline outline-1 outline-offset-[-1px] outline-gray-200 font-['Raleway'] text-black/80 placeholder:text-black/40 focus:outline-2 focus:outline-blue-500 transition-all duration-200"
                          />
                          <button
                            type="button"
                            onClick={() => setShowPassword(!showPassword)}
                            className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-500 hover:text-gray-700 transition-colors"
                          >
                            {showPassword ? (
                              <EyeOff size={20} />
                            ) : (
                              <Eye size={20} />
                            )}
                          </button>
                        </div>
                        
                        <div
                          className="relative mt-4 cursor-pointer"
                          onClick={() => {
                            const input = document.getElementById(
                              "dobInput"
                            ) as HTMLInputElement | null;
                            if (
                              input &&
                              typeof input.showPicker === "function"
                            ) {
                              input.showPicker();
                            } else {
                              input?.focus();
                            }
                          }}
                        >
                          <label
                            className={`
      absolute left-4 -top-3 z-10
      bg-white px-1 font-['Raleway'] text-sm leading-none
      pointer-events-none transition-colors duration-200
      ${name.dob ? "text-black" : "text-black/40"}
      peer-focus:text-blue-600
    `}
                          >
                            Date of Birth
                          </label>

                          <input
                            id="dobInput"
                            type="date"
                            value={name.dob || ""}
                            max={new Date().toISOString().split("T")[0]} // ✅ Disable future dates
                            onChange={(e) =>
                              setName((p) => ({ ...p, dob: e.target.value }))
                            }
                            className={`
      w-full h-12 px-4 pr-10 pt-5 pb-3 rounded-[66px]
      shadow-[0px_1px_2px_0px_rgba(228,229,231,0.24)]
      outline outline-1 outline-offset-[-1px] outline-gray-200
      font-['Raleway'] text-black/80 text-base
      focus:outline-2 focus:outline-blue-500
      transition-all duration-200 peer
      cursor-pointer
      appearance-none
      bg-white
      [color-scheme:light]

      /* Remove native calendar icon */
      [&::-webkit-calendar-picker-indicator]:opacity-0
      [&::-webkit-calendar-picker-indicator]:appearance-none
      [&::-webkit-inner-spin-button]:appearance-none
      [&::-webkit-clear-button]:appearance-none
    `}
                          />

                          {/* Lucide React Calendar Icon */}
                          <Calendar className="absolute right-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-500 pointer-events-none" />
                        </div>
                      </>
                    )}

                    {/* Login Fields */}
                    {isLogin && (
                      <>
                        <input
                          type="email"
                          placeholder="Email"
                          value={email}
                          onChange={(e) => setEmail(e.target.value)}
                          className="w-full h-12 px-4 py-3 rounded-[66px] shadow-[0px_1px_2px_0px_rgba(228,229,231,0.24)] outline outline-1 outline-offset-[-1px] outline-gray-200 font-['Raleway'] text-black/80 placeholder:text-black/40 focus:outline-2 focus:outline-blue-500 transition-all duration-200"
                        />

                        <div className="relative">
                          <input
                            type={showPassword ? "text" : "password"}
                            placeholder="Password"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            className="w-full h-12 px-4 py-3 pr-12 rounded-[66px] shadow-[0px_1px_2px_0px_rgba(228,229,231,0.24)] outline outline-1 outline-offset-[-1px] outline-gray-200 font-['Raleway'] text-black/80 placeholder:text-black/40 focus:outline-2 focus:outline-blue-500 transition-all duration-200"
                          />
                          <button
                            type="button"
                            onClick={() => setShowPassword(!showPassword)}
                            className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-500 hover:text-gray-700 transition-colors"
                          >
                            {showPassword ? (
                              <EyeOff size={20} />
                            ) : (
                              <Eye size={20} />
                            )}
                          </button>
                        </div>
                      </>
                    )}

                    <motion.button
                      whileHover={{ scale: 1.02 }}
                      whileTap={{ scale: 0.98 }}
                      type="submit"
                      className="w-full h-12 px-4 py-3 bg-blue-500 rounded-[66px] shadow-lg text-white font-semibold font-['Raleway'] hover:bg-blue-600 transition-all duration-200"
                    >
                      {isLogin ? "Login" : "Sign Up"}
                    </motion.button>
                  </form>

                  {/* Toggle Text */}
                  <div className="w-full text-center mt-1">
                    <span className="text-black/60 text-sm font-['Raleway'] ">
                      {isLogin
                        ? "Don't have an account? "
                        : "Already have an account? "}
                    </span>
                    <motion.button
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                      onClick={() => {
                        setIsLogin(!isLogin);
                        setEmail("");
                        setPassword("");
                        setName({
                          firstName: "",
                          lastName: "",
                          email: "",
                          phoneNumber: "",
                          countryCode: "+91",
                          password: "",
                          dob: "",
                        });
                      }}
                      className="text-blue-500 text-sm font-semibold font-['Raleway'] hover:text-blue-600 transition-colors duration-200"
                    >
                      {isLogin ? "Sign Up" : "Login"}
                    </motion.button>
                  </div>
                </motion.div>
              </>
            )}
          </div>
        </div>
      </div>
      {/* Responsive styles */}
      <style>{`
        /* Root: block scrolling at page level */
        html, body, #root {
          margin: 0;
          padding: 0;
          height: 100dvh;
          width: 100%;
          overflow: hidden; /* NO page scrolling */
        }

        .no-scroll-root {
          /* ensure background covers viewport */
          min-height: 100dvh;
        }

        .dashboard-container {
          max-height: 100%;
          overflow: hidden; /* no scroll inside container */
        }

        /* Make the login box fit inside viewport and not scroll */
        .login-box {
          /* Height chosen to allow breathing room (adjust -64px as needed) */
          height: calc(100dvh - 64px);
          max-height: calc(100dvh - 48px);
         overflow-y: auto;
          box-sizing: border-box;
          /* center content vertically so it does not overflow */
          display: flex;
          flex-direction: column;
          justify-content: center;
          align-items: center;
          gap: 0.75rem;
          padding-top: 0.5rem;
          padding-bottom: 0.5rem;
        }

        /* If the viewport is very small, reduce paddings/gaps so content fits */
        @media (max-height: 700px) {
          .login-box {
            height: calc(100dvh - 36px);
            padding: 0.5rem;
            gap: 0.5rem;
          }
          .login-box img.logo-img {
            width: 240px !important;
            height: 80px !important;
          }
        }

        @media (max-width: 640px) {
          .login-box {
            gap: 0.75rem !important;
            margin: 0 12px !important;
            padding-left: 0.75rem;
            padding-right: 0.75rem;
          }
          .login-box div.text-2xl {
            font-size: 1.5rem !important;
          }
          .logo-img {
            width: 140px !important;
            height: 60px !important;
          }
        }

        @media (max-width: 350px) {
          .login-box {
            margin: 0 8px !important;
            padding-left: 0.5rem;
            padding-right: 0.5rem;
            gap: 0.5rem;
          }
        }

        /* keep inputs compact so they don't cause overflow */
        input {
          box-sizing: border-box;
        }

        /* remove any scrollbar visuals */
        .login-box::-webkit-scrollbar { display: none; }
      `}</style>
    </>
  );
};

export default Dashboard;
