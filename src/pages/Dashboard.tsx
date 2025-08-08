import React, { useState } from "react";
import backgroundImage from "../assets/BackgroundFrame.png";
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
  const { successToast, errorToast } = useToast();

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

        if (!navigator.geolocation) {
          errorToast("Geolocation is not supported by your browser");
          return;
        }

        navigator.geolocation.getCurrentPosition(
          async (position) => {
            const lat = position.coords.latitude;
            const lng = position.coords.longitude;

            const payload = {
              authType: "Google",
              accessToken: tokenResponse.access_token,
              location: {
                type: "Point",
                coordinates: [lng, lat],
              },
              fcmToken: "your_firebase_cloud_messaging_token",
            };

            const response = await postApi(`${URLS.socialLogin}`, payload);

            if (response.status === 200) {
              const responseData = response.data.data;
              login(responseData);
              successToast("Login Successfully.");
              navigate("/matches");
            } else {
              errorToast("Error While Login, Please try Again");
            }
          },
          () => {
            errorToast("Please allow location access to continue.");
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
  className="w-screen bg-fix overflow-hidden relative bg-[#e9f5ff]"
  style={{ backgroundImage: `url(${backgroundImage})` }}
>
        <div className="absolute inset-0 flex justify-end items-center pr-40 z-10 dashboard-container">
          <div className="w-96 p-14 bg-white rounded-[20px] flex flex-col justify-start items-center gap-5 login-box">
            <div className="flex flex-col justify-start items-center gap-12">
              <img
                src={logoImage}
                alt="Logo"
                className="w-50 h-50 object-contain object-top logo-img"
              />
              <div className="text-center text-black text-3xl font-semibold font-['Raleway']">
                Welcome Back
              </div>
            </div>
            <div
              className="w-full h-14 px-3.5 py-7 bg-white rounded-[66px] shadow-[0px_1px_2px_0px_rgba(228,229,231,0.24)] outline outline-1 outline-offset-[-1px] outline-gray-200 flex justify-center items-center gap-2.5 overflow-hidden cursor-pointer"
              onClick={() => loginWithGoogle()}
            >
              <div className="w-6 h-6 relative overflow-hidden">
                <img
                  src={googleIcon}
                  alt="Google Icon"
                  className="w-6 h-6 object-contain"
                />
              </div>
              <div className="text-black/60 text-base font-medium font-['Raleway']">
                Continue with Google
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Responsive styles */}
    <style>
  {`
    .bg-fix {
      min-height: 100vh; 
      background-size: cover; /* Always cover */
      background-repeat: no-repeat;
      background-position: center;
    }

    @media (max-width: 1024px) {
      .dashboard-container {
        justify-content: center !important;
        padding-right: 0 !important;
      }
    }

    @media (max-width: 640px) {
      .login-box {
        padding: 1.5rem !important;
        gap: 1.5rem !important;
      }
      .logo-img {
        object-fit: contain !important;
      }
      .login-box div.text-3xl {
        font-size: 1.5rem !important;
      }
    }

    /* Below 350px — give breathing space on sides */
    @media (max-width: 350px) {
      .login-box {
        margin: 0 10px !important;
        width: auto !important;
      }
    }
  `}
</style>


    </>
  );
};

export default Dashboard;
