import React, { useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import paddleImage from "../../assets/paddelimage.png";
import userImg from "../../assets/dashboarduser.png";
import { Plus, Calendar, Clock, X } from "lucide-react";
import { baseImgUrl } from "../../utils/urls";
import { useAuth } from "../../utils/AuthContext";
import PaymentCard from "../common/PaymentCardModal";
import JoinGame from "../common/JoinGame";
import { useToast } from "../../utils/ToastContext";

interface Player {
  id: string;
  name: string;
  image?: string | null;
  type: "user" | "available";
}

interface GameDetailsCardProps {
  matchData: any;
  friends: Player[];
  onPlayerSelect: (
    team: "team1" | "team2",
    index: number,
    friend: Player
  ) => void;
  onJoinSuccess: () => void; // Add callback prop
}

const GameDetailsCard: React.FC<GameDetailsCardProps> = ({
  matchData,
  friends,
  onPlayerSelect,
  onJoinSuccess,
}) => {
  const [selfSlot, setSelfSlot] = useState<{
    team: "team1" | "team2";
    index: number;
  } | null>(null);
  const [showPaymentModal, setShowPaymentModal] = useState(false);
  const [showJoinGameModal, setShowJoinGameModal] = useState(false);
  const [selectedTeam, setSelectedTeam] = useState<"team1" | "team2" | null>(null);
  const [selectedPosition, setSelectedPosition] = useState<string | null>(null);
  const { userData } = useAuth();
  const { successToast, errorToast } = useToast();

  if (!userData) {
    return null;
  }

  if (!matchData) {
    return (
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        exit={{ opacity: 0, y: 20 }}
        transition={{ duration: 0.5, ease: "easeInOut" }}
        className="p-4 bg-white rounded-2xl shadow-[0px_4px_20px_0px_rgba(92,138,255,0.10)]"
      >
        <div className="text-gray-600 text-sm font-['Raleway'] text-center">
          Select a match to view details
        </div>
      </motion.div>
    );
  }

  const {
    venueId,
    courtId,
    bookingDate,
    bookingSlots,
    gameType,
    team1,
    team2,
    askToJoin,
    bookingAmount,
    _id,
  } = matchData;

  const formattedDate = new Date(bookingDate).toLocaleDateString("en-US", {
    day: "numeric",
    month: "short",
    year: "numeric",
  });

  const totalPlayers = team1.length + team2.length;
  const equipmentRented =
    team1.reduce(
      (sum: number, player: any) => sum + player.rackets + player.balls,
      0
    ) +
    team2.reduce(
      (sum: number, player: any) => sum + player.rackets + player.balls,
      0
    );

  const team1Players = [...team1, ...Array(2 - team1.length).fill(null)];
  const team2Players = [...team2, ...Array(2 - team2.length).fill(null)];

  const handleSelfClick = (team: "team1" | "team2", index: number) => {
    if (selfSlot?.team === team && selfSlot.index === index) {
      const emptySlot: Player = {
        id: `${Date.now()}`,
        name: "Available",
        image: null,
        type: "available",
      };
      onPlayerSelect(team, index, emptySlot);
      setSelfSlot(null);
      setSelectedTeam(null);
      setSelectedPosition(null);
    }
  };

  const handlePlusClick = (team: "team1" | "team2", index: number) => {
    if (selfSlot) return;

    const selfPlayer: Player = {
      id: userData._id,
      name: "You",
      image: userData.picture?.startsWith("https:")
        ? userData.picture
        : `${baseImgUrl}/${userData.profilePic}` || userImg,
      type: "user",
    };

    const position =
      team === "team1"
        ? index === 0
          ? "player1"
          : "player2"
        : index === 0
        ? "player3"
        : "player4";

    onPlayerSelect(team, index, selfPlayer);
    setSelfSlot({ team, index });
    setSelectedTeam(team);
    setSelectedPosition(position);
    setShowJoinGameModal(true);
  };

  const handleJoinGameButtonClick = () => {
    if (!selfSlot) {
      errorToast("Please select an available slot in a team");
      return;
    }
    setShowJoinGameModal(true);
  };

  const handleCloseJoinGameModal = () => {
    setShowJoinGameModal(false);
    if (selfSlot) {
      const emptySlot: Player = {
        id: `${Date.now()}`,
        name: "Available",
        image: null,
        type: "available",
      };
      onPlayerSelect(selfSlot.team, selfSlot.index, emptySlot);
      setSelfSlot(null);
      setSelectedTeam(null);
      setSelectedPosition(null);
    }
  };

  const renderPlayerSlot = (
    player: any,
    team: "team1" | "team2",
    index: number
  ) => {
    if (player?.playerData && player.playerData.type !== "available") {
      const isSelf = player.playerData.id === userData._id;
      const playerImage =
        player.playerData.image &&
        player.playerData.image.trim() !== "" &&
        player.playerData.image.trim().toLowerCase() !== "null"
          ? player.playerData.image.startsWith("https://")
            ? player.playerData.image
            : `${baseImgUrl}/${player.playerData.image}`
          : userImg;
      console.log(
        `Player: ${player.playerData.name}, Raw Image: ${player.playerData.image}, Processed Image: ${playerImage}`
      );
      return (
        <motion.div
          key={`${team}-${index}`}
          className={`flex flex-col items-center gap-1.5 ${isSelf ? "cursor-pointer" : ""}`}
          onClick={() => isSelf && handleSelfClick(team, index)}
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.3 }}
        >
          <img
            className={`w-10 h-10 rounded-full ${isSelf ? "border-2 border-blue-500" : ""} sm:w-12 sm:h-12`}
            src={isSelf ? (userData.picture?.startsWith("https:") ? userData.picture : `${baseImgUrl}/${userData.profilePic}` || userImg) : playerImage}
            alt={isSelf ? "You" : `${player.playerData.name} avatar`}
          />
          <span className="text-center text-gray-900 text-xs font-medium font-['Raleway'] leading-tight truncate max-w-[80px] sm:max-w-[100px]">
            {isSelf ? "You" : player.playerData.name.split(" ")[0]}
          </span>
        </motion.div>
      );
    } else {
      return (
        <motion.div
          key={`${team}-${index}`}
          className="flex flex-col items-center gap-1.5"
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.3 }}
        >
          <div
            className="w-10 h-10 flex justify-center items-center bg-zinc-100 rounded-full cursor-pointer sm:w-12 sm:h-12"
            onClick={() => handlePlusClick(team, index)}
          >
            <Plus className="w-4 h-4 text-gray-900 sm:w-5 sm:h-5" />
          </div>
          <span className="text-center text-gray-900 text-xs font-medium font-['Raleway'] leading-tight">
            Available
          </span>
        </motion.div>
      );
    }
  };

  return (
    <>
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        exit={{ opacity: 0, y: 20 }}
        transition={{ duration: 0.5, ease: "easeInOut" }}
        className="p-4 bg-white rounded-2xl shadow-[0px_4px_20px_0px_rgba(92,138,255,0.10)] w-full max-w-2xl mx-auto"
      >
        <div className="w-full flex flex-col gap-6">
          <img
            className="w-full h-32 rounded-xl object-cover sm:h-36"
            src={venueId.image ? `${baseImgUrl}/${venueId.image}` : paddleImage}
            alt="Venue banner"
          />
          <div className="w-full flex flex-col gap-6">
            {/* Game Info */}
            <div className="w-full flex flex-col sm:flex-row justify-between items-start sm:items-center gap-2">
              <div className="text-gray-900 text-base font-semibold font-['Raleway'] sm:text-lg">
                {courtId.games} Game
              </div>
              <div className="text-gray-900 text-sm font-semibold font-['Raleway']">
                120 Mins
              </div>
            </div>

            {/* Location & Date */}
            <div className="w-full flex flex-col sm:flex-row justify-between items-start sm:items-center gap-2">
              <div className="text-gray-900 text-sm font-medium font-['Raleway'] truncate max-w-full">
                {venueId.address}, {venueId.city}
              </div>
              <div className="flex flex-col sm:flex-row gap-2">
                <div className="flex items-center gap-1.5 text-gray-500 text-xs font-medium">
                  <Calendar className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
                  {formattedDate}
                </div>
                <div className="flex items-center gap-1.5 text-gray-500 text-xs font-medium">
                  <Clock className="w-4 h-4 sm:w-5 sm:h-5" /> {bookingSlots}
                </div>
              </div>
            </div>

            {/* Created By, Players, Equipment */}
            <div className="w-full flex flex-col gap-3">
              <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-2">
                <div className="text-gray-900 text-sm font-semibold">
                  Created By
                </div>
                <div className="flex items-center gap-2 max-w-[150px] sm:max-w-[180px]">
                  <img
                    className="w-6 h-6 rounded-full sm:w-7 sm:h-7"
                    src={
                      team1[0]?.playerData.image
                        ? team1[0].playerData.image.startsWith("https")
                          ? team1[0].playerData.image
                          : `${baseImgUrl.replace(/\/$/, "")}/${team1[0].playerData.image.replace(/^\//, "")}`
                        : userImg
                    }
                    alt="Creator avatar"
                  />
                  <span className="text-xs font-medium truncate sm:text-sm">
                    {team1[0]?.playerData.name || "Unknown"}
                  </span>
                </div>
              </div>
              <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-2">
                <div className="text-gray-900 text-sm font-semibold">
                  Players
                </div>
                <div className="text-xs font-medium sm:text-sm">
                  {totalPlayers}
                </div>
              </div>
              <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-2">
                <div className="text-gray-900 text-sm font-semibold">
                  Equipment Rented
                </div>
                <div className="text-xs font-medium sm:text-sm">
                  {equipmentRented > 0 ? `${equipmentRented} items` : "None"}
                </div>
              </div>
            </div>

            {/* Teams */}
            <div className="w-full flex flex-col items-center gap-8">
              <div className="flex flex-col sm:flex-row items-center gap-4">
                {/* Team 1 */}
                <div className="flex gap-6">
                  {team1Players.map((player, index) =>
                    renderPlayerSlot(player, "team1", index)
                  )}
                </div>

                <div className="text-gray-900 text-sm font-semibold sm:text-base">
                  VS
                </div>

                {/* Team 2 */}
                <div className="flex gap-6">
                  {team2Players.map((player, index) =>
                    renderPlayerSlot(player, "team2", index)
                  )}
                </div>
              </div>

              {askToJoin && (
                <button
                  className="w-full h-10 px-4 py-2 bg-dark-blue rounded-3xl flex justify-center items-center gap-2 cursor-pointer hover:bg-blue-700 transition-colors sm:h-12 sm:px-6 sm:py-3"
                  onClick={handleJoinGameButtonClick}
                >
                  <div className="text-white text-sm font-medium sm:text-base">
                    Join Game
                  </div>
                </button>
              )}
            </div>
          </div>
        </div>
      </motion.div>

      <AnimatePresence>
        {showJoinGameModal && (
          <motion.div
            className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50 p-4"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.3 }}
          >
            <motion.div
              className="relative bg-white rounded-2xl p-4 w-full max-w-[95vw] sm:max-w-[800px] md:max-w-[800px]"
              initial={{ scale: 0.8, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.8, opacity: 0 }}
              transition={{ duration: 0.3 }}
            >
              <button
                className="absolute top-2 right-2 text-gray-600 hover:text-red-600 sm:top-4 sm:right-4"
                onClick={handleCloseJoinGameModal}
              >
                <X className="w-5 h-5 sm:w-6 sm:h-6" />
              </button>
              <JoinGame
                bookingId={_id}
                requestedPosition={selectedPosition || "player1"}
                imageUrl={
                  venueId.image ? `${baseImgUrl}/${venueId.image}` : paddleImage
                }
                requestedTeam={selectedTeam || "team1"}
                onClose={handleCloseJoinGameModal}
                onJoinSuccess={onJoinSuccess} // Pass callback
              />
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
};

export default GameDetailsCard;