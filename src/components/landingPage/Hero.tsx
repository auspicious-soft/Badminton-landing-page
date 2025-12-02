import { Download, Calendar, ChevronRight, Play, Apple } from "lucide-react";
import mainImage from "../../assets/pexels-atousa7495-32234837.jpg";
import gplay from "../../assets/Store download button1.png";
import apple from "../../assets/Store download button2.png";
const APPLE_LINK = import.meta.env.VITE_APPLE_LINK;
const GOOGLE_LINK = import.meta.env.VITE_GOOGLE_LINK;

import { useNavigate } from "react-router-dom";
import { useToast } from "../../utils/ToastContext";

const Hero = () => {
  const navigate = useNavigate();
  const { successToast, errorToast } = useToast();
  // const appleLink = APPLEL_LINK
  // const googleLink = GOOGLE_LINK

  const token = localStorage.getItem("token");
  const handleNavigation = () => {
    if (token) {
      navigate("/venues");
    } else {
      navigate("/dashboard");
    }
  };

  const handleAppleDownload = () => {
    window.open(`${APPLE_LINK}`, "_blank");
  };

  const handleGoogleDownload = () => {
    if (!GOOGLE_LINK) {
      errorToast("Google Link Unavailable");
    }
    else{
    window.open(`${GOOGLE_LINK}`, "_blank");
    }
  };

  return (
    <section
      id="features"
      className="relative bg-gradient-to-br from-blue-50 to-white min-h-screen flex items-center pt-16"
    >
      <div className="container mx-auto px-4 py-16 lg:py-24">
        <div className="grid lg:grid-cols-2 gap-12 items-center">
          {/* Content */}
          <div className="text-center lg:text-left">
            <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold text-gray-900 leading-tight mb-6">
              Book Padel & Pickleball Matches
              <span className="text-blue-600"> Instantly</span>
            </h1>

            <p className="text-xl text-gray-600 mb-8 leading-relaxed">
              Discover courts, schedule games, and play your favorite sports —
              all in one app. Connect with players and never miss a match again.
            </p>

            <div className="z-10 flex flex-col sm:flex-row gap-4 justify-center lg:justify-start mb-8">
              <button
                className="  text-white font-semibold px-4 py-2 rounded-lg flex items-center justify-center gap-2 transition-all duration-300 transform hover:scale-105 shadow-lg hover:shadow-xl"
                type="button"
                onClick={handleGoogleDownload}
              >
                <img
                  src={gplay}
                  width="10px"
                  height="6px"
                  alt="google"
                  className="w-28 h-10 rounded-md"
                />
              </button>

              <button
                className=" text-white font-semibold px-4 py-2 rounded-lg flex items-center justify-center gap-2 transition-all duration-300 transform hover:scale-105 shadow-lg hover:shadow-xl"
                type="button"
                onClick={handleAppleDownload}
              >
                <img
                  src={apple}
                  width="10px"
                  height="6px"
                  alt="google"
                  className="w-28 h-10 rounded-md"
                />
              </button>

              <button
                className="bg-blue-600 hover:bg-blue-700 text-white font-semibold px-4 py-2 rounded-lg flex items-center justify-center gap-2 transition-all duration-300 transform hover:scale-105 shadow-lg hover:shadow-xl"
                type="button"
                onClick={handleNavigation}
              >
                <Calendar className="w-5 h-5" />
                Book Now
                <ChevronRight className="w-4 h-4" />
              </button>
            </div>

            <div className="flex items-center justify-center lg:justify-start gap-6 text-sm text-gray-500">
              <div className="flex items-center gap-2">
                <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                <span>Real-time availability</span>
              </div>
              <div className="flex items-center gap-2">
                <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
                <span>Instant booking</span>
              </div>
            </div>
          </div>

          {/* Hero Image */}
          <div className="relative">
            <div className="relative z-10 max-w-sm mx-auto">
              <div className="bg-white rounded-3xl shadow-2xl p-1">
                <img
                  src={mainImage}
                  width="100%"
                  height="auto"
                  alt="Project Play App mobile app booking screen"
                  className="w-full h-auto rounded-3xl"
                />
              </div>
            </div>

            {/* Floating elements */}
            {/* <div className="absolute top-12 -left-6 bg-white rounded-xl shadow-lg p-4 animate-pulse">
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 bg-green-500 rounded-full flex items-center justify-center">
                  <Calendar className="w-4 h-4 text-white" />
                </div>
                <div>
                  <p className="font-semibold text-sm">Court Available</p>
                  <p className="text-xs text-gray-500">3:00 PM Today</p>
                </div>
              </div>
            </div> */}

            {/* <div
              className="absolute bottom-24 -right-6 bg-white rounded-xl shadow-lg p-4 animate-pulse"
              style={{ animationDelay: "1s" }}
            >
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 bg-blue-600 rounded-full flex items-center justify-center">
                  <span className="text-white text-xs font-bold">4</span>
                </div>
                <div>
                  <p className="font-semibold text-sm">Players Joined</p>
                  <p className="text-xs text-gray-500">Pickleball Match</p>
                </div>
              </div>
            </div> */}
          </div>
        </div>
      </div>
    </section>
  );
};

export default Hero;
