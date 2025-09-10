import React, { useState } from "react";
import { postApi } from "../../utils/api";
import { URLS } from "../../utils/urls";
import { motion, AnimatePresence } from "framer-motion";
import Loader from "./Loader";
import { useAuth } from "../../utils/AuthContext";

interface SimpleFormModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (field1: boolean, field2: string) => void;
}

const ClubInfoModal: React.FC<SimpleFormModalProps> = ({
  isOpen,
  onClose,
  onSubmit,
}) => {
  const [field1, setField1] = useState<boolean | null>(null);
  const [field2, setField2] = useState<string>("");
  const [error, setError] = useState<string | null>(null);
  const [isApiSuccess, setIsApiSuccess] = useState<boolean>(false);
  const [loading, setLoading] = useState(false);
const { updateUserData } = useAuth();

  
  const handleButtonClick = async (value: boolean) => {
    setField1(value);
    setError(null);
    if (!value) {
      setField2("");
      setLoading(true);
      try {
         const res = await postApi(URLS.clubInfo, {
          clubResponse: value,
          clubId: "",
        });
          if (res.status === 200) {
        setIsApiSuccess(true);
        updateUserData({
          clubResponse: true, // ✅ update instantly
          clubId: "" // empty
        });
        setIsApiSuccess(true);
        onSubmit(value, "");
        setField1(null);
        setField2("");
        onClose();
      } }catch (err) {
        console.error("Error calling API on No:", err);
        setError("Failed to process club details. Please try again.");
        setIsApiSuccess(false);
        setLoading(false);
      } finally {
        setLoading(false);
      }
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (field1 === null) {
      setError("Please select Yes or No to move further.");
      return;
    }
    if (field1 && !field2) {
      setError("Please enter the Club details.");
      return;
    }
    setLoading(true)
    try {
      const response = await postApi(URLS.clubInfo, {
        status: field1,
        clubId: field2 || "",
      });
      onSubmit(field1, field2 || "");
      if (response.status === 200) {
        setIsApiSuccess(true);
        setField1(null);
        setField2("");
        setError(null);
        onClose();
         updateUserData({
    clubResponse: true,
    ...(field2 ? { clubId: field2 } : {})
  });
      }
    } catch (err) {
      console.error("Error submitting form:", err);
      setError("Failed to submit. Please try again.");
      setIsApiSuccess(false);
      setLoading(false)
    }
  finally{
    setLoading(false)
  }
  };

  

  const handleClose = () => {
    if (isApiSuccess) {
      onClose();
    } else {
      setError("Please complete the form or select an option before closing.");
    }
  };

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
    field1 === true ? "min-h-[400px]" : "min-h-[300px]"
  } transition-all duration-300`}
>

        <div className="flex justify-between items-center mb-4">
          <h2 className="text-dark-blue text-lg sm:text-xl font-semibold font-['Raleway']">
            Enter Details
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
        <form onSubmit={handleSubmit} className="flex flex-col gap-6">
          <div className="mb-4 flex flex-col gap-4">
            <label className="block text-gray-600 text-sm sm:text-base font-medium font-['Raleway'] mb-2">
              Are you a Chandigarh Club Member?
            </label>
            <div className="w-full flex justify-between gap-3">
              <button
                type="button"
                onClick={() => handleButtonClick(true)}
                className={`flex-1 py-2 rounded-md text-sm sm:text-base font-medium font-['Raleway'] transition-colors duration-200 ${
                  field1 === true
                    ? "bg-blue-600 text-white hover:bg-blue-700"
                    : "bg-gray-200 text-gray-600 hover:bg-gray-300"
                }`}
              >
                Yes
              </button>
              <button
                type="button"
                onClick={() => handleButtonClick(false)}
                className={`flex-1 py-2 rounded-md text-sm sm:text-base font-medium font-['Raleway'] transition-colors duration-200 ${
                  field1 === false
                    ? "bg-blue-600 text-white hover:bg-blue-700"
                    : "bg-gray-200 text-gray-600 hover:bg-gray-300"
                }`}
              >
                No
              </button>
            </div>
          </div>
          <AnimatePresence>
            {field1 === true && (
              <motion.div
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: "auto" }}
                exit={{ opacity: 0, height: 0 }}
                transition={{ duration: 0.3 }}
                className="mb-4"
              >
                <label className="block text-gray-600 text-sm sm:text-base font-medium font-['Raleway'] mb-2">
                  Enter Club ID
                </label>
                <input
                  type="text"
                  value={field2}
                  onChange={(e) => setField2(e.target.value)}
                  className="w-full px-3 py-2 rounded-md text-sm sm:text-base font-['Raleway'] bg-white border border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500"
                  placeholder="Enter your club ID"
                  required
                />
              </motion.div>
            )}
          </AnimatePresence>
          {error && (
            <div className="text-red-600 text-sm sm:text-base font-medium font-['Raleway'] mb-4">
              {error}
            </div>
          )}
          <AnimatePresence>
            {field1 === true && (
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: 20 }}
                transition={{ duration: 0.3 }}
                className="flex justify-center"
              >
                <button
                  type="submit"
                  className="w-full px-4 py-2 rounded-md text-sm sm:text-base font-medium font-['Raleway'] bg-blue-600 text-white hover:bg-blue-700 transition-colors duration-200"
                >
                  Submit
                </button>
              </motion.div>
            )}
          </AnimatePresence>
        </form>
      </motion.div>
    </motion.div>
   </>
  );
};

export default ClubInfoModal;
