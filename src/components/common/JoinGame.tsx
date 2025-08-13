import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import paddleImg from "../../assets/paddelimage.png";
import clock from "../../assets/watch.jpg";
import { ChevronDown, Plus } from "lucide-react";
import { postApi } from "../../utils/api";
import { baseImgUrl, URLS } from "../../utils/urls";
import Loader from "./Loader";
import { useToast } from "../../utils/ToastContext";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../../utils/AuthContext";

interface EquipmentItem {
  id: string;
  name: string;
  description: string;
}

interface EquipmentCounts {
  racket1: number;
  ball: number;
}

interface PlayerSlot {
  name: string;
  profilePic: string | null;
}

interface JoinGameProps {
  bookingId: string;
  requestedPosition: string;
  requestedTeam: string;
  imageUrl?: string | null;
  slots?: (PlayerSlot | null)[]; // updated type
  onClose: () => void;
  onJoinSuccess: () => void;
}

const getAvatarColors = () => [
  "bg-blue-500",
  "bg-purple-500",
  "bg-green-500",
  "bg-red-500",
  "bg-yellow-500",
  "bg-pink-500",
  "bg-indigo-500",
  "bg-teal-500",
];

const PlayerAvatars = ({
  slots,
  selectedSlot,
  onSlotClick,
   startIndex = 0,
   userData
}: {
  slots: (PlayerSlot | null)[];
  selectedSlot: number | null;
  onSlotClick: (slotIndex: number) => void;
    startIndex?: number; // add this
    userData: any;

}) => {
  const colors = getAvatarColors();
  const maxDisplay = 4;
  const displayItems = slots.slice(0, maxDisplay);
  
  return (
    // change gap to -space-x-2 for images to stack the images. (overlapy each other.)
    <div className="flex items-center gap-2">  
      {displayItems.map((item, i) => {
        const actualIndex = startIndex + i;
const isSelected = selectedSlot === actualIndex;
        const isAvailable = item === null;

        if (!isAvailable) {
          return (
            <motion.div
              key={`player-${actualIndex}`}
              initial={{ scale: 0, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              transition={{ delay: i * 0.1, type: "spring", stiffness: 300 }}
              className={`w-10 h-10 sm:w-12 sm:h-12 rounded-full ${
                colors[i % colors.length]
              } 
                flex items-center justify-center text-white text-sm sm:text-base font-semibold 
                border-2 border-white shadow-lg relative z-10`}
              style={{ zIndex: maxDisplay - i }}
              whileHover={{ scale: 1.1, zIndex: 20 }}
            >
              {item?.profilePic ? (
                <img
                  src={item.profilePic}
                  alt={item.name}
                  className="w-full h-full rounded-full object-cover"
                />
              ) : (
                item?.name?.charAt(0).toUpperCase()
              )}
            </motion.div>
          );
        } else {
          return (
            <motion.div
              key={`empty-${actualIndex}`}
              initial={{ scale: 0, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              transition={{ delay: i * 0.1, type: "spring", stiffness: 300 }}
              className={`w-10 h-10 sm:w-12 sm:h-12 rounded-full border-2 ${
                isSelected
                  ? "border-blue-500 bg-blue-100"
                  : "border-dashed border-gray-400 bg-gray-100"
              } flex items-center justify-center relative cursor-pointer`}
              style={{ zIndex: maxDisplay - i }}
              whileHover={{ scale: 1.1, borderColor: "#3B82F6" }}
              whileTap={{ scale: 0.95 }}
              onClick={() => onSlotClick(actualIndex)}
            >
              {isSelected ? (
                <img
    src={userData?.profilePic ? userData.profilePic.startsWith("https") ? userData?.profilePic : `${baseImgUrl}/${userData?.profilePic}` : ""}
    alt={userData?.name || 'You'}
    className="w-full h-full object-cover rounded-full border-2 border-green-500"
  />
              ) : (
                <span className="text-gray-400 text-lg">+</span>
              )}
            </motion.div>
          );
        }
      })}
      {slots.length > maxDisplay && (
        <motion.div
          initial={{ scale: 0, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{
            delay: maxDisplay * 0.1,
            type: "spring",
            stiffness: 300,
          }}
          className="w-10 h-10 sm:w-12 sm:h-12 rounded-full bg-gray-500 
            flex items-center justify-center text-white text-xs font-semibold 
            border-2 border-white shadow-lg ml-1"
          whileHover={{ scale: 1.1 }}
        >
          +{slots.length - maxDisplay}
        </motion.div>
      )}
    </div>
  );
};

const JoinGame: React.FC<JoinGameProps> = ({
  bookingId,
  requestedPosition,
  requestedTeam,
  imageUrl,
  slots = [null, null, null, null], // Default empty slots
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
  const [selectedSlot, setSelectedSlot] = useState<number | null>(null);
  const [loading, setLoading] = useState(false);
  const { successToast, errorToast } = useToast();
  const navigate = useNavigate();
  const {userData} = useAuth();
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

  const handleSlotClick = (slotIndex: number) => {
    if (slots[slotIndex] === null) {
      if (selectedSlot === slotIndex) {
        setSelectedSlot(null); // Deselect if clicking the same slot
      } else {
        setSelectedSlot(slotIndex); // Select new slot
      }
    }
  };

  const equipmentItems: EquipmentItem[] = [
    { id: "racket1", name: "Racket", description: "Professional padel racket" },
    { id: "ball", name: "Ball", description: "Padel ball set" },
  ];

  const handleJoinGame = async () => {
    // Check if slot is selected
    if (selectedSlot === null) {
      errorToast("Please select an available slot");
      return;
    }

    setLoading(true);
    try {
      const response = await postApi(`${URLS.joinOpenMatch}`, {
        bookingId,
        requestedPosition: `player${selectedSlot + 1}`,
        requestedTeam: selectedSlot < 2 ? "team1" : "team2",
        rackets: equipmentCounts.racket1,
        balls: equipmentCounts.ball,
      });

      if (response.status === 200) {
        successToast(response.data.message);
        onJoinSuccess();
        onClose();
        navigate("/my-bookings");
      } else {
        errorToast("Failed to join game");
      }
    } catch (error) {
      errorToast("Error joining game");
    } finally {
      setLoading(false);
    }
  };

const openSpots =
  slots.filter((s) => s === null).length -
  (selectedSlot !== null && slots[selectedSlot] === null ? 1 : 0);

  const team1Slots = slots.slice(0, 2);
const team2Slots = slots.slice(2, 4);
  return (
    <>
      {loading && <Loader fullScreen />}
      <div className="p-4 sm:p-4 bg-white rounded-[20px] flex flex-col justify-start items-start gap-4 w-full max-w-[85vw] sm:max-w-[700px] md:max-w-[1000px] max-h-[80vh] overflow-y-auto hide-scrollbar">
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
              Select your position to join the game
            </div>
          </div>
          <img src={clock} className="w-10 h-10 sm:w-12 sm:h-12" alt="Clock" />
        </div>

        {/* Slot Selection Section */}
        <div className="w-full p-4 sm:p-5 bg-zinc-100 rounded-lg flex flex-col justify-start items-start gap-4">
          <div className="w-full flex justify-between items-center row">
            <div className="text-gray-900 text-sm sm:text-base font-semibold font-['Raleway']">
              Available Positions
            </div>
            <div className="text-gray-600 text-sm sm:text-base font-medium">
              {openSpots} spots open
            </div>
          </div>

          <motion.div
            className="w-full flex flex-col  gap-4"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.2 }}
          >
            <div className="flex flex-col items-center gap-6">
<div className="flex flex-col max-[400px]:flex-col min-[401px]:flex-row items-center justify-center gap-8">
  <PlayerAvatars
    slots={team1Slots}
    selectedSlot={selectedSlot}
    onSlotClick={handleSlotClick}
      startIndex={0}
      userData={userData}
  />

  <span className="text-lg font-bold text-gray-700">VS</span>

  <PlayerAvatars
    slots={team2Slots}
    selectedSlot={selectedSlot}
    onSlotClick={handleSlotClick}
     startIndex={2}
     userData={userData}
  />
</div>
              <div className="flex flex-col gap-1">
                <span className="text-gray-500 ml-3 text-sm">
                  {slots
                    .filter((s) => s !== null)
                    .map((s) => (s as PlayerSlot).name)
                    .join(", ")}{" "}
                  {openSpots > 0 && `+ ${openSpots} spots open`}
                </span>
                {selectedSlot !== null && (
                  <motion.span
                    className="text-blue-600 text-sm font-medium"
                    initial={{ opacity: 0, y: -10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.3 }}
                  >
                    Position {selectedSlot + 1} selected (Team{" "}
                    {selectedSlot < 2 ? "1" : "2"})
                  </motion.span>
                )}
              </div>
            </div>

            {/* {openSpots === 0 && (
              <div className="text-red-500 text-sm font-medium">
                This game is currently full
              </div>
            )} */}
          </motion.div>
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
              className={`w-9 h-5 rounded-lg outline outline-1 outline-neutral-200 relative cursor-pointer ${
                isEquipmentOpen ? "bg-blue-500" : "bg-white"
              }`}
              onClick={handleToggleEquipment}
              whileTap={{ scale: 0.95, backgroundColor: "#011140" }}
              transition={{ duration: 0.1 }}
            >
              <motion.div
                className="w-5 h-5 bg-dark-blue rounded-lg"
                animate={{
                  x: isEquipmentOpen ? 16 : 0,
                  scale: isEquipmentOpen ? 1.1 : 1,
                }}
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
                  const count =
                    equipmentCounts[item.id as keyof EquipmentCounts];

                  return (
                    <div
                      key={item.id}
                    className="flex w-full flex-col max-[400px]:flex-col min-[401px]:flex-row justify-between items-start sm:items-center gap-4"
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
                              whileTap={{
                                scale: 0.9,
                                backgroundColor: "#2563eb",
                              }}
                              transition={{ duration: 0.1 }}
                            >
                              <span className="text-base">+</span>
                            </motion.div>
                          ) : (
                            <>
                              <motion.div
                                className="w-7 h-7 bg-slate-200 border-[0.5px] border-r-zinc-300 flex justify-center items-center cursor-pointer "
                                onClick={() => handleCountChange(item.id, -1)}
                                whileTap={{
                                  scale: 0.9,
                                  backgroundColor: "#2563eb",
                                }}
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
                                whileTap={{
                                  scale: 0.9,
                                  backgroundColor: "#2563eb",
                                }}
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
                You may cancel your participation up to 24 hours before the
                scheduled time for a full refund, if applicable.
              </motion.div>
            )}
          </AnimatePresence>
        </div>

        {/* Join Game Button */}
      <motion.button
  className={`w-full h-12 sm:h-14 px-6 sm:px-44 py-4 bg-dark-blue hover:bg-blue-700 transition-colors rounded-lg flex justify-center items-center gap-3 ${
    selectedSlot === null || loading ? "opacity-50 cursor-not-allowed" : ""
  }`}
  onClick={handleJoinGame}
  disabled={selectedSlot === null || loading}
  whileTap={selectedSlot !== null && !loading ? { scale: 0.95 } : {}}
  whileHover={selectedSlot !== null && !loading ? { scale: 1.02 } : {}}
>
  <span className="text-white text-sm sm:text-base font-medium">
    {loading
      ? "Processing..."
      : selectedSlot !== null
      ? "Join Game"
      : "Select a Position"}
  </span>
</motion.button>

      </div>
    </>
  );
};

export default JoinGame;
