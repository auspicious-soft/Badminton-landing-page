import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import paddleImg from "../../assets/paddelimage.png";
import clock from "../../assets/watch.jpg";
import { ChevronDown, Plus } from "lucide-react";
import { postApi } from "../../utils/api";
import { URLS } from "../../utils/urls";
import Loader from "./Loader";
import { useToast } from "../../utils/ToastContext";
import { useNavigate } from "react-router-dom";

interface EquipmentItem {
  id: string;
  name: string;
  description: string;
}

interface EquipmentCounts {
  racket1: number;
  ball: number;
}

interface JoinGameProps {
  bookingId: string;
  requestedPosition: string;
  requestedTeam: string;
  imageUrl?: string | null;
  onClose: () => void;
  onJoinSuccess: () => void; // Add callback prop
}

const JoinGame: React.FC<JoinGameProps> = ({
  bookingId,
  requestedPosition,
  requestedTeam,
  imageUrl,
  onClose,
  onJoinSuccess,
}) => {
  const [isEquipmentOpen, setIsEquipmentOpen] = useState<boolean>(false);
  const [isCancellationOpen, setIsCancellationOpen] = useState<boolean>(false);
  const [selectedEquipment, setSelectedEquipment] = useState<{
    [key: string]: boolean;
  }>({});
  const [equipmentCounts, setEquipmentCounts] = useState<EquipmentCounts>({
    racket1: 0,
    ball: 0,
  });
  const [loading, setLoading] = useState(false);
  const { successToast, errorToast } = useToast();
  const navigate = useNavigate();

  const handleToggleEquipment = () => setIsEquipmentOpen(!isEquipmentOpen);
  const handleToggleCancellation = () =>
    setIsCancellationOpen(!isCancellationOpen);

  const handleCountChange = (item: string, delta: number) => {
    setEquipmentCounts((prev) => {
      const newCount = Math.max(0, prev[item as keyof EquipmentCounts] + delta);
      return {
        ...prev,
        [item]: newCount,
      };
    });
  };

  const handleCheckboxChange = (id: string) => {
    setSelectedEquipment((prev) => ({
      ...prev,
      [id]: !prev[id],
    }));

    if (selectedEquipment[id]) {
      setEquipmentCounts((prev) => ({ ...prev, [id]: 0 }));
    }
  };

  const equipmentItems: EquipmentItem[] = [
    { id: "racket1", name: "Racket", description: "Professional padel racket" },
    { id: "ball", name: "Ball", description: "Padel ball set" },
  ];

  const handleJoinGame = async () => {
    setLoading(true);
    try {
      const response = await postApi(`${URLS.joinOpenMatch}`, {
        bookingId,
        requestedPosition,
        requestedTeam,
        rackets: equipmentCounts.racket1,
        balls: equipmentCounts.ball,
      });

      if (response.status === 200) {
        successToast(response.data.message);
        onJoinSuccess(); // Call callback to refetch matches
        onClose();
        navigate("/matches");
      } else {
        errorToast("Failed to join game");
      }
    } catch (error) {
      errorToast("Error joining game");
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      {loading && <Loader fullScreen />}
      <div className="p-4 sm:p-4 bg-white rounded-[20px] flex flex-col justify-start items-start gap-4 w-full max-w-[95vw] sm:max-w-[800px] md:max-w-[1200px] max-h-[90vh] overflow-y-auto hide-scrollbar">
        {/* Image Section */}
        <img
          className="w-full h-40 sm:h-60 rounded-[12px] object-cover"
          src={imageUrl || paddleImg}
          alt="Game"
        />

        {/* Game Info */}
        <div className="w-full flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
          <div className="flex flex-col gap-3">
            <div className="text-gray-900 text-xl sm:text-2xl font-semibold font-['Raleway']">
              Join Game
            </div>
            <div className="text-gray-900 text-base sm:text-lg font-semibold font-['Raleway'] leading-tight">
              Team: {requestedTeam}, Position: {requestedPosition}
            </div>
          </div>
          <img src={clock} className="w-10 h-10 sm:w-12 sm:h-12" alt="Clock" />
        </div>

        {/* Equipment Section */}
        <div className="w-full p-4 sm:p-5 bg-zinc-100 rounded-lg flex flex-col justify-start items-start gap-4">
          <div className="w-full flex justify-between items-start">
            <div className="flex justify-start items-center gap-3">
              <div className="text-gray-900 text-sm sm:text-base font-semibold font-['Raleway'] leading-none">
                Add Equipment
              </div>
              <div className="text-neutral-800 text-sm sm:text-base font-semibold font-['Raleway'] leading-none">
                ⓘ
              </div>
            </div>
            <motion.div
              className={`w-9 h-5 rounded-lg outline outline-1 outline-neutral-200 relative cursor-pointer ${isEquipmentOpen ? 'bg-blue-500' : 'bg-white'}`}
              onClick={handleToggleEquipment}
              whileTap={{ scale: 0.95, backgroundColor: "#011140" }}
              transition={{ duration: 0.1 }}
            >
              <motion.div
                className="w-5 h-5 bg-dark-blue rounded-lg"
                animate={{ x: isEquipmentOpen ? 16 : 0, scale: isEquipmentOpen ? 1.1 : 1 }}
                transition={{ duration: 0.2, ease: "easeOut" }}
              />
            </motion.div>
          </div>
          <div className="w-full h-0 outline outline-1 outline-offset-[-0.50px] outline-neutral-200"></div>
          <AnimatePresence>
            {isEquipmentOpen && (
              <motion.div
                className="w-full flex flex-col justify-start items-start gap-4 max-h-[300px] overflow-y-auto hide-scrollbar"
                initial={{ height: 0, opacity: 0 }}
                animate={{ height: "auto", opacity: 1 }}
                exit={{ height: 0, opacity: 0 }}
                transition={{ duration: 0.3 }}
              >
                {equipmentItems.map((item) => {
                  const isSelected = selectedEquipment[item.id];
                  const count = equipmentCounts[item.id as keyof EquipmentCounts];

                  return (
                    <div
                      key={item.id}
                      className="w-full flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4"
                    >
                      <div className="flex justify-start items-start gap-3">
                        <div
                          className={`w-4 h-4 rounded-[3px] border border-gray-500 flex items-center justify-center cursor-pointer ${
                            isSelected ? "bg-blue-600" : "bg-slate-200"
                          }`}
                          onClick={() => handleCheckboxChange(item.id)}
                        >
                          {isSelected && (
                            <div className="w-2 h-2 bg-white rounded-sm" />
                          )}
                        </div>
                        <div className="flex flex-col justify-center items-start gap-1.5">
                          <div className="text-gray-600 text-sm sm:text-base font-medium font-['Raleway']">
                            {item.name}
                          </div>
                          <div className="text-gray-600 text-xs sm:text-sm font-medium font-['Raleway']">
                            {item.description}
                          </div>
                        </div>
                      </div>
                      {isSelected && (
                        <div className="flex border-[0.5px] border-zinc-300">
                          {count === 0 ? (
                            <motion.div
                              className="w-7 h-7 bg-slate-200 flex justify-center items-center cursor-pointer "
                              onClick={() => handleCountChange(item.id, 1)}
                              whileTap={{ scale: 0.9, backgroundColor: "#2563eb" }}
                              transition={{ duration: 0.1 }}
                            >
                              <span className="text-base">+</span>
                            </motion.div>
                          ) : (
                            <>
                              <motion.div
                                className="w-7 h-7 bg-slate-200 border-[0.5px] border-r-zinc-300 flex justify-center items-center cursor-pointer "
                                onClick={() => handleCountChange(item.id, -1)}
                                whileTap={{ scale: 0.9, backgroundColor: "#2563eb" }}
                                transition={{ duration: 0.1 }}
                              >
                                <span className="text-base">-</span>
                              </motion.div>
                              <div className="w-7 h-7 bg-slate-200 text-gray-500 text-sm font-medium font-['Raleway'] flex justify-center items-center">
                                <span>{count}</span>
                              </div>
                              <motion.div
                                className="w-7 h-7 bg-slate-200 border-[0.5px] border-l-zinc-300 flex justify-center items-center cursor-pointer "
                                onClick={() => handleCountChange(item.id, 1)}
                                whileTap={{ scale: 0.9, backgroundColor: "#2563eb" }}
                                transition={{ duration: 0.1 }}
                              >
                                <span className="text-base">+</span>
                              </motion.div>
                            </>
                          )}
                        </div>
                      )}
                    </div>
                  );
                })}
              </motion.div>
            )}
          </AnimatePresence>
        </div>

        {/* Cancellation Policy Section */}
        <div className="w-full px-3 py-5 bg-zinc-100 rounded-lg flex flex-col justify-start items-start gap-4">
          <div
            className="w-full flex justify-between items-start cursor-pointer"
            onClick={handleToggleCancellation}
          >
            <div className="flex-1 flex justify-between items-center">
              <div className="text-gray-900 text-sm sm:text-base font-semibold font-['Raleway'] leading-none">
                Cancellation Policy
              </div>
              <motion.div
                className="w-5 h-5 relative overflow-hidden"
                animate={{ rotate: isCancellationOpen ? 180 : 0 }}
                transition={{ duration: 0.3 }}
              >
                <ChevronDown className="w-6 h-6 absolute outline-black" />
              </motion.div>
            </div>
          </div>
          <AnimatePresence>
            {isCancellationOpen && (
              <motion.div
                className="w-full text-gray-600 text-sm sm:text-base font-medium font-['Raleway'] max-h-[200px] overflow-y-auto hide-scrollbar"
                initial={{ height: 0, opacity: 0 }}
                animate={{ height: "auto", opacity: 1 }}
                exit={{ height: 0, opacity: 0 }}
                transition={{ duration: 0.3 }}
              >
                You may cancel your participation up to 24 hours before the scheduled
                time for a full refund, if applicable.
              </motion.div>
            )}
          </AnimatePresence>
        </div>

        {/* Join Game Button */}
        <div className="w-full h-12 sm:h-14 px-6 sm:px-44 py-4 bg-dark-blue hover:bg-blue-700 transition-colors rounded-lg flex justify-center items-center gap-3">
          <button
            className="text-white text-sm sm:text-base font-medium font-['Raleway']"
            onClick={handleJoinGame}
            disabled={loading}
          >
            {loading ? "Processing..." : "Join Game"}
          </button>
        </div>
      </div>
    </>
  );
};

export default JoinGame;