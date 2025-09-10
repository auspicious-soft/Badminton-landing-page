import React, { useState } from "react";
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

const Dashboard = () => {
  const navigate = useNavigate();
  const { login } = useAuth();
  const [loading, setLoading] = useState(false);
  const { successToast, errorToast, warnToast } = useToast();

  const token = localStorage.getItem("token")

  if(token){
    navigate("/venues")
  }
  const loginWithGoogle = useGoogleLogin({
    onSuccess: async (tokenResponse) => {
      setLoading(true);
      try {
        const res = await axios.get(
          "https://www.googleapis.com/oauth2/v3/userinfo",
          {
            headers: {
              Authorization: `Bearer ${tokenResponse.access_token}`,
            },
          }
        );

        // if (!navigator.geolocation) {
        //   errorToast("Geolocation is not supported by your browser");
        //   return;
        // }

        navigator.geolocation.getCurrentPosition(
          async (position) => {
            const lat = position.coords.latitude;
            const lng = position.coords.longitude;

            const payload = {
              authType: "Google",
              accessToken: tokenResponse.access_token,
              // location: {
              //   type: "Point",
              //   coordinates: [lng, lat],
              // },
              fcmToken: "your_firebase_cloud_messaging_token",
            };

            const response = await postApi(`${URLS.socialLogin}`, payload);

            if (response.status === 200) {
              const responseData = response.data.data;
              login(responseData);
              successToast("Login Successfully.");
              navigate("/venues");
            } else {
              errorToast("Error While Login, Please try Again");
            }
          },
          () => {
            // errorToast("Please allow location access to continue.");
          }
        );
      } catch (err: any) {
        errorToast(err?.response?.data?.message || "Google login error");
      } finally {
        setLoading(false);
      }
    },
    onError: () => {
      errorToast("Login Failed");
    },
  });

  return (
 <>
      {loading && <Loader fullScreen />}

      <div
        className="w-screen h-[100dvh] overflow-hidden relative bg-[#e9f5ff] bg-cover bg-no-repeat bg-center"
        style={{ backgroundImage: `url(${backgroundImage})` }}
      >
        <div className="absolute inset-0 flex justify-center items-center z-10 dashboard-container">
          <div className="w-full max-w-md mx-4 p-8 sm:p-10 bg-white rounded-[20px] flex flex-col justify-start items-center gap-6 sm:gap-8 login-box">
            <div className="flex flex-col justify-start items-center gap-8 sm:gap-12">
              <img
                src={logoImage}
                alt="Logo"
                className="w-40 h-40 sm:w-50 sm:h-50 object-contain logo-img"
              />
              <div className="text-center text-dark-blue text-2xl sm:text-3xl font-semibold font-['Raleway']">
                Welcome Back
              </div>
            </div>

           <div
  className="
    w-full h-14 px-4 py-3 sm:px-3.5 sm:py-7 
    bg-white rounded-[66px] 
    shadow-[0px_1px_2px_0px_rgba(228,229,231,0.24)] 
    outline outline-1 outline-offset-[-1px] outline-gray-200 
    flex justify-center items-center gap-2.5 cursor-pointer

    hover:bg-blue-500 hover:shadow-lg transition-all duration-200
    active:bg-blue-600
  "
  onClick={() => loginWithGoogle()}
>
  <div className="w-6 h-6 relative overflow-hidden">
    <img
      src={googleIcon}
      alt="Google Icon"
      className="w-6 h-6 object-contain"
    />
  </div>
  <div className="text-black/60 font-medium font-['Raleway'] hover:text-white transition-colors duration-200">
    Continue with Google
  </div>
</div>

          </div>
        </div>
      </div>

      {/* Responsive styles */}
      <style>
        {`
          html, body {
            margin: 0;
            padding: 0;
            height: 100dvh;
            width: 100%;
            overflow: hidden;
          }

          .bg-fix {
            height: 100dvh;
            background-size: cover;
            background-repeat: no-repeat;
            background-position: center;
            overflow: hidden;
          }

          .dashboard-container {
            max-height: 100%;
            overflow: hidden;
          }

          .login-box {
            max-height: 90dvh;
            overflow-y: auto;
            box-sizing: border-box;
          }

          .login-box::-webkit-scrollbar {
            display: none;
          }

          @media (max-width: 640px) {
            .login-box {
              padding: 1.5rem !important;
              gap: 1.5rem !important;
              margin: 0 16px !important; /* Add breathing space from sides */
            }
            .login-box div.text-2xl {
              font-size: 1.5rem !important;
            }
            .logo-img {
              width: 105px !important;
              height: 105px !important;
            }
          }

          @media (max-width: 350px) {
            .login-box {
              margin: 0 12px !important;
              width: auto !important;
            }
          }
        `}
      </style>
    </>
  );
};

export default Dashboard;
