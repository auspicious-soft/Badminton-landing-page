import React, { useState, useEffect } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { X } from "lucide-react";
import userImg from "../../assets/dashboarduser.png";
import { baseImgUrl, URLS } from "../../utils/urls";
import { getApi, putApi } from "../../utils/api";
import SelectFriendModal from "./FriendsModal";
import Loader from "./Loader";
import { useToast } from "../../utils/ToastContext";
import { error } from "console";

interface Player {
  id: string | number;
  name: string;
  image?: string | null;
  type: "user" | "guest" | "available";
}

interface MatchData {
  _id: string;
  gameType: string;
  team1: Array<{
    playerId: string;
    playerType: string;
    playerData: { _id: string; fullName: string; profilePic?: string | null };
  }>;
  team2: Array<{
    playerId: string;
    playerType: string;
    playerData: { _id: string; fullName: string; profilePic?: string | null };
  }>;
  venueId: { name: string; address: string; city: string; image?: string };
  courtId: { games: string };
  bookingDate: string;
  bookingSlots: string;
}

interface ModifyBookingProps {
  isOpen: boolean;
  onClose: () => void;
  bookingId: string;
  friends: Player[];
  onPlayerSelect: (
    team: "team1" | "team2",
    index: number,
    player: Player
  ) => void;
  onFriendsUpdate: (friends: Player[]) => void;
  onScoreUpdate: () => void;

}

