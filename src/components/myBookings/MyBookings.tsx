import React, { useState, useEffect } from "react";
import { MapPin, Crown, X, Plus } from "lucide-react";
import { motion, Variants } from "framer-motion";
import { baseImgUrl, URLS } from "../../utils/urls";
import dummyUserImg from "../../assets/dashboarduser.png";
import { postApi, getApi } from "../../utils/api";
import ModifyBooking from "../common/ModifyBooking";
import { useAuth } from "../../utils/AuthContext";
import UploadScoreModal from "../common/UploadScoreModal";
import { useToast } from "../../utils/ToastContext";
import { error, group } from "console";
import Loader from "../common/Loader";

interface Player {
  name: string;
  rating: number;
  imageUrl: string;
}

interface Booking {
  game: string;
  duration: string;
  type: string;
  team1: Player[];
  team2: Player[];
  location: string;
  status: string;
  isComp: string;
  dateOfCreation: string;
  bookingId: string;
  bookingType: string;
  askToJoin: boolean;
  userId: string;
  bookingdate: string;
  score: {
    set1?: { team1: string; team2: string };
    set2?: { team1: string; team2: string };
    set3?: { team1: string; team2: string };
    winner?: "team1" | "team2";
  };
}

interface BookingGroup {
  date: string;
  time: string;
    court: any;

  bookings: Booking[];
}

interface MyBookingsProps {
  bookingGroups: BookingGroup[];
  onScoreUpdate: () => void;
}

interface Friend {
  id: string | number;
  name: string;
  image?: string | null;
  type: "user" | "guest" | "available";
}

// Animation variants for booking card (scroll)
const bookingVariants: Variants = {
  hidden: { opacity: 0, y: 20 },
  visible: {
    opacity: 1,
    y: 0,
    transition: {
      duration: 0.5,
      ease: "easeOut",
    },
  },
};

// Animation variants for hover effect
const cardHoverVariants: Variants = {
  rest: {
    scale: 1,
    backgroundColor: "#F3F4F6",
    boxShadow: "0px 2px 4px rgba(0, 0, 0, 0.1)",
  },
  hover: {
    scale: 0.99,
    backgroundColor: "#E2E8F0",
    boxShadow: "0px 6px 12px rgba(0, 0, 0, 0.2)",
    transition: {
      duration: 0.3,
      ease: "easeOut",
    },
  },
};

// Animation variants for modal
const modalVariants: Variants = {
  hidden: { opacity: 0, scale: 0.8 },
  visible: {
    opacity: 1,
    scale: 1,
    transition: { duration: 0.2, ease: "easeOut" },
  },
  exit: {
    opacity: 0,
    scale: 0.8,
    transition: { duration: 0.2, ease: "easeIn" },
  },
};

