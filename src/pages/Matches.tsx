import React, { useEffect, useRef, useState } from "react";
import DynamicTable from "../components/common/dynamicTable";
import Pagination from "../components/common/Pagination";
import dummyUserImg from "../assets/dashboarduser.png";
import { motion, AnimatePresence } from "framer-motion";
import { ChevronDown, ChevronUp, Eye } from "lucide-react";
import GameDetailsCard from "../components/gameCard/GameDetails";
import { getApi } from "../utils/api";
import { baseImgUrl, URLS } from "../utils/urls";
import { useAuth } from "../utils/AuthContext";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import Loader from "../components/common/Loader";
import ClubInfoModal from "../components/common/ClubInfoModal";
import { useToast } from "../utils/ToastContext";

const headers = [
  "Name of Creator",
  "People Joined",
  "Game",
  "Venue",
  "Date & Time",
  "Action",
];

interface Player {
  id: string;
  name: string;
  image?: string | null;
  type: "user" | "available";
}

const Matches: React.FC = () => {
  const [activeRowId, setActiveRowId] = useState<string | number | undefined>(
    undefined
  );
  const [isGameDropdownOpen, setIsGameDropdownOpen] = useState(false);
  const [isDatePickerOpen, setIsDatePickerOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [rows, setRows] = useState<any[]>([]);
  const [matchDetails, setMatchDetails] = useState<any>(null);
  const gameDropdownRef = useRef<HTMLDivElement>(null);
  const datePickerRef = useRef<HTMLDivElement>(null);
  const tableRef = useRef<HTMLDivElement>(null);
  const cardRef = useRef<HTMLDivElement>(null);
  const [date, setDate] = useState<string>("");
  const [distance, setDistance] = useState("ASC");
  const [game, setGame] = useState("all");
  const [friends, setFriends] = useState<Player[]>([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [totalItems, setTotalItems] = useState(0);
  const [showClubInfoModal, setShowClubInfoModal] = useState(false);

  const limit = 10;

  const { userData, isAuthenticated, logout } = useAuth();
  const { successToast, errorToast } = useToast();
  const coordinates = {
    long: userData?.location.coordinates[0],
    lat: userData?.location.coordinates[1],
  };

  // Function to fetch matches
  const fetchMatches = async () => {
    try {
      setLoading(true);
      const response = await getApi(
        `${URLS.getMatches}?date=${date}&distance=${distance}&game=${game}&lng=${coordinates.long}&lat=${coordinates.lat}&page=${currentPage}&limit=${limit}`
      );

      if (response.status === 200) {
        const matches = response.data.data;
        const total = response.data.total || matches.length;
        setTotalItems(total);
        setTotalPages(Math.ceil(total / limit));

        const transformedRows = matches.map((match: any) => {
          return {
            id: match._id,
            values: [
              <>
                <img
                  src={getPlayerImage(match.team1[0]?.player?.image)}
                  className="w-6 h-6 rounded-full"
                  alt="Creator"
                  onError={() =>
                    console.error(
                      "Image failed to load for match:",
                      match._id
                    )
                  }
                />
                <span className="ml-2">
                  {match.team1[0]?.player.name.split(" ")[0] || "Unknown"}
                </span>
              </>,
              `${match.team1.length + match.team2.length}`,
              match.court.games,
              match.venue.name,
              `${match.formattedDate}, ${match.bookingSlots[0]}`,
            ],
          };
        });
        setRows(transformedRows);
      }
    } catch (error) {
      console.error("Error fetching matches:", error);
      setError("Failed to fetch matches");
      errorToast("Failed to fetch matches");
    } finally {
      setLoading(false);
    }
  };

  const handleRowClick = async (id: string | number) => {
    setActiveRowId(id);
    setLoading(true);
    try {
      const response = await getApi(URLS.getOpenMatchesById(id));
      if (response.status === 200) {
        setMatchDetails(response.data.data);
      }
    } catch (error) {
      console.error("Error fetching match details:", error);
      setError("Failed to fetch match details");
      errorToast("Failed to fetch match details");
    } finally {
      setLoading(false);
    }
  };

  const handleGameSelect = (games: string) => {
    setGame(games);
    setIsGameDropdownOpen(false);
    setCurrentPage(1); // Reset to page 1 on filter change
  };

  const handleDateSelect = (selectedDate: Date | null) => {
    if (selectedDate) {
      const formattedDate = selectedDate.toISOString().split("T")[0];
      setDate(formattedDate);
      setCurrentPage(1); // Reset to page 1 on filter change
    }
    setIsDatePickerOpen(false);
  };

  const handlePlayerSelect = (
    team: "team1" | "team2",
    index: number,
    friend: any
  ) => {
    setMatchDetails((prev: any) => {
      if (!prev) return prev;
      const updatedMatch = { ...prev };
      const targetTeam =
        team === "team1" ? updatedMatch.team1 : updatedMatch.team2;
      if (index < targetTeam.length) {
        targetTeam[index] = { playerData: friend };
      } else {
        targetTeam.push({ playerData: friend });
      }
      return updatedMatch;
    });
  };

  const handlePageChange = (page: number) => {
    setCurrentPage(page);
  };

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
      if (
        tableRef.current &&
        cardRef.current &&
        !tableRef.current.contains(event.target as Node) &&
        !cardRef.current.contains(event.target as Node)
      ) {
        setActiveRowId(undefined);
        setMatchDetails(null);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const getPlayerImage = (image?: string | null) => {
    if (
      !image ||
      image.trim() === "" ||
      image.trim().toLowerCase() === "null"
    ) {
      return dummyUserImg;
    }
    return image.startsWith("https://") ? image : `${baseImgUrl}/${image}`;
  };

  useEffect(() => {
    fetchMatches();
  }, [date, distance, game, coordinates.lat, coordinates.long, currentPage]);

  useEffect(() => {
    const fetchFriends = async () => {
      setLoading(true);
      try {
        const response = await getApi(
          `${URLS.getFriends}?status=friends-requests`
        );
        if (response.status === 200) {
          const fetchedFriends = response.data.data.friends;
          const transformedFriends: Player[] = fetchedFriends.map(
            (friend: any) => ({
              id: friend._id,
              name: friend.fullName || "Unknown",
              image: friend.profilePic || null,
              type: "user",
            })
          );
          setFriends(transformedFriends);
        }
      } catch (error) {
        console.log(error, "error");
        errorToast("Failed to fetch friends");
      } finally {
        setLoading(false);
      }
    };
    fetchFriends();
  }, []);

  const closeClubInfoModal = () => {
    setShowClubInfoModal(false);
  };

  const handleSubmit = (field1: boolean, field2: string) => {
    setShowClubInfoModal(false);
  };

  useEffect(() => {
    if (userData && !userData.clubResponse) {
      setShowClubInfoModal(true);
    }
  }, [userData]);

  return (
    <>
      {loading && <Loader fullScreen />}
      <ClubInfoModal
        isOpen={showClubInfoModal}
        onClose={closeClubInfoModal}
        onSubmit={handleSubmit}
      />
      {userData && userData.clubResponse ? (
        <>
          <div className="flex flex-col md:flex-row gap-4 p-4 sm:p-6 bg-slate-50/60 min-h-screen w-full">
            <style>
              {`
            .react-datepicker {
              font-family: 'Raleway', sans-serif;
              border: none;
              border-radius: 0.5rem;
              box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
              background-color: white;
              width: 100%;
              max-width: 320px;
            }
            .react-datepicker__header {
              background-color: #1a202c;
              color: white;
              border-top-left-radius: 0.5rem;
              border-top-right-radius: 0.5rem;
              padding: 0.5rem;
            }
            .react-datepicker__current-month,
            .react-datepicker__day-name {
              color: white;
              font-weight: 500;
            }
            .react-datepicker__day {
              color: #1a202c;
              border-radius: 0.375rem;
              margin: 0.25rem;
              padding: 0.5rem;
            }
            .react-datepicker__day:hover {
              background-color: #f6ad55;
              color: white;
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
            .react-datepicker__navigation-icon::before {
              border-color: white;
            }
            @media (max-width: 640px) {
              .react-datepicker {
                max-width: 100%;
              }
            }
          `}
            </style>

            {/* Left Section: Header, Table, Pagination */}
            <div
              className={`transition-all duration-300 w-full ${
                activeRowId ? "md:w-[65%]" : "md:w-full"
              }`}
              ref={tableRef}
            >
              {/* Header with Dropdowns */}
              <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-6 w-full gap-4">
                <div className="text-dark-blue text-xl sm:text-2xl font-semibold font-['Raleway']">
                  Open Matches
                </div>
                <div className="flex flex-col sm:flex-row items-start sm:items-center gap-3 sm:gap-4 w-full sm:w-auto">
                  {/* Game Dropdown */}
                  <div
                    className="relative w-full sm:w-36"
                    ref={gameDropdownRef}
                  >
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

                  {/* Date Picker */}
                  <div className="relative w-full sm:w-36" ref={datePickerRef}>
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
                          className="absolute top-12 right-0 sm:right-2 bg-white rounded-lg shadow-lg z-10 w-full sm:w-auto"
                        >
                          <DatePicker
                            selected={date ? new Date(date) : null}
                            onChange={handleDateSelect}
                            inline
                            popperPlacement="bottom-end"
                            className="border-none w-full"
                            calendarClassName="bg-white rounded-lg shadow-lg"
                          />
                        </motion.div>
                      )}
                    </AnimatePresence>
                  </div>
                </div>
              </div>

              {/* Loading and Error States */}
              {loading && (
                <div className="text-center text-gray-600 text-sm sm:text-base">
                  Loading matches...
                </div>
              )}
              {error && (
                <div className="text-red-600 text-sm sm:text-base">{error}</div>
              )}
              {!loading && !error && rows.length === 0 && (
                <div className="text-center text-gray-600 text-sm sm:text-base">
                  No matches found.
                </div>
              )}

              {/* Table */}
              {!loading && rows.length > 0 && (
                <div className="w-full">
                  <DynamicTable
                    headers={headers}
                    rows={rows}
                    actionIcon={
                      <Eye className="w-5 h-5 sm:w-6 sm:h-6 text-orange-600" />
                    }
                    onActionClick={handleRowClick}
                    activeRowId={activeRowId}
                  />
                </div>
              )}

              {/* Pagination */}
              <div className="mt-6 sm:mt-8">
                   {totalItems > 0 && (
                <Pagination
                  currentPage={currentPage}
                  totalPages={totalPages}
                  totalItems={totalItems}
                  itemsPerPage={limit}
                  onPageChange={handlePageChange}
                />
                )}
              </div>
            </div>

            {/* Right Section: Game Details */}
            <div
              className={`transition-all duration-300 w-full ${
                activeRowId ? "block md:w-[35%] md:pl-4" : "hidden"
              }`}
              ref={cardRef}
            >
              <AnimatePresence mode="wait">
                {activeRowId && (
                  <motion.div
                    key="game-details"
                    initial={{ opacity: 0, x: 20 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: 20 }}
                    transition={{ duration: 0.3, ease: "easeInOut" }}
                  >
                    <GameDetailsCard
                      matchData={matchDetails}
                      friends={friends}
                      onPlayerSelect={handlePlayerSelect}
                      onJoinSuccess={fetchMatches} // Pass fetchMatches as callback
                    />
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          </div>
        </>
      ) : null}
    </>
  );
};

export default Matches;