const ModifyBooking: React.FC<ModifyBookingProps> = ({
  isOpen,
  onClose,
  bookingId,
  friends,
  onPlayerSelect,
  onFriendsUpdate,
  onScoreUpdate
}) => {
  const [matchData, setMatchData] = useState<MatchData | null>(null);
  const [selectedSlot, setSelectedSlot] = useState<{
    team: "team1" | "team2";
    index: number;
  } | null>(null);
  const [showFriendsModal, setShowFriendsModal] = useState(false);
  const [loading, setLoading] = useState(false);
  const {successToast, errorToast}= useToast()
  useEffect(() => {
    if (isOpen && bookingId) {
      const fetchBookingDetails = async () => {
        setLoading(true);
        try {
          const response = await getApi(`/api/user/my-matches/${bookingId}`);
          if (response.status === 200 && response.data.success) {
            setMatchData(response.data.data);
          }
        } catch (error) {
          console.error("Error fetching booking details:", error);
        } finally {
          setLoading(false);
        }
      };
      fetchBookingDetails();
    }
  }, [isOpen, bookingId]);

  const selectedFriendIds = [
    ...(matchData?.team1 || []).map((p) => p.playerId),
    ...(matchData?.team2 || []).map((p) => p.playerId),
  ];

  const formattedDate = matchData?.bookingDate
    ? new Date(matchData.bookingDate).toLocaleDateString("en-US", {
        day: "numeric",
        month: "short",
        year: "numeric",
      })
    : "";

  const team1Players = matchData?.team1
    ? [...matchData.team1, ...Array(2 - matchData.team1.length).fill(null)]
    : Array(2).fill(null);
  const team2Players = matchData?.team2
    ? [...matchData.team2, ...Array(2 - matchData.team2.length).fill(null)]
    : Array(2).fill(null);

  const handlePlayerClick = (team: "team1" | "team2", index: number) => {
    setSelectedSlot({ team, index });
    setShowFriendsModal(true);
  };

  const handleFriendSelect = (friend: Player) => {
    if (selectedSlot) {
      const { team, index } = selectedSlot;
      setMatchData((prev) => {
        if (!prev) return prev;
        const updatedTeam = [...prev[team]];
        updatedTeam[index] = {
          playerId: friend.id.toString(),
          playerType:
            team === "team1" ? `player${index + 1}` : `player${index + 3}`,
          playerData: {
            _id: friend.id.toString(),
            fullName: friend.name,
            profilePic: friend.image,
          },
        };
        return { ...prev, [team]: updatedTeam };
      });
      setSelectedSlot(null);
      setShowFriendsModal(false);
    }
  };

  const handleRemovePlayer = (team: "team1" | "team2", index: number) => {
    if (index === 0 && team === "team1") return;
    setMatchData((prev) => {
      if (!prev) return prev;
      const updatedTeam = [...prev[team]];
      updatedTeam[index] = undefined as any; // Temporarily bypass TypeScript error
      return {
        ...prev,
        [team]: updatedTeam.filter((player) => player !== undefined),
      };
    });
  };

  const handleUpdate = async () => {
    setLoading(true);
    try {
      const team1 =
        matchData?.team1
          .filter((player) => player !== null)
          .map((player, index) => ({
            playerId: player.playerId,
          })) || [];
      const team2 =
        matchData?.team2
          .filter((player) => player !== null)
          .map((player, index) => ({
            playerId: player.playerId,
          })) || [];

      const response = await putApi(`${URLS.modifyBooking}/${bookingId}`, {
        team1,
        team2,
      });

      if (response.status === 200) {
        team1.forEach((player, index) => {
          const friend = friends.find(
            (f) => f.id.toString() === player.playerId
          );
          if (friend) {
            onPlayerSelect("team1", index, friend);
          }
        });
        team2.forEach((player, index) => {
          const friend = friends.find(
            (f) => f.id.toString() === player.playerId
          );
          if (friend) {
            onPlayerSelect("team2", index, friend);
          }
        });
        onScoreUpdate()
        onClose();
        successToast(response.data.message)
      } else {
        errorToast("Failed to update players");
      }
    } catch (error:any) {
     errorToast(error?.response.data.message);
    } finally {
      setLoading(false);
    }
  };

  const renderPlayerSlot = (
    player: any,
    team: "team1" | "team2",
    index: number
  ) => {
    if (player?.playerData) {
      return (
        <motion.div
          key={`${team}-${index}`}
          className="flex flex-col items-center gap-1 relative"
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.3 }}
        >
          <div className="relative">
            <img
              className="w-8 xs:w-10 sm:w-12 md:w-14 h-8 xs:h-10 sm:h-12 md:h-14 rounded-full object-cover"
              src={
                player.playerData.profilePic
                  ? player.playerData.profilePic.startsWith("https")
                    ? player.playerData.profilePic
                    : `${baseImgUrl}/${player.playerData.profilePic}`
                  : userImg
              }
              alt={player.playerData.fullName}
            />
            {(index !== 0 || team !== "team1") && (
              <button
                className="absolute -top-1 -right-1 bg-red-600 text-white rounded-full w-4 xs:w-5 sm:w-6 h-4 xs:h-5 sm:h-6 flex items-center justify-center text-xs"
                onClick={() => handleRemovePlayer(team, index)}
              >
                <X className="w-3 xs:w-4 sm:w-5 h-3 xs:h-4 sm:h-5" />
              </button>
            )}
          </div>
          <span className="text-center text-gray-900 text-[10px] xs:text-xs sm:text-sm md:text-base font-medium font-['Raleway'] leading-tight truncate max-w-[60px] xs:max-w-[80px] sm:max-w-[100px] md:max-w-[120px]">
            {player.playerData.fullName}
          </span>
        </motion.div>
      );
    } else {
      return (
        <motion.div
          key={`${team}-${index}`}
          className="flex flex-col items-center gap-1 cursor-pointer"
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.3 }}
          onClick={() => handlePlayerClick(team, index)}
        >
          <div className="w-8 xs:w-10 sm:w-12 md:w-14 h-8 xs:h-10 sm:h-12 md:h-14 flex justify-center items-center bg-zinc-100 rounded-full">
            <span className="text-gray-900 text-[10px] xs:text-xs sm:text-sm md:text-base font-medium">
              <X className="rotate-45 w-3 xs:w-4 sm:w-5 md:w-6 h-3 xs:h-4 sm:h-5 md:h-6" />
            </span>
          </div>
          <span className="text-center text-gray-900 text-[10px] xs:text-xs sm:text-sm md:text-base font-medium font-['Raleway'] leading-tight">
            Available
          </span>
        </motion.div>
      );
    }
  };

  return (
    <>
      {loading && <Loader fullScreen />}

      <style>
        {`
          @media (max-width: 350px) {
            .teams-container {
              flex-direction: column;
              align-items: center;
            }
            .team {
              justify-content: center;
              width: 100%;
            }
          }
        `}
      </style>
      <AnimatePresence>
        {isOpen && (
          <motion.div
            className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50 p-2 sm:p-4"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.3 }}
          >
            <motion.div
              className="relative bg-white rounded-[12px] sm:rounded-[20px] p-4 sm:p-6 pt-8 sm:pt-10 w-full max-w-[80vw]  sm:max-w-[500px] md:max-w-[730px] max-h-[75vh] overflow-y-auto"
              initial={{ scale: 0.8, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.8, opacity: 0 }}
              transition={{ duration: 0.3 }}
            >
              <button
                className="absolute top-2 right-2 sm:top-4 sm:right-4 text-gray-600 hover:text-red-600"
                onClick={onClose}
              >
                <X className="w-5 h-5 sm:w-6 sm:h-6" />
              </button>
              {matchData ? (
                <div className="w-full flex flex-col gap-4 sm:gap-6">
                  <img
                    className="w-full h-28 sm:h-36 md:h-44 rounded-[8px] sm:rounded-[12px] object-cover"
                    src={
                      matchData.venueId.image
                        ? `${baseImgUrl}/${matchData.venueId.image}`
                        : userImg
                    }
                    alt="Venue banner"
                  />
                  <div className="w-full flex flex-col gap-3 sm:gap-4">
                    <div className="w-full flex flex-col sm:flex-row justify-between items-start sm:items-center gap-2 sm:gap-3">
                      <div className="text-gray-900 text-sm sm:text-base md:text-lg font-semibold font-['Raleway']">
                        {matchData.courtId.games} Game
                      </div>
                      <div className="text-gray-900 text-xs sm:text-sm md:text-base font-semibold font-['Raleway']">
                        60 Mins
                      </div>
                    </div>
                    <div className="w-full flex flex-col sm:flex-row justify-between items-start sm:items-center gap-2 sm:gap-3">
                      <div className="text-gray-900 text-xs sm:text-sm md:text-base font-medium font-['Raleway'] truncate max-w-full">
                        {matchData.venueId.address}, {matchData.venueId.city}
                      </div>
                      <div className="flex flex-col sm:flex-row gap-1 sm:gap-2">
                        <div className="flex items-center gap-1 sm:gap-1.5 text-gray-500 text-xs sm:text-sm font-medium">
                          <span>{formattedDate}</span>
                        </div>
                        <div className="flex items-center gap-1 sm:gap-1.5 text-gray-500 text-xs sm:text-sm font-medium">
                          <span>{matchData.bookingSlots}</span>
                        </div>
                      </div>
                    </div>
                    <div className="w-full flex teams-container justify-between items-center gap-3 sm:gap-4">
                      <div className="flex-1 team flex justify-center gap-3 sm:gap-4">
                        {team1Players.map((player, index) =>
                          renderPlayerSlot(player, "team1", index)
                        )}
                      </div>
                      <div className="flex-none text-gray-900 text-sm sm:text-base md:text-lg font-semibold">
                        VS
                      </div>
                      <div className="flex-1 team flex justify-center gap-3 sm:gap-4">
                        {team2Players.map((player, index) =>
                          renderPlayerSlot(player, "team2", index)
                        )}
                      </div>
                    </div>
                    <div className="w-full flex justify-center">
                      <button
                        className="px-4 py-3 sm:px-4 sm:py-2 rounded-md text-sm sm:text-base md:text-lg font-medium font-['Raleway'] bg-blue-600 text-white hover:bg-blue-700 transition-colors duration-200 w-full sm:w-auto"
                        onClick={handleUpdate}
                      >
                        Update
                      </button>
                    </div>
                  </div>
                </div>
              ) : (
                <div className="text-gray-600 text-sm sm:text-base font-['Raleway'] text-center">
                  Loading booking details...
                </div>
              )}
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
      <SelectFriendModal
        isOpen={showFriendsModal}
        onClose={() => setShowFriendsModal(false)}
        onSelect={handleFriendSelect}
        friends={friends}
        selectedFriendIds={selectedFriendIds}
        onFriendsUpdate={onFriendsUpdate}
      />
    </>
  );
};

export default ModifyBooking;