const MyBookings: React.FC<MyBookingsProps> = ({ bookingGroups , onScoreUpdate}) => {
  const [showCancelModal, setShowCancelModal] = useState(false);
  const [showInfoModal, setShowInfoModal] = useState(false);
  const [showUploadScoreModal, setShowUploadScoreModal] = useState(false);
  const [showModifyModal, setShowModifyModal] = useState(false);
  const [selectedBookingId, setSelectedBookingId] = useState<string | null>(
    null
  );
  const [selectedGameType, setSelectedgameType] = useState<string | null>(null);
  const [friends, setFriends] = useState<Friend[]>([]);
  const [loading, setLoading] = useState(false);
  const [infoMessage, setInfoMessage] = useState("");

  const { userData } = useAuth();
  const { successToast, errorToast } = useToast();

  useEffect(() => {
    const fetchFriends = async () => {
      try {
        const response = await getApi(
          `${URLS.getFriends}?status=friends-requests&search=`
        );
        if (response?.status === 200 && response?.data?.success) {
          const fetchedFriends = response.data.data.friends.map(
            (friend: any) => ({
              id: friend._id,
              name: friend.fullName,
              image: friend.profilePic,
              type: friend.email ? "user" : "guest",
            })
          );
          setFriends(fetchedFriends);
        }
      } catch (error) {
        console.error("Error fetching friends:", error);
      }
    };
    fetchFriends();
  }, []);

  const handleCancelBooking = async (bookingId: string) => {
    setLoading(true);
    try {
      const response = await postApi(`${URLS.cancelBooking}`, { bookingId });
      if (response.status === 200) {
        successToast(response.data.message);
        setShowCancelModal(false);
        onScoreUpdate();
      } else {
        setShowCancelModal(false);
        setLoading(false);
        errorToast("Failed to cancel booking");
      }
    } catch (error: any) {
      errorToast(error?.response.data.message);
  
      setShowCancelModal(false);
      setLoading(false);
    } finally {
      setLoading(false);
    }
  };

  const handlePlayerSelect = async (
    team: "team1" | "team2",
    index: number,
    player: Friend
  ) => {
    try {
      const playerType =
        team === "team1" ? `player${index + 1}` : `player${index + 3}`;
      const response = await postApi(`${URLS}`, {
        bookingId: selectedBookingId,
        team,
        playerId: player.id,
        playerType,
      });
      if (response.status === 200) {
        console.log(`Player ${player.name} added to ${team} at index ${index}`);
        // Optionally, refresh booking data or update local state
      } else {
        console.error("Failed to update player");
      }
    } catch (error) {
      console.error("Error updating player:", error);
    }
  };

  const handleFriendsUpdate = (updatedFriends: Friend[]) => {
    setFriends(updatedFriends);
  };

  const getStatusStyles = (bookingType: string, status: string) => {
    if (bookingType.toLowerCase() === "cancelled") {
      return "bg-red-500 text-white";
    }
    switch (status.toLowerCase()) {
      case "upcoming":
        return "bg-green-500 text-white";
      case "previous":
        return "bg-gray-500 text-white";
      default:
        return "bg-gray-500 text-white";
    }
  };

  const getStatusText = (bookingType: string, status: string) => {
    if (bookingType.toLowerCase() === "cancelled") {
      return "Cancelled";
    }
    return status.charAt(0).toUpperCase() + status.slice(1);
  };

  const isWithin24Hours = (bookingdate: string) => {
    const bookingTime = new Date(bookingdate).getTime(); // When booking starts
    const now = Date.now(); // Current time

    const hoursDifference = (bookingTime - now) / (1000 * 60 * 60);

    // Can modify only if more than 24 hours remain
    return hoursDifference > 24;
  };

  const openCancelModal = (bookingId: string) => {
    setSelectedBookingId(bookingId);
    setShowCancelModal(true);
  };

  const closeCancelModal = () => {
    setShowCancelModal(false);
    setSelectedBookingId(null);
  };

  const canModifyBooking = (bookingdate: string) => {
  const bookingTime = new Date(bookingdate).getTime();
  const now = Date.now();
  const hoursLeft = (bookingTime - now) / (1000 * 60 * 60);
  return hoursLeft > 4; // Allow modify only if more than 4 hours remain
};


const openModifyModal = (
  bookingId: string,
  askToJoin: boolean,
  bookingdate?: string,
  bookingtype?:string,
) => {
  setSelectedBookingId(bookingId);

  if (askToJoin) {
    setInfoMessage(
      "Sorry! Only private and upcoming bookings created by the creator are allowed to modify."
    );
    setShowInfoModal(true);
    return;
  }

  if (bookingdate && !canModifyBooking(bookingdate)) {
    setInfoMessage(
      "Sorry! Modifications are only allowed up to 4 hours before the booking start time."
    );
    setShowInfoModal(true);
    return;
  }

  if(  bookingtype && bookingtype === "Cancelled") {
    setInfoMessage(
      "Sorry! Cancelled Bookings cannot be modified."
    );
    setShowInfoModal(true);
    return;
  }


  setShowModifyModal(true);
};


  const closeModifyModal = () => {
    setShowModifyModal(false);
    setSelectedBookingId(null);
  };

  const closeInfoModal = () => {
    setSelectedBookingId(null);
    setShowInfoModal(false);
  };

  const openUploadScoreModal = (
    bookingId: string,
    typeGame: string,
    score: any
  ) => {
    setSelectedBookingId(bookingId);
    setSelectedgameType(typeGame);
    setShowUploadScoreModal(true);
  };

  const closeUploadScoreModal = () => {
    setShowUploadScoreModal(false);
    setSelectedBookingId(null);
    setSelectedgameType(null);
  };

useEffect(() => {
  // Check if any modal is open
  const anyModalOpen =
    showUploadScoreModal ||
    showCancelModal ||
    showInfoModal ||
    showModifyModal;

  if (anyModalOpen) {
    document.body.classList.add("body-no-scroll");
  } else {
    document.body.classList.remove("body-no-scroll");
  }

  // Cleanup on unmount
  return () => {
    document.body.classList.remove("body-no-scroll");
  };
}, [showUploadScoreModal, showCancelModal, showInfoModal, showModifyModal]);
  return (
    <>
          {loading && <Loader fullScreen />}

   <div className="w-full grid grid-cols-1 md720:grid-cols-2 justify-start items-start gap-6 sm:gap-8">
  {bookingGroups.map((group, index) => (
    <div
      key={index}
      className="self-stretch flex flex-col justify-start items-start gap-2 sm:gap-2.5"
    >
      <div className="self-stretch justify-center text-gray-600 text-xs sm:text-sm font-semibold font-['Raleway'] leading-none">
    {group.date} | {group.time}
  </div>
      <div className="self-stretch gird grid-cols-2 justify-start items-start gap-1.5 sm:gap-2">
        {group.bookings.map((booking, bookingIndex) => (
          <motion.div
            key={bookingIndex}
            className="self-stretch px-3 sm:px-4 py-2 sm:py-2.5 rounded-[10px] flex flex-col justify-start items-start gap-2 sm:gap-2.5 cursor-pointer overflow-hidden "
            variants={{ ...bookingVariants, ...cardHoverVariants }}
            initial="hidden"
            animate="rest"
            whileInView="visible"
            whileHover="hover"
            viewport={{ once: true, amount: 0.0001 }}
        style={{ backgroundColor: "#F3F4F6"}} 
            onClick={() =>
  openModifyModal(booking.bookingId, booking.askToJoin, booking.bookingdate, booking.bookingType)
            }
          >
            <div className="self-stretch flex flex-col justify-start items-start gap-3 sm:gap-4">
              <div className="self-stretch inline-flex flex-col sm:flex-row justify-between items-start sm:items-center gap-2 sm:gap-0">
                <div className="flex justify-start items-center gap-1 sm:gap-[5px] flex-shrink-0">
                  <div className="justify-center text-gray-600 text-xs sm:text-sm font-medium font-['Raleway'] leading-none">
                    {booking.game}
                  </div>
                  <div className="justify-center text-gray-600 text-xs sm:text-sm font-medium font-['Raleway'] leading-none">
                    {booking.duration}
                  </div>
                </div>
                <div className="flex justify-end items-center flex-shrink-0">
                  <div
                    className={`px-3 sm:px-3 py-1.5 sm:py-1.5 rounded-md text-xs sm:text-sm font-medium text-white transition-colors duration-200 font-['Raleway'] ${getStatusStyles(
                      booking.bookingType,
                      booking.status
                    )}`}
                  >
                    {getStatusText(booking.bookingType, booking.status)}
                  </div>
                </div>
              </div>
              <div className="self-stretch inline-flex flex-col sm:flex-row items-start justify-between sm:items-center gap-2 sm:gap-0">
                <div className="text-gray-600 text-xs sm:text-sm font-medium font-['Raleway'] leading-none">
                  {booking.isComp.charAt(0).toUpperCase() +
                    booking.isComp.slice(1)}
                </div>
                <div className="text-gray-600 text-xs sm:text-sm font-medium font-['Raleway'] leading-none">
                  {booking.askToJoin ? "Public Match" : "Private Match"}
                </div>
              </div>
              <div className="self-stretch inline-flex flex-row justify-center items-start gap-2 sm:gap-4">
              <div className="flex-1 flex flex-row justify-start items-center gap-2 sm:gap-3">
  {[0, 1].map((playerIndex) => {
    const player = booking.team1[playerIndex];
    if (player) {
      return (
        <div
          key={playerIndex}
          className="flex-1 inline-flex flex-col justify-center items-center gap-1 sm:gap-1.5 relative"
        >
          <div className="relative w-10 sm:w-12 h-10 sm:h-12 rounded-full">
            <img
              className="w-full h-full rounded-full object-cover"
              src={
                player.imageUrl && player.imageUrl.startsWith("https://")
                  ? player.imageUrl
                  : player.imageUrl
                  ? `${baseImgUrl}/${player.imageUrl}`
                  : dummyUserImg
              }
              alt={player.name}
            />
          </div>
          <div className="text-center justify-center text-dark-blue text-xs sm:text-sm font-medium font-['Raleway'] leading-none mt-1 sm:mt-2">
            {player.name.split(" ")[0]}
          </div>
        </div>
      );
    } else {
  
      return (
        <div
          key={playerIndex}
          className="flex-1 inline-flex flex-col justify-center items-center gap-1 sm:gap-1.5 relative"
        >
          <div
            className="w-10 sm:w-12 h-10 sm:h-12 rounded-full border-2 border-dashed border-gray-400 bg-gray-100 flex items-center justify-center"
            style={{ pointerEvents: "none" }}
          >
                <Plus className="text-gray-400 text-xs sm:text-sm font-medium font-['Raleway'] leading-none"/>
        
          </div>
          <div className="text-center justify-center text-gray-400 text-xs sm:text-sm font-medium font-['Raleway'] leading-none mt-1 sm:mt-2">

          </div>
        </div>
      );
    }
  })}
</div>
                <div className="w-8 sm:w-10 h-8 sm:h-10 relative flex-shrink-0">
                  <div className="w-8 sm:w-10 h-0 left-0 top-[32px] sm:top-[40px] absolute origin-top-left -rotate-90 outline outline-1 outline-offset-[-0.5px] outline-white"></div>
                </div>
                <div className="flex-1 flex flex-row justify-start items-center gap-2 sm:gap-3">
  {[0, 1].map((playerIndex) => {
    const player = booking.team2[playerIndex];
    if (player) {
      return (
        <div
          key={playerIndex}
          className="flex-1 inline-flex flex-col justify-center items-center gap-1 sm:gap-1.5 relative"
        >
          <div className="relative w-10 sm:w-12 h-10 sm:h-12 rounded-full">
            <img
              className="w-full h-full rounded-full object-cover"
              src={
                player.imageUrl && player.imageUrl.startsWith("https://")
                  ? player.imageUrl
                  : player.imageUrl
                  ? `${baseImgUrl}/${player.imageUrl}`
                  : dummyUserImg
              }
              alt={player.name}
            />
          </div>
          <div className="text-center justify-center text-dark-blue text-xs sm:text-sm font-medium font-['Raleway'] leading-none mt-1 sm:mt-2">
            {player.name.split(" ")[0]}
          </div>
        </div>
      );
    } else {

      return (
        <div
          key={playerIndex}
          className="flex-1 inline-flex flex-col justify-center items-center gap-1 sm:gap-1.5 relative"
        >
          <div
            className="w-10 sm:w-12 h-10 sm:h-12 rounded-full border-2 border-dashed border-gray-400 bg-gray-100 flex items-center justify-center"
            style={{ pointerEvents: "none" }}
          >
              <Plus className="text-gray-400 text-xs sm:text-sm font-medium font-['Raleway'] leading-none"/>
        
          </div>
          <div className="text-center justify-center text-gray-400 text-xs sm:text-sm font-medium font-['Raleway'] leading-none mt-1 sm:mt-2">
         
          </div>
        </div>
      );
    }
  })}
</div>
              </div>
              <div className="w-full inline-flex justify-between items-center gap-1 sm:gap-2">
                <div className="inline-flex justify-start items-center gap-1 sm:gap-2 flex-grow">
                  <MapPin className="w-3 sm:w-4 h-3 sm:h-4 text-dark-blue" />
                  <div className="justify-center text-gray-600 text-xs sm:text-sm font-normal font-['Raleway'] leading-none">
                    {booking.location}
                  </div>
                </div>
                <div className="flex justify-end items-center gap-2 flex-shrink-0">
                  {booking.status.toLowerCase() === "upcoming" &&
                    isWithin24Hours(booking.bookingdate) &&
                    booking.bookingType.toLowerCase() !== "cancelled" &&
                    userData &&
                    userData._id === booking.userId && (
                      <button
                        className="px-4 sm:px-5 py-1.5 sm:py-1.5 rounded-md text-xs sm:text-sm font-medium font-['Raleway'] bg-red-600 text-white hover:bg-red-700 transition-colors duration-200"
                        onClick={(e) => {
                          e.stopPropagation();
                          openCancelModal(booking.bookingId);
                        }}
                      >
                        Cancel
                      </button>
                    )}
                  {booking.status.toLowerCase() === "previous" &&
                    userData &&
                    userData._id === booking.userId && (
                      <button
                        className={`px-4 sm:px-4 py-1.5 sm:py-1.5 rounded-md text-xs sm:text-sm font-medium font-['Raleway'] text-white transition-colors duration-200 ${
                          booking.score &&
                          Object.keys(booking.score).length > 0
                            ? "bg-dark-blue hover:bg-blue-600"
                            : "bg-blue-600 hover:bg-blue-700"
                        }`}
                        onClick={(e) => {
                          e.stopPropagation();
                          openUploadScoreModal(
                            booking.bookingId,
                            booking.game,
                            booking.score
                          );
                        }}
                      >
                        {booking.score &&
                        Object.keys(booking.score).length > 0
                          ? "Update"
                          : "Upload"}
                      </button>
                    )}
                </div>
              </div>
              {booking.score && Object.keys(booking.score).length > 0 ? (
                <div className="w-full flex gap-2 items-center justify-between">
                  <div className="text-gray-600 text-xs sm:text-sm font-medium font-['Raleway'] flex justify-center items-center gap-2">
                    <span>Score</span>
                  </div>
                  <div className="flex flex-col text-gray-600 text-xs sm:text-sm font-medium font-['Raleway'] text-start gap-2">
                    <span>Team 1</span>
                    <hr className="w-full border-gray-300" />
                    <span>Team 2</span>
                  </div>
                  <div className="flex flex-col gap-2">
                    <div className="flex justify-center gap-6 sm:gap-8">
                      {(["set1", "set2", "set3"] as const).map((set) =>
                        booking.score[set] &&
                        (booking.score[set].team1 !== "" ||
                          booking.score[set].team2 !== "") ? (
                          <div
                            key={set}
                            className="text-gray-600 text-xs sm:text-sm font-medium font-['Raleway']"
                          >
                            {booking.score[set].team1}
                          </div>
                        ) : null
                      )}
                    </div>
                    <hr className="w-full border-gray-300" />
                    <div className="flex justify-center gap-6 sm:gap-8">
                      {(["set1", "set2", "set3"] as const).map((set) =>
                        booking.score[set] &&
                        (booking.score[set].team1 !== "" ||
                          booking.score[set].team2 !== "") ? (
                          <div
                            key={set}
                            className="text-gray-600 text-xs sm:text-sm font-medium font-['Raleway']"
                          >
                            {booking.score[set].team2}
                          </div>
                        ) : null
                      )}
                    </div>
                  </div>
                </div>
              ): (<>
              <div>
               
              </div>
              </>)}
            </div>
          </motion.div>
        ))}
      </div>
    </div>
  ))}

  {/* Cancel Confirmation Modal */}
  {showCancelModal && (
    <motion.div
      className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
    >
      <motion.div
        className="bg-white rounded-lg p-6 w-full max-w-md mx-4 sm:mx-0"
        variants={modalVariants}
        initial="hidden"
        animate="visible"
        exit="exit"
      >
        <h2 className="text-lg sm:text-xl font-semibold font-['Raleway'] text-gray-800 mb-4">
          Confirm Cancellation
        </h2>
        <p className="text-sm sm:text-base font-['Raleway'] text-gray-600 mb-6">
          Are you sure you want to cancel this booking? This action cannot be undone.
        </p>
        <div className="flex justify-end gap-3">
          <button
            className="px-4 py-2 rounded-md text-sm sm:text-base font-medium font-['Raleway'] bg-gray-200 text-gray-600 hover:bg-gray-300 transition-colors duration-200"
            onClick={closeCancelModal}
          >
            Cancel
          </button>
          <button
            className="px-4 py-2 rounded-md text-sm sm:text-base font-medium font-['Raleway'] bg-red-600 text-white hover:bg-red-700 transition-colors duration-200"
            onClick={() =>
              selectedBookingId && handleCancelBooking(selectedBookingId)
            }
          >
            Confirm
          </button>
        </div>
      </motion.div>
    </motion.div>
  )}

  {/* Info Modal */}
  {showInfoModal && (
    <motion.div
      className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
    >
      <motion.div
        className="bg-white rounded-lg p-6 w-full max-w-md mx-4 sm:mx-0"
        variants={modalVariants}
        initial="hidden"
        animate="visible"
        exit="exit"
      >
      <h2 className="text-lg sm:text-xl font-semibold font-['Raleway'] text-gray-800 mb-4">
  Couldn't Modify This Booking.
</h2>
<p className="text-sm sm:text-base font-['Raleway'] text-gray-600 mb-6">
  {infoMessage}
</p>
        <div className="flex justify-end gap-3">
          <button
            className="px-4 py-2 rounded-md text-sm sm:text-base font-medium font-['Raleway'] bg-gray-200 text-gray-600 hover:bg-gray-300 transition-colors duration-200"
            onClick={closeInfoModal}
          >
            Cancel
          </button>
        </div>
      </motion.div>
    </motion.div>
  )}

  {/* Modify Booking Modal */}
  {showModifyModal && (
    <motion.div
      className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
    >
      <motion.div
        className="bg-white rounded-lg p-4 sm:p-6 max-w-[95vw] sm:max-w-[700px] max-h-[90vh] overflow-y-auto w-0"
        variants={modalVariants}
        initial="hidden"
        animate="visible"
        exit="exit"
      >
        <ModifyBooking
          isOpen={showModifyModal}
          onClose={closeModifyModal}
          bookingId={selectedBookingId || ""}
          friends={friends}
          onPlayerSelect={handlePlayerSelect}
          onFriendsUpdate={handleFriendsUpdate}
          onScoreUpdate={onScoreUpdate}
        />
      </motion.div>
    </motion.div>
  )}

  {/* Upload Score Modal */}
  {showUploadScoreModal && (
    <motion.div
      className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
    >
      <motion.div
        className="bg-white rounded-lg p-4 sm:p-6 w-full max-w-[85vw] sm:max-w-[650px] max-h-[85vh] overflow-y-auto hide-scrollbar"
        variants={modalVariants}
        initial="hidden"
        animate="visible"
        exit="exit"
      >
        <UploadScoreModal
          isOpen={showUploadScoreModal}
          onClose={closeUploadScoreModal}
          bookingId={selectedBookingId || ""}
          gameType={selectedGameType || ""}
          team1={
            bookingGroups
              .flatMap((group) => group.bookings)
              .find((booking) => booking.bookingId === selectedBookingId)
              ?.team1 || []
          }
          team2={
            bookingGroups
              .flatMap((group) => group.bookings)
              .find((booking) => booking.bookingId === selectedBookingId)
              ?.team2 || []
          }
          score={
            bookingGroups
              .flatMap((group) => group.bookings)
              .find((booking) => booking.bookingId === selectedBookingId)
              ?.score || {}
          }
          onScoreUpdate={onScoreUpdate}
        />
      </motion.div>
      

    </motion.div>
  )}
</div>
</>
  );
};

export default MyBookings;
