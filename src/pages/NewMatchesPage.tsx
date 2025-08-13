import React, { useEffect, useRef, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { getApi } from "../utils/api";
import { URLS, baseImgUrl } from "../utils/urls";
import { useAuth } from "../utils/AuthContext";
import DatePicker, { CalendarContainer } from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import Loader from "../components/common/Loader";
import { useToast } from "../utils/ToastContext";
import { ChevronDown, ChevronUp, X } from "lucide-react";
import Pagination from "../components/common/Pagination";
import JoinGame from "../components/common/JoinGame";
import paddleImage from "../assets/paddelimage.png"; // Assuming the import path

interface PlayerSlot {
  name: string;
  profilePic: string | null;
}

interface Game {
  id: string;
  type: string;
  duration: string;
  slots: (PlayerSlot | null)[];
  location: string;
  time: string;
  matchType: string;
  imageUrl: string;
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
  onSlotClick,
}: {
  slots: (PlayerSlot | null)[];
  onSlotClick: (slotIndex: number) => void;
}) => {
  const colors = getAvatarColors();
  const maxDisplay = 4;
  const displayItems = slots.slice(0, maxDisplay);

  return (
    <div className="flex items-center -space-x-2">
      {displayItems.map((item, i) => {
        if (item !== null) {
          const isYou = item?.name === "You";
          return (
            <motion.div
              key={`player-${i}`}
              initial={{ scale: 0, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              transition={{ delay: i * 0.1, type: "spring", stiffness: 300 }}
              className={`w-8 h-8 sm:w-10 sm:h-10 rounded-full ${
                colors[i % colors.length]
              } 
                flex items-center justify-center text-white text-xs sm:text-sm font-semibold 
                border-2 border-white shadow-lg relative z-10 ${
                  isYou ? "cursor-pointer" : ""
                }`}
              style={{ zIndex: maxDisplay - i }}
              whileHover={{ scale: 1.1, zIndex: 20 }}
              onClick={isYou ? () => onSlotClick(i) : undefined}
            >
            {item?.profilePic ? (
  <img
    src={item.profilePic}
    alt={item.name}
    className="w-full h-full rounded-full object-cover"
  />
) : (
  <span className="text-white font-semibold">
    {item?.name?.charAt(0).toUpperCase()}
  </span>
)}

            </motion.div>
          );
        } else {
          return (
            <motion.div
              key={`empty-${i}`}
              initial={{ scale: 0, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              transition={{ delay: i * 0.1, type: "spring", stiffness: 300 }}
              className="w-8 h-8 sm:w-10 sm:h-10 rounded-full border-2 border-dashed 
                border-gray-400 bg-gray-100 flex items-center justify-center relative cursor-pointer"
              style={{ zIndex: maxDisplay - i }}
              whileHover={{ scale: 1.1, borderColor: "#3B82F6" }}
              onClick={() => onSlotClick(i)}
            >
              <span className="text-gray-400 text-lg">+</span>
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
          className="w-8 h-8 sm:w-10 sm:h-10 rounded-full bg-gray-500 
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

const GameCard = ({
  game,
  index,
  onSlotClick,
  onJoinClick,
  isSelected,
}: {
  game: Game;
  index: number;
  onSlotClick: (slotIndex: number) => void;
  onJoinClick: () => void;
  isSelected: boolean;
}) => {
  const openSpots = game.slots.filter((s) => s === null).length;

  
  return (
  <motion.div
  initial={{ opacity: 0, y: 20 }}
  animate={{ opacity: 1, y: 0 }}
  transition={{ delay: index * 0.1, duration: 0.3 }}
  whileHover={{
    scale: 1.02,
    boxShadow: "0 10px 25px rgba(59, 130, 246, 0.15)",
    transition: { duration: 0.2 },
  }}
  className="bg-gradient-to-r from-blue-light to-indigo-light hover:from-blue-50 hover:to-indigo-50
    rounded-xl p-4 sm:p-6 mb-6 shadow-sm border border-blue-100 
    transition-all duration-300 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 hover:shadow-lg"
>
  <div className="flex-1 min-w-0 w-full">
    {/* Title + duration */}
    <motion.div
      className="flex flex-wrap items-center gap-2 mb-3"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ delay: index * 0.1 + 0.2 }}
    >
      <span className="text-lg sm:text-xl font-bold text-gray-900 truncate">{game.type}</span>
      <span className="hidden sm:inline text-gray-400">•</span>
      <span className="text-sm sm:text-base text-gray-600 font-medium">{game.duration}</span>
    </motion.div>

    {/* Avatars + spots */}
    <motion.div
      className="flex flex-wrap items-center gap-2 mb-3"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ delay: index * 0.1 + 0.3 }}
    >
      <PlayerAvatars slots={game.slots} onSlotClick={onSlotClick} />
      <span className="text-gray-500 text-xs sm:text-sm truncate">
        {game.slots
          .filter((s) => s !== null)
          .map((s) => (s as PlayerSlot).name)
          .join(", ")}{" "}
        {openSpots > 0 && `+ ${openSpots} spots open`}
      </span>
    </motion.div>

    {/* Location */}
    <motion.div
      className="flex items-center gap-2 text-gray-600 mb-2"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ delay: index * 0.1 + 0.4 }}
    >
      <span className="text-base">📍</span>
      <span className="text-sm sm:text-base truncate">{game.location}</span>
    </motion.div>

    {/* Time */}
    <motion.div
      className="flex items-center gap-2 text-gray-600"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ delay: index * 0.1 + 0.5 }}
    >
      <span className="text-base">📅</span>
      <span className="text-sm sm:text-base">{game.time}</span>
    </motion.div>
  </div>

  {/* Right side */}
<div className="flex flex-row sm:flex-col sm:items-end justify-between sm:justify-center gap-4 w-full sm:w-auto">
  <motion.span
    className="text-xs sm:text-sm text-gray-500 bg-gray-100 px-2 py-1 rounded-full whitespace-nowrap"
    initial={{ opacity: 0, scale: 0.8 }}
    animate={{ opacity: 1, scale: 1 }}
    transition={{ delay: index * 0.1 + 0.6 }}
  >
    {game.matchType}
  </motion.span>

  <motion.button
    className={`px-4 sm:px-6 py-2 sm:py-3 rounded-lg font-semibold text-sm sm:text-base transition-all duration-200
      sm:min-w-[140px] sm:max-w-[160px] ${
        openSpots > 0 || isSelected
          ? "bg-blue-500 hover:bg-blue-600 text-white shadow-md hover:shadow-lg"
          : "bg-gray-300 text-gray-500 cursor-not-allowed"
      }`}
    disabled={!(openSpots > 0 || isSelected)}
    whileHover={openSpots > 0 || isSelected ? { scale: 1.05 } : {}}
    whileTap={openSpots > 0 || isSelected ? { scale: 0.95 } : {}}
    initial={{ opacity: 0, y: 10 }}
    animate={{ opacity: 1, y: 0 }}
    transition={{ delay: index * 0.1 + 0.7 }}
    onClick={onJoinClick}
  >
    {openSpots > 0 || isSelected ? "Join Now" : "Full"}
  </motion.button>
</div>


</motion.div>
  );
};

function Venues2() {
  const [games, setGames] = useState<Game[]>([]);
  const [isGameDropdownOpen, setIsGameDropdownOpen] = useState(false);
  const [isDatePickerOpen, setIsDatePickerOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [date, setDate] = useState<string>("");
  const [game, setGame] = useState("all");
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [totalItems, setTotalItems] = useState(0);
  const [showJoinGameModal, setShowJoinGameModal] = useState(false);
  const [selfSlot, setSelfSlot] = useState<{
    gameId: string;
    slot: number;
  } | null>(null);
  const limit = 10;

  const gameDropdownRef = useRef<HTMLDivElement>(null);
  const datePickerRef = useRef<HTMLDivElement>(null);
  const { userData } = useAuth();
  const { successToast, errorToast } = useToast();

  const coordinates = {
    long: userData?.location.coordinates[0],
    lat: userData?.location.coordinates[1],
  };

  const fetchMatches = async () => {
    try {
      setLoading(true);
      const response = await getApi(
        `${URLS.getMatches}?date=${date}&distance=ASC&game=${game}&lng=${coordinates.long}&lat=${coordinates.lat}&page=${currentPage}&limit=${limit}`
      );

      if (response.status === 200) {
        const matches = response.data.data;
        const total = response.data.total || matches.length;
        setTotalItems(total);
        setTotalPages(Math.ceil(total / limit));

        const transformedGames: Game[] = matches.map((match: any) => {
         const team1Players: PlayerSlot[] = match.team1.map((p: any) => ({
  name: p.player.name.split(" ")[0],
  profilePic: p.player.image
    ? p.player.image.startsWith("http")
      ? p.player.image
      : `${baseImgUrl}/${p.player.image}`
    : null,
}));

const team2Players: PlayerSlot[] = match.team2.map((p: any) => ({
  name: p.player.name.split(" ")[0],
  profilePic: p.player.image
    ? p.player.image.startsWith("http")
      ? p.player.image
      : `${baseImgUrl}/${p.player.image}`
    : null,
}));


          const team1Slots = [
            ...team1Players,
            ...Array(2 - team1Players.length).fill(null),
          ];
          const team2Slots = [
            ...team2Players,
            ...Array(2 - team2Players.length).fill(null),
          ];

          const slots = [...team1Slots, ...team2Slots];

          return {
            id: match._id,
            type: match.court.games,
            duration: "60 Mins",
            slots,
            location: `${match.venue.name}, ${match.venue.city}`,
            time: `${match.formattedDate}, ${match.bookingSlots[0]}`,
            matchType: match.askToJoin ? "Open Match" : "Private Match",
            imageUrl: match.venue.image
              ? `${baseImgUrl}/${match.venue.image}`
              : paddleImage,
          };
        });

        setGames(transformedGames);
      }
    } catch (error) {
      console.error("Error fetching matches:", error);
      setError("Failed to fetch matches");
      errorToast("Failed to fetch matches");
    } finally {
      setLoading(false);
    }
  };

  const handleGameSelect = (selectedGame: string) => {
    setGame(selectedGame);
    setIsGameDropdownOpen(false);
    setCurrentPage(1);
  };

  const handleDateSelect = (selectedDate: Date | null) => {
    if (selectedDate) {
      const formattedDate = selectedDate.toISOString().split("T")[0];
      setDate(formattedDate);
      setCurrentPage(1);
    }
    setIsDatePickerOpen(false);
  };

  const handlePageChange = (page: number) => {
    setCurrentPage(page);
  };

const handleSlotClick = (gameId: string, slot: number) => {
  setSelfSlot({ gameId, slot });
  setShowJoinGameModal(true);
};

  const handleJoinClick = (gameId: string) => {
    setSelfSlot({ gameId, slot: -1 }); 
    setShowJoinGameModal(true);
  };

  const handleCloseJoinGameModal = () => {
    if (selfSlot) {
      const gameIndex = games.findIndex((g) => g.id === selfSlot.gameId);
      if (gameIndex !== -1) {
        const newGames = [...games];
        const newSlots = [...newGames[gameIndex].slots];
        newSlots[selfSlot.slot] = null;
        newGames[gameIndex].slots = newSlots;
        setGames(newGames);
      }
      setSelfSlot(null);
    }
    setShowJoinGameModal(false);
  };

  const handleJoinSuccess = () => {
    setSelfSlot(null);
    setShowJoinGameModal(false);
    fetchMatches();
  };

  useEffect(() => {
    fetchMatches();
  }, [date, game, coordinates.lat, coordinates.long, currentPage]);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        gameDropdownRef.current &&
        !gameDropdownRef.current.contains(event.target as Node)
      ) {
        setIsGameDropdownOpen(false);
      }
      if (
        datePickerRef.current &&
        !datePickerRef.current.contains(event.target as Node)
      ) {
        setIsDatePickerOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

useEffect(() => {
  if (showJoinGameModal) {
    document.body.classList.add("body-no-scroll");
  } else {
    document.body.classList.remove("body-no-scroll");
  }
  return () => {
    document.body.classList.remove("body-no-scroll");
  };
}, [showJoinGameModal]);


  return (
    <>
      {loading && <Loader fullScreen />}
      <div className="bg-[#fbfcfd] min-h-screen p-4 sm:p-6 flex flex-col items-center">
        <div className="w-full max-w-6xl">
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="text-center"
          >
            <h1 className="text-2xl sm:text-4xl font-bold mb-2 text-gray-900">
              Join an Open Game
            </h1>
            <p className="text-gray-600 text-sm sm:text-lg mb-6  ">
              Find a game that matches your skill and schedule.
            </p>

           <div className="flex justify-between items-start sm:items-center gap-4 custom-flex-col-below-300 ml-4 mb-2  ">
  <div className="flex flex-col gap-1 ">

  <div style={{ minHeight: 25, minWidth: 100 }}>
  {isDatePickerOpen && date ? (
    <button
      className="bg-[#ed8936] text-white px-3 py-2 rounded-lg hover:bg-[#ed8936] text-sm font-medium font-['Raleway'] w-[100px]"
      onClick={() => {
        setDate("");
        setIsDatePickerOpen(false);
        fetchMatches();
      }}
    >
      Clear Date
    </button>
  ) : (
    <div style={{ height: 25, width: 100 }} />
  )}
</div>

   
  </div>

</div>

          </motion.div>

        <div className="flex justify-between items-start sm:items-center gap-4 mb-6 custom-flex-col-below-300">
<style >{`
  @media (max-width: 300px) {
    .custom-flex-col-below-300 {
      flex-direction: column !important;
    }
  }
`}</style>

 <div className="relative w-full sm:w-40" ref={datePickerRef}>
   
  <div
    className="px-4 sm:px-5 py-2.5 sm:py-3 bg-gray-900 rounded-3xl flex justify-between items-center gap-2 sm:gap-3 cursor-pointer"
    onClick={() => setIsDatePickerOpen(!isDatePickerOpen)}
  >
    <div className="text-white text-xs sm:text-sm font-medium font-['Raleway'] truncate">
      {date || "Select a date"}

    
    </div>
    {isDatePickerOpen ? (
      <ChevronUp className="w-4 h-4 text-white flex-shrink-0" />
    ) : (
      <ChevronDown className="w-4 h-4 text-white flex-shrink-0" />
    )}
  </div>
  <AnimatePresence>
    {isDatePickerOpen && (
      <motion.div
        initial={{ opacity: 0, y: -10 }}
        animate={{ opacity: 1, y: 0 }}
        exit={{ opacity: 0, y: -10 }}
        transition={{ duration: 0.2 }}
            className="absolute z-[9999] "
        style={{
          // right: window.innerWidth > 300 && window.innerWidth < 640 ? '0px' : undefined
          
        }}
      >
        <DatePicker
          selected={date ? new Date(date) : null}
          onChange={handleDateSelect}
          inline
          popperPlacement="bottom-end"
          popperModifiers={[
            {
              name: 'preventOverflow',
              options: {
                boundary: 'viewport',
                padding: 8,
              },
            } as any,
            {
              name: 'flip',
              options: {
                fallbackPlacements: ['bottom-start', 'top-end', 'top-start'],
              },
            } as any,
          ]}
          className="border-none w-full relative z-10"
          calendarClassName="bg-white rounded-lg shadow-lg"
        
        />
      </motion.div>
    )}
  </AnimatePresence>
</div>

            <div className="relative w-full sm:w-36" ref={gameDropdownRef}>
              <div
                className="px-4 sm:px-5 py-2.5 sm:py-3 bg-gray-900 rounded-3xl flex justify-between items-center gap-2 sm:gap-3 cursor-pointer"
                onClick={() => setIsGameDropdownOpen(!isGameDropdownOpen)}
              >
                <div className="text-white text-xs sm:text-sm font-medium font-['Raleway'] capitalize truncate">
                  {game}
                </div>
                {isGameDropdownOpen ? (
                  <ChevronUp className="w-4 h-4 text-white flex-shrink-0" />
                ) : (
                  <ChevronDown className="w-4 h-4 text-white flex-shrink-0" />
                )}
              </div>
              <AnimatePresence>
                {isGameDropdownOpen && (
                  <motion.div
                    initial={{ opacity: 0, y: -10 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -10 }}
                    transition={{ duration: 0.2 }}
                    className="absolute top-12 left-0 w-full sm:w-36 bg-white rounded-lg shadow-lg z-10"
                  >
                    {["all", "Pickleball", "Padel"].map((option) => (
                      <div
                        key={option}
                        className="px-4 py-2 text-gray-900 text-xs sm:text-sm font-medium font-['Raleway'] hover:bg-gray-100 cursor-pointer capitalize"
                        onClick={() => handleGameSelect(option)}
                      >
                        {option}
                      </div>
                    ))}
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
                
       
          </div>

          {error && (
            <div className="text-red-600 text-sm sm:text-base mb-4">
              {error}
            </div>
          )}
          {!loading && !error && games.length === 0 && (
            <div className="text-center text-gray-600 text-sm sm:text-base">
              No matches found.
            </div>
          )}

          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.3, duration: 0.6 }}
            className="h-[600px] overflow-y-auto overflow-x-hidden pr-2"
            style={{
              scrollbarWidth: "none",
              msOverflowStyle: "none",
            }}
          >
            {games.map((game, index) => (
              <GameCard
                key={game.id}
                game={game}
                index={index}
                onSlotClick={(slot) => handleSlotClick(game.id, slot)}
                onJoinClick={() => handleJoinClick(game.id)}
                isSelected={selfSlot?.gameId === game.id || false}
              />
            ))}
          </motion.div>

          {totalItems > 0 && (
            <div className="mt-6 sm:mt-8">
              <Pagination
                currentPage={currentPage}
                totalPages={totalPages}
                totalItems={totalItems}
                itemsPerPage={limit}
                onPageChange={handlePageChange}
              />
            </div>
          )}

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
        className="relative bg-white rounded-2xl w-full max-w-[85vw] sm:max-w-[700px] md:max-w-[700px]"
        initial={{ scale: 0.8, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        exit={{ scale: 0.8, opacity: 0 }}
        transition={{ duration: 0.3 }}
      >
        <button
          className="absolute p-2 top-0 right-0 bg-slate-50/90 border-white rounded-full text-blue-900 hover:text-blue-600 sm:top-0 sm:right-0 mt-[-12px] mr-[-12px]"
          onClick={handleCloseJoinGameModal}
        > 
          <X className="w-6 h-6 sm:w-6 sm:h-6" />
        </button>
        <JoinGame
  bookingId={selfSlot?.gameId || ""}
  requestedPosition={
    selfSlot?.slot !== undefined && selfSlot.slot >= 0
      ? `player${selfSlot.slot + 1}`
      : "" // empty string if no slot chosen
  }
  requestedTeam={
    selfSlot?.slot !== undefined && selfSlot.slot >= 0
      ? selfSlot.slot < 2
        ? "team1"
        : "team2"
      : "" // empty string if no slot chosen
  }
  imageUrl={
    games.find((g) => g.id === selfSlot?.gameId)?.imageUrl || paddleImage
  }
  slots={games.find((g) => g.id === selfSlot?.gameId)?.slots || []}
  onClose={handleCloseJoinGameModal}
  onJoinSuccess={handleJoinSuccess}
/>

      </motion.div>
    </motion.div>
  )}
</AnimatePresence>

<style>{`
  .scrollbar-thin::-webkit-scrollbar {
    width: 6px;
  }
  .scrollbar-thin::-webkit-scrollbar-track {
    background: transparent;
  }
  .scrollbar-thin::-webkit-scrollbar-thumb {
    background-color: #93C5FD;
    border-radius: 3px;
  }
  .scrollbar-thin::-webkit-scrollbar-thumb:hover {
    background-color: #60A5FA;
  }

  .react-datepicker {
    font-family: 'Raleway', sans-serif;
    border: none;
    border-radius: 0.5rem;
    box-shadow: 0 10px 25px rgba(0, 0, 0, 0.15);
    background-color: white;
    width: 100%;
    box-sizing: border-box;
    margin: 0 auto;
  }

  .react-datepicker__header {
    background-color: #1a202c;
    color: white;
    border-top-left-radius: 0.5rem;
    border-top-right-radius: 0.5rem;
    padding: 0.75rem 0.5rem;
    border-bottom: none;
  }

  .react-datepicker__current-month,
  .react-datepicker__day-name {
    color: white;
    font-weight: 500;
    font-size: 0.9rem;
  }

  .react-datepicker__day-names {
    border-bottom: 1px solid #e2e8f0;
    padding-bottom: 0.5rem;
    margin-bottom: 0.25rem;
  }

  .react-datepicker__day {
    color: #1a202c;
    border-radius: 0.375rem;
    margin: 0.125rem;
    padding: 0.5rem;
    font-size: 0.875rem;
    width: 2rem;
    height: 2rem;
    display: inline-flex;
    align-items: center;
    justify-content: center;
    transition: all 0.2s ease;
  }

  .react-datepicker__day:hover {
    background-color: #f6ad55;
    color: white;
    transform: scale(1.05);
  }

  .react-datepicker__day--selected,
  .react-datepicker__day--keyboard-selected {
    background-color: #ed8936;
    color: white;
    font-weight: 600;
  }

  .react-datepicker__day--outside-month {
    color: #a0aec0;
  }

  .react-datepicker__navigation {
    top: 0.75rem;
  }

  .react-datepicker__navigation-icon::before {
    border-color: white;
    border-width: 2px 2px 0 0;
  }

  .react-datepicker__month-container {
    padding: 0.5rem;
  }

  .react-datepicker__week {
    display: flex;
    justify-content: space-between;
  }

  /* Mobile-specific styles */
  @media (max-width: 640px) {
    .react-datepicker {
      font-size: 0.875rem;
      box-shadow: 0 20px 40px rgba(0, 0, 0, 0.2);
          width: 100%;

    }

    .react-datepicker__header {
      padding: 0.5rem;
    }

    .react-datepicker__current-month {
      font-size: 0.85rem;
    }

    .react-datepicker__day {
      font-size: 0.8rem;
      width: 1.75rem;
      height: 1.75rem;
      margin: 0.1rem;
      padding: 0.25rem;
    }

    .react-datepicker__month-container {
      padding: 0.25rem;
    }
  }

  @media (max-width: 480px) {
    .react-datepicker {
      font-size: 0.8rem;
    }

    .react-datepicker__day {
      font-size: 0.75rem;
      width: 1.6rem;
      height: 1.6rem;
    }

    .react-datepicker__current-month {
      font-size: 0.8rem;
    }
  }

  @media (max-width: 320px) {
    .react-datepicker {
   
      font-size: 0.75rem;
    }

    .react-datepicker__day {
      font-size: 0.7rem;
      width: 1.5rem;
      height: 1.5rem;
    }

    .react-datepicker__current-month {
      font-size: 0.75rem;
    }

    .react-datepicker__navigation {
      top: 0.5rem;
    }
  }

  /* Enhanced z-index for mobile */
  .react-datepicker-popper {
    z-index: 9999 !important;
  }

  /* Overlay for mobile to prevent background interaction */
  @media (max-width: 640px) {
    .react-datepicker {
      position: relative;
      z-index: 1000 !important;
    }
  }
//     @media (min-width: 301px) and (max-width: 640px) {
//   .react-datepicker {
    right: 100px;
//   }
// }
`}</style>
        </div>
      </div>
    </>
  );
}

export default Venues2;
