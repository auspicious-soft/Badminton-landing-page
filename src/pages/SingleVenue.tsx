
import React, { useEffect, useState, useRef } from "react";
import {
  Plus,
  Info,
  CloudDrizzle,
  Phone,
  MousePointer2,
  ChevronUp,
  ChevronDown,
  X,
} from "lucide-react";
import { Range } from "react-range";
import SelectFriendModal from "../components/common/FriendsModal";
import { getApi, postApi } from "../utils/api";
import { baseImgUrl, URLS } from "../utils/urls";
import { motion, AnimatePresence } from "framer-motion";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import PaymentCard from "../components/common/PaymentCardModal";
import { useParams, useLocation } from "react-router-dom";
import { useAuth } from "../utils/AuthContext";
import { Player } from "../utils/types";
import userImg from "../assets/dashboarduser.png";
import Loader from "../components/common/Loader";
import { useToast } from "../utils/ToastContext";

interface Court {
  id: string;
  name: string;
  games: string;
  hourlyRate: number;
  availableSlots: {
    time: string;
    price: number;
    isDiscounted: boolean;
    isPremium: boolean;
    isAvailable: boolean;
    isConfirmedBooked: boolean;
    isPastSlot: boolean;
  }[];
}

interface SelectedCourts {
  [key: string]: string | undefined;
}

interface TimeSlot {
  time: string;
  price: string;
  booked: boolean;
}

interface TimeSlotSectionProps {
  title: string;
  times: TimeSlot[];
  selectedTimes: string[];
  handleTimeSelect: (time: string) => void;
}

interface EquipmentCounts {
  racket1: number;
  ball: number;
}

interface VenueData {
  courts: Court[];
  gamesAvailable: string[];
  name: string;
  address: string;
  city: string;
  state: string;
  venueInfo: string;
  contactInfo: string;
  facilities: { name: string; isActive: boolean }[];
  openingHours: { day: string; hours: string[] }[];
  timeslots: string[];
  image: string;
  location:any;
}

// Navigation state interface
interface NavigationState {
  selectedCourtId?: string;
  selectedGame?: string;
  selectedDate?: number;
  preselectedDate?: string;
}

const formatTo12Hour = (time: string) => {
  const [hourStr, minute] = time.split(":");
  let hour = parseInt(hourStr, 10);
  const ampm = hour >= 12 ? "PM" : "AM";
  hour = hour % 12 || 12; // 0 -> 12
  return `${hour}:${minute} ${ampm}`;
};


const TimeSlotSection: React.FC<TimeSlotSectionProps> = ({
  title,
  times,
  selectedTimes,
  handleTimeSelect,
}) => {
  return (
    <div className="flex-1 p-4 bg-Primary-Grey rounded-[10px] inline-flex flex-col justify-start items-start gap-2.5">
      <div className="self-stretch flex flex-col justify-start items-start gap-2.5">
        <div className="self-stretch justify-center text-Primary-Font text-lg font-semibold font-['Raleway'] leading-snug">
          {title}
        </div>
        <div className="self-stretch grid grid-cols-3 gap-1.5">
          {times.map(({ time, price, booked }) => (
            <div
              key={time}
              className={`flex-1 px-4 py-3 rounded-[3px] inline-flex flex-col justify-center items-center ${
                booked
                  ? "bg-gray-400/90 cursor-not-allowed"
                  : selectedTimes.includes(time)
                  ? "bg-green-500 cursor-pointer"
                  : "bg-white cursor-pointer"
              }`}
              onClick={() => !booked && handleTimeSelect(time)}
            >
              <div
                className={`justify-center text-sm font-semibold font-['Raleway'] leading-none mb-2 ${
                  booked || selectedTimes.includes(time)
                    ? "text-slate-100"
                    : "text-Secondary-Font"
                }`}
              >
                {formatTo12Hour(time)} 
              </div>
              <div
                className={`w-12 text-center justify-center text-[10px] font-medium font-['Raleway'] leading-3 ${
                  booked || selectedTimes.includes(time)
                    ? "text-slate-100"
                    : "text-Secondary-Font"
                }`}
              >
                {price}
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};


function useIsSmallScreen() {
  const [isSmall, setIsSmall] = useState(false);

  useEffect(() => {
    const checkSize = () => setIsSmall(window.innerWidth < 1024);
    checkSize();
    window.addEventListener("resize", checkSize);
    return () => window.removeEventListener("resize", checkSize);
  }, []);

  return isSmall;
}

function SingleVenue() {
  const [venueData, setVenueData] = useState<VenueData | null>(null);
  const [selectedGame, setSelectedGame] = useState<string>("Padel");
  const [loading, setLoading] = useState(false);
  const [selectedDate, setSelectedDate] = useState<number | null>(null);
  const [selectedDateForBooking, setSelectedDateForBooking] = useState<Date>(
    new Date()
  );
  const [showPaymentModal, setShowPaymentModal] = useState(false);
  const [selectedCourts, setSelectedCourts] = useState<SelectedCourts>({});
  const [selectedCourtId, setSelectedCourtId] = useState<string | null>(null);
  const [selectedTimes, setSelectedTimes] = useState<string[]>([]);
  const [selectedGameType, setSelectedGameType] = useState<string>("Public");
  const [showFriendModal, setShowFriendModal] = useState(false);
  const [selectedSlotIndex, setSelectedSlotIndex] = useState<number | null>(
    null
  );
  const [players, setPlayers] = useState<Player[]>([
    { id: 0, name: "You", image: null, type: "user" },
    { id: 1, name: "Available", type: "available" },
    { id: 2, name: "Available", type: "available" },
    { id: 3, name: "Available", type: "available" },
  ]);
  const [selectedMatchType, setSelectedMatchType] =
    useState<string>("Friendly");
  const [skillLevel, setSkillLevel] = useState<number>(46);
  const [isDatePickerOpen, setIsDatePickerOpen] = useState(false);
  const [friends, setFriends] = useState<Player[]>([]);
  const [dynamicPricing, setDynamicPricing] = useState<
    { slot: string; price: number }[]
  >([]);
  const [totalPrice, setTotalPrice] = useState<number>(0);
  const [equipmentCounts, setEquipmentCounts] = useState<EquipmentCounts>({
    racket1: 0,
    ball: 0,
  });
  const [showAccordian, setShowAccordian] = useState(false);
    const isSmallScreen = useIsSmallScreen();
  const datePickerRef = useRef<HTMLDivElement>(null);
  const { VenueId } = useParams<{ VenueId: string }>();
  const location = useLocation();
  const { userData } = useAuth();
  const { successToast, errorToast } = useToast();
  
  const selectedFriendIds = players
  .filter((p) => (p.type === "user" || p.type === "guest") && p.id !== null)
    .map((p) => p.id);

  
  // Handle navigation state for pre-selected court and game
  useEffect(() => {
    if (location.state) {
      const navigationState = location.state as NavigationState;
      const { 
        selectedCourtId: preselectedCourtId, 
        selectedGame: preselectedGame, 
        selectedDate: preselectedDate,
        preselectedDate: preselectedDateString
      } = navigationState;
      
      
    if (preselectedGame) {
  handleGameSelect(preselectedGame, true); // mark as from navigation
}
      
      if (preselectedDate) {
        setSelectedDate(preselectedDate);
      }
      
      if (preselectedDateString) {
        const date = new Date(preselectedDateString);
        setSelectedDateForBooking(date);
        setSelectedDate(date.getDate());
      }
      
      // Set court selection after venue data is loaded
      if (preselectedCourtId) {
        setSelectedCourtId(preselectedCourtId);
        setSelectedCourts(prev => ({
          ...prev,
          [preselectedCourtId]: "0"
        }));
      }
    } else {
      // Set default date to today if no navigation state
      const today = new Date();
      setSelectedDate(today.getDate());
      setSelectedDateForBooking(today);
    }
  }, [location.state]);

// In handleGameSelect, remove resetting when game comes from location.state
const handleGameSelect = (game: string, fromNavigation = false) => {
  setLoading(true);
  try {
    setSelectedGame(game);
    if (!fromNavigation) { // only reset if not from initial navigation
      setSelectedCourtId(null);
      setSelectedTimes([]);
      setSelectedCourts({});
    }
  } catch (error) {
    setLoading(false);
  } finally {
    setLoading(false);
  }
};


  const handleDateSelect = (
    date: Date | null,
    event?: React.MouseEvent<HTMLElement> | React.KeyboardEvent<HTMLElement>
  ) => {
    setLoading(false);

    try {
      if (date) {
        setSelectedDate(date.getDate());
        setSelectedDateForBooking(date);
        setIsDatePickerOpen(false);
        // Reset court and time selection when date changes
        setSelectedTimes([]);
        setTotalPrice(0);
      } else {
        setSelectedDate(null);
      }
    } catch (error) {
      setLoading(false);
    } finally {
      setLoading(false);
    }
  };

const handleTimeSelect = (time: string) => {
  setSelectedTimes((prev) => {
    let newTimes: string[] = [...prev];

    // Deselect if already selected
    if (newTimes.includes(time)) {
      newTimes = newTimes.filter((t) => t !== time);
    } else {
      if (newTimes.length === 0) {
        // First slot selection
        newTimes = [time];
      } else if (newTimes.length === 1) {
        // Check consecutive
        const firstSlot = newTimes[0];

        const getHour = (t: string) => parseInt(t.split(":")[0]);
        const firstHour = getHour(firstSlot);
        const newHour = getHour(time);

        if (newHour === firstHour + 1 || newHour === firstHour - 1) {
          newTimes = [...newTimes, time].sort();
        } else {
          errorToast("Only consecutive slots can be booked");
          return prev; // 🚨 don't update
        }
      } else {
        // If already 2 slots selected, reset with the new one
        newTimes = [time];
      }
    }

    // Update court booking duration
    if (selectedCourtId) {
      setSelectedCourts((prevCourts) => ({
        ...prevCourts,
        [selectedCourtId]:
          newTimes.length === 0
            ? undefined
            : newTimes.length === 1
            ? "60"
            : "120",
      }));
    }

    // Calculate total price
    const selectedCourt = venueData?.courts.find(
      (court) => court.id === selectedCourtId
    );
    const total = newTimes.reduce((acc, t) => {
      const slot = selectedCourt?.availableSlots.find((slot) => slot.time === t);
      return acc + (slot?.price || 0);
    }, 0);
    setTotalPrice(total);

    return newTimes;
  });
};


  const handleGameTypeSelect = (type: string) => {
    setSelectedGameType(type);
  };

  const handleMatchTypeSelect = (type: string) => {
    setSelectedMatchType(type);
  };

  const removePlayer = (index: number) => {
    if (index === 0) return;
    setPlayers((prev) => {
      const newPlayers = [...prev];
      newPlayers[index] = { id: index, name: "Available", type: "available" };
      return newPlayers;
    });
  };

  const handleCourtSelect = (courtId: string) => {
    setSelectedCourtId(courtId);
    setSelectedTimes([]);
    setTotalPrice(0);
    setSelectedCourts((prev) => {
      const newCourts = { ...prev };
      Object.keys(newCourts).forEach((key) => {
        newCourts[key] = undefined;
      });
      newCourts[courtId] = "0";
      return newCourts;
    });
  };

  // Generate time slots from venueData.timeslots and availableSlots
  const generateTimeSlots = (times: string[]): TimeSlot[] => {
    if (!selectedCourtId || !venueData) return [];

    const selectedCourt = venueData.courts.find(
      (court) => court.id === selectedCourtId
    );

    return times.map((time) => {
      const slot = selectedCourt?.availableSlots.find(
        (slot) => slot.time === time
      );
      const matchedPrice = slot?.price || 400; // Fallback price
      return {
        time,
        price: `₹ ${matchedPrice}`,
        booked: slot ? !slot.isAvailable : false,
      };
    });
  };

  const morningTimes = venueData?.timeslots
    ? generateTimeSlots(
        venueData.timeslots.filter((time) => parseInt(time.split(":")[0]) < 12)
      )
    : [];

  const eveningTimes = venueData?.timeslots
    ? generateTimeSlots(
        venueData.timeslots.filter((time) => parseInt(time.split(":")[0]) >= 12)
      )
    : [];

  const teamA = players.slice(0, 2);
  const teamB = players.slice(2, 4);

  const today = new Date();
  const dates = Array.from({ length: 14 }, (_, i) => {
    const date = new Date(today);
    date.setDate(today.getDate() + i);
    return {
      day: date.toLocaleString("en-US", { weekday: "short" }),
      date: date.getDate(),
      fullDate: date,
    };
  });

useEffect(() => {
  const fetchVenueData = async () => {
    if (!selectedDateForBooking) return;

    // 🚨 Skip fetching until game is set from navigation
    if (location.state?.selectedGame && selectedGame !== location.state.selectedGame) {
      return;
    }

    setLoading(true);
    const year = selectedDateForBooking.getFullYear();
    const month = String(selectedDateForBooking.getMonth() + 1).padStart(2, "0");
    const day = String(selectedDateForBooking.getDate()).padStart(2, "0");
    const localDate = `${year}-${month}-${day}`;

    try {
      const response = await getApi(
        `${URLS.getCourts}?venueId=${VenueId}&date=${localDate}&game=${selectedGame}`
      );
      if (response?.status === 200 && response?.data?.success) {
        const data = response.data.data;
        setVenueData({
          ...data,
          courts: data.courts.map((court: any) => ({
            id: court._id,
            name: court.name,
            games: court.games,
            hourlyRate: court.hourlyRate,
            availableSlots: court.availableSlots,
          })),
        });

        const initialCourts: SelectedCourts = {};
        data.courts.forEach((court: any) => {
          initialCourts[court._id] = undefined;
        });
        setSelectedCourts(initialCourts);

        if (location.state?.selectedCourtId) {
          const exists = data.courts.some(
            (court: any) => court._id === location.state.selectedCourtId
          );
          if (exists) {
            setSelectedCourtId(location.state.selectedCourtId);
            setSelectedCourts(prev => ({
              ...prev,
              [location.state.selectedCourtId]: "0"
            }));
          }
        }
      }
    } catch (error) {
      console.error("Error fetching venue data:", error);
    } finally {
      setLoading(false);
    }
  };

  fetchVenueData();
}, [VenueId, selectedDateForBooking, selectedGame, location.state?.selectedCourtId]);

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
          setPlayers((prev) => [
            {
              id: 0,
              name: userData?.fullName || "You",
              image: userData?.profilePic,
              type: "user",
            },
            ...prev.slice(1),
          ]);
        }
      } catch (error) {
        console.error("Error fetching friends:", error);
      }
    };
    fetchFriends();
  }, [userData]);

  useEffect(() => {
    const getDynamicPricing = async () => {
      if (!selectedDateForBooking) return;

      const year = selectedDateForBooking.getFullYear();
      const month = String(selectedDateForBooking.getMonth() + 1).padStart(
        2,
        "0"
      );
      const day = String(selectedDateForBooking.getDate()).padStart(2, "0");
      const localDate = `${year}-${month}-${day}`;
      setLoading(true);
      try {
        const response = await getApi(
          `${URLS.getDynamicPricing}?Date=${localDate}`
        );
        if (response.status === 200 && response.data.success) {
          const pricingData = response.data.data.slotPricing;
          setDynamicPricing(pricingData);
        }
      } catch (error) {
        setLoading(false);
      } finally {
        setLoading(false);
      }
    };
    getDynamicPricing();
  }, [selectedDateForBooking]);

  const handleBookAndPay = async () => {

     const actualPlayersCount = players.filter(p => p.type !== "available").length;

  if (actualPlayersCount < 2) {
    errorToast("At least 2 players are required to book a match");
    return;
  }


    if (!selectedDateForBooking || !selectedCourtId || !selectedTimes || selectedTimes.length === 0) {
      errorToast("Select Date, Court and available Time slots to Book a match");
      return;
    }
    setShowPaymentModal(true);
  };

    useEffect(() => {
      // Check if any modal is open
      const anyModalOpen =
        showFriendModal ||
        showPaymentModal;
    
      if (anyModalOpen) {
        document.body.classList.add("body-no-scroll");
      } else {
        document.body.classList.remove("body-no-scroll");
      }
    
      // Cleanup on unmount
      return () => {
        document.body.classList.remove("body-no-scroll");
      };
    }, [showFriendModal, showPaymentModal]);
    

    useEffect(() => {
    // On large screens, always show details
    if (!isSmallScreen) {
      setShowAccordian(true);
    } else {
      setShowAccordian(false);
    }
  }, [isSmallScreen]);

  return (
    <>
      {loading && <Loader fullScreen />}

      <div className="flex flex-col-reverse lg:flex-row gap-4 pb-12 max-w-full mx-auto px-4 sm:px-6 lg:px-8 bg-slate-50/60 pt-4">
        <div className="firstSection w-full lg:w-[70%] p-4 sm:p-6 bg-white rounded-[20px] shadow-[0px_4px_20px_rgba(92,138,255,0.10)] flex flex-col gap-2">
          <h2 className="text-neutral-800 text-sm sm:text-base font-semibold font-['Raleway'] leading-tight">
            Select Game
          </h2>
          <div className="w-full p-1 rounded-[10px] flex flex-wrap justify-start items-start gap-1.5">
            {venueData &&
              venueData?.gamesAvailable.map((game) => (
                <div
                  key={game}
                  className={`flex-1 min-w-[100px] px-4 sm:px-9 py-2.5 rounded-[10px] flex justify-center items-center gap-2.5 cursor-pointer ${
                    selectedGame === game ? "bg-dark-blue" : "bg-Primary-Grey"
                  }`}
                  onClick={() => handleGameSelect(game)}
                >
                  <div
                    className={`text-center text-sm sm:text-base font-medium font-['Raleway'] leading-normal ${
                      selectedGame === game ? "text-white" : "text-gray-500"
                    }`}
                  >
                    {game}
                  </div>
                </div>
              ))}
          </div>
          
          <div className="w-full p-4 bg-Primary-Grey rounded-[10px] flex flex-col justify-start items-start gap-5">
            <div className="w-full flex justify-between items-center">
              <div className="text-Primary-Font text-base sm:text-lg font-semibold font-['Raleway'] leading-snug">
                Date
              </div>
            </div>
            <div className="w-full overflow-x-auto flex justify-between items-center gap-3">
              {dates.slice(0, 23).map(({ day, date }, index) => (
                <div
                  key={index}
                  className="flex flex-col items-center gap-2 flex-shrink-0"
                >
                  <div className="text-Secondary-Font text-xs font-medium font-['Raleway'] leading-none">
                    {day}
                  </div>
                  <div
                    className={`w-8 h-8 rounded-[3px] shadow-[0px_1px_5px_0px_rgba(228,229,231,0.24)] flex items-center justify-center cursor-pointer ${
                      selectedDate === date ? "bg-dark-blue" : "bg-white"
                    }`}
                    onClick={() =>
                      handleDateSelect(
                        new Date(today.getFullYear(), today.getMonth(), date)
                      )
                    }
                  >
                    <div
                      className={`text-sm font-medium font-['Raleway'] leading-none ${
                        selectedDate === date
                          ? "text-slate-200"
                          : "text-Secondary-Font"
                      }`}
                    >
                      {date}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
          
          {selectedDate && venueData?.courts && (
            <div className="w-full p-4 bg-Primary-Grey rounded-[10px] flex flex-col justify-start items-start gap-2.5 overflow-hidden">

              { venueData.courts.length > 0 ? <>
              <div className="text-Primary-Font text-base sm:text-lg font-semibold font-['Raleway'] leading-snug">
                Select a court
              </div>
              <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4 w-full">
                { venueData.courts 
                  .filter((court) => court.games === selectedGame)
                  .map((court) => (
                    <div
                      key={court.id}
                      className={`p-4 rounded-[10px] flex flex-col justify-start items-start gap-2.5 cursor-pointer ${
                        selectedCourtId === court.id
                          ? "bg-dark-blue"
                          : "bg-white"
                      }`}
                      onClick={() => handleCourtSelect(court.id)}
                    >
                      <div className="w-full flex flex-col justify-start items-start gap-2.5">
                        <div
                          className={`text-sm font-semibold font-['Raleway'] leading-none [text-shadow:_0px_1px_5px_rgb(228_229_231_/_0.24)] ${
                            selectedCourtId === court.id
                              ? "text-slate-100"
                              : "text-Primary-Font"
                          }`}
                        >
                          {court.name}
                        </div>
                        {selectedCourtId === court.id && (
                          <div className="rounded-[5px] flex justify-center items-center gap-2.5 w-full">
                            <div className="text-center text-xs font-medium font-['Raleway'] leading-none text-slate-100">
                              {selectedCourts[court.id] || "0"} Mins
                            </div>
                          </div>
                        )}
                      </div>
                    </div>
                  ))
              
                }
              </div>
              </>
              : 
              <>
               <div className="text-Primary-Font text-base sm:text-lg font-semibold font-['Raleway'] leading-snug">
             No Courts Available.
              </div>
              </>
}

            </div>
          )}
          
          {selectedCourtId && selectedDate && (
            <div className="w-full flex flex-col sm:flex-row gap-2.5 overflow-hidden">
              <TimeSlotSection
                title="Morning"
                times={morningTimes}
                selectedTimes={selectedTimes}
                handleTimeSelect={handleTimeSelect}
              />
              <TimeSlotSection
                title="Evening"
                times={eveningTimes}
                selectedTimes={selectedTimes}
                handleTimeSelect={handleTimeSelect}
              />
            </div>
          )}
          
          <div className="w-full p-4 bg-Primary-Grey rounded-[10px] flex flex-col justify-start items-start gap-2.5">
            <div className="text-Primary-Font text-base sm:text-lg font-semibold font-['Raleway'] leading-tight">
              Game Type
            </div>
            <div className="w-full p-1 bg-slate-50 rounded-[10px] flex flex-wrap justify-start items-start gap-1.5">
              <div
                className={`flex-1 min-w-[100px] px-4 sm:px-9 py-2.5 rounded-[10px] flex justify-center items-center gap-2.5 cursor-pointer ${
                  selectedGameType === "Public" ? "bg-dark-blue" : "bg-white"
                }`}
                onClick={() => handleGameTypeSelect("Public")}
              >
                <div
                  className={`text-center text-sm sm:text-base font-medium font-['Raleway'] leading-normal ${
                    selectedGameType === "Public"
                      ? "text-white"
                      : "text-gray-500"
                  }`}
                >
                  Public
                </div>
              </div>
              <div
                className={`flex-1 min-w-[100px] px-4 sm:px-14 py-2.5 rounded-[10px] flex justify-center items-center gap-2.5 cursor-pointer ${
                  selectedGameType === "Private" ? "bg-dark-blue" : "bg-white"
                }`}
                onClick={() => handleGameTypeSelect("Private")}
              >
                <div
                  className={`text-center text-sm sm:text-base font-medium font-['Raleway'] leading-normal ${
                    selectedGameType === "Private"
                      ? "text-white"
                      : "text-gray-500"
                  }`}
                >
                  Private
                </div>
              </div>
            </div>
            
            <div className="w-full flex flex-col sm:flex-row justify-start items-center gap-4 sm:gap-6">
              <div className="flex-1 flex justify-around items-center gap-4">
                {teamA.map((player, index) => {
                  const actualIndex = index;
                  return (
                    <div
                      key={index}
                      className="flex flex-col items-center gap-2 relative"
                    >
                      {player.type === "available" ? (
                        <>
                          <div
                            className="w-12 h-12 sm:w-14 sm:h-14 relative cursor-pointer"
                            onClick={() => {
                              setSelectedSlotIndex(actualIndex);
                              setShowFriendModal(true);
                            }}
                          >
                            <div className="w-full h-full absolute bg-zinc-100 rounded-full" />
                            <Plus className="w-4 h-4 absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 text-Primary-Font" />
                          </div>
                          <div className="text-center text-Primary-Font text-xs font-medium font-['Raleway']">
                            {player.name}
                          </div>
                        </>
                      ) : (
                        <>
                          <div className="relative">
                            <img
                              src={
                                player.image?.startsWith(
                                  "https://lh3.googleusercontent.com/"
                                )
                                  ? player.image
                                  : `${baseImgUrl}/${player.image}`
                              }
                              alt={player.name}
                              className="w-12 h-12 sm:w-14 sm:h-14 rounded-full"
                            />
                            {actualIndex !== 0 && (
                              <button
                                className="absolute top-0 right-0 w-5 h-5 bg-red-500 rounded-full flex items-center justify-center"
                                onClick={() => removePlayer(actualIndex)}
                              >
                                <X className="w-3 h-3 text-white" />
                              </button>
                            )}
                          </div>
                          <div className="text-center text-Primary-Font text-xs font-medium font-['Raleway']">
                            {player.name}
                          </div>
                        </>
                      )}
                    </div>
                  );
                })}
              </div>
              <div className="text-center text-Primary-Font text-xs font-medium font-['Raleway']">
                VS
              </div>
              <div className="flex-1 flex justify-around items-center gap-4">
                {teamB.map((player, index) => {
                  const actualIndex = index + 2;
                  return (
                    <div
                      key={index}
                      className="flex flex-col items-center gap-2 relative"
                    >
                      {player.type === "available" ? (
                        <>
                          <div
                            className="w-12 h-12 sm:w-14 sm:h-14 relative cursor-pointer"
                            onClick={() => {
                              setSelectedSlotIndex(actualIndex);
                              setShowFriendModal(true);
                            }}
                          >
                            <div className="w-full h-full absolute bg-zinc-100 rounded-full" />
                            <Plus className="w-4 h-4 absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 text-Primary-Font" />
                          </div>
                          <div className="text-center text-Primary-Font text-xs font-medium font-['Raleway']">
                            {player.name}
                          </div>
                        </>
                      ) : (
                        <>
                          <div className="relative">
                            <img
                              src={
                                player.image?.startsWith(
                                  "https://lh3.googleusercontent.com/"
                                )
                                  ? player.image
                                  : `${baseImgUrl}/${player.image}`
                              }
                              alt={player.name}
                              className="w-12 h-12 sm:w-14 sm:h-14 rounded-full"
                            />
                            <button
                              className="absolute top-0 right-0 w-5 h-5 bg-red-500 rounded-full flex items-center justify-center"
                              onClick={() => removePlayer(actualIndex)}
                            >
                              <X className="w-3 h-3 text-white" />
                            </button>
                          </div>
                          <div className="text-center text-Primary-Font text-xs font-medium font-['Raleway']">
                            {player.name}
                          </div>
                        </>
                      )}
                    </div>
                  );
                })}
              </div>
            </div>
          </div>
          <div className="w-full p-4 bg-Primary-Grey rounded-[10px] flex flex-col justify-start items-start gap-2.5">
            <div className="text-neutral-800 text-sm sm:text-base font-semibold font-['Raleway'] leading-tight">
              Match Type
            </div>
            <div className="w-full p-1 bg-slate-50 rounded-[10px] flex flex-wrap justify-start items-start gap-1.5">
              <div
                className={`flex-1 min-w-[100px] px-4 sm:px-9 py-2.5 rounded-[10px] flex justify-center items-center gap-2.5 cursor-pointer ${
                  selectedMatchType === "Friendly" ? "bg-dark-blue" : "bg-white"
                }`}
                onClick={() => handleMatchTypeSelect("Friendly")}
              >
                <div
                  className={`text-center text-sm sm:text-base font-medium font-['Raleway'] leading-normal ${
                    selectedMatchType === "Friendly"
                      ? "text-white"
                      : "text-gray-500"
                  }`}
                >
                  Friendly
                </div>
              </div>
              <div
                className={`flex-1 min-w-[100px] px-4 sm:px-14 py-2.5 rounded-[10px] flex justify-center items-center gap-2.5 cursor-pointer ${
                  selectedMatchType === "Competitive"
                    ? "bg-dark-blue"
                    : "bg-white"
                }`}
                onClick={() => handleMatchTypeSelect("Competitive")}
              >
                <div
                  className={`text-center text-sm sm:text-base font-medium font-['Raleway'] leading-normal ${
                    selectedMatchType === "Competitive"
                      ? "text-white"
                      : "text-gray-500"
                  }`}
                >
                  Competitive
                </div>
              </div>
            </div>
          </div>
          <div 
          className="w-full h-12 sm:h-14 px-6 sm:px-28 py-4 sm:py-5 bg-dark-blue rounded-[5px] flex justify-center items-center gap-2.5 cursor-pointer"
            onClick={handleBookAndPay}
            >
            <button
              className="text-white text-sm sm:text-base font-semibold font-['Raleway'] leading-tight"
            
            >
              Continue
            </button>
          </div>
        </div>
    <div className="SecondSection w-full lg:w-[30%]">
  <div className="relative w-full max-w-full">
    <div className="p-4 bg-white rounded-[20px] shadow-[0px_4px_20px_0px_rgba(92,138,255,0.10)] flex flex-col justify-start items-center gap-5 w-full">
      
      {/* Court Name & Address */}
      <div className="w-full">
        <div className="flex flex-col gap-3">
          <div className="text-Primary-Font text-xl sm:text-2xl font-semibold font-['Raleway'] leading-7">
            {venueData?.name || "Name of the court"}
          </div>
          <div className="text-Primary-Font text-xs sm:text-sm font-medium font-['Raleway'] leading-none">
            {venueData &&
              `${venueData.address}, ${venueData.city}, ${venueData.state} `}
          </div>
        </div>
      </div>

      {/* Accordion Toggle Button */}
     {isSmallScreen && (
            <button
              onClick={() => setShowAccordian((prev) => !prev)}
              className="w-full flex justify-between items-center text-sm font-semibold text-blue-700 hover:underline"
            >
              {showAccordian ? "Hide Details" : "Show Details"}
              <motion.span
                animate={{ rotate: showAccordian ? 180 : 0 }}
                transition={{ duration: 0.3 }}
              >
                ▼
              </motion.span>
            </button>
          )}

      {/* Accordion Content with Animation */}
      <AnimatePresence>
        {showAccordian && (
          <motion.div
            className="w-full flex flex-col gap-5"
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            exit={{ opacity: 0, height: 0 }}
            transition={{ duration: 0.4, ease: "easeInOut" }}
          >
            {/* Court Information */}
            <div className="w-full flex flex-col gap-1">
              <div className="text-neutral-800 text-sm sm:text-base font-semibold font-['Raleway']">
                Court Information
              </div>
              <div className="text-Grey text-xs sm:text-sm font-medium font-['Raleway']">
                {venueData?.venueInfo ||
                  "Consequuntur magni dolores eos qui ratione voluptatem sequi nesciunt."}
              </div>
            </div>

            {/* Opening Hours */}
            <div className="w-full flex flex-col gap-[5px]">
              <div className="text-neutral-800 text-sm sm:text-base font-semibold font-['Raleway']">
                Opening Hours
              </div>
              <div className="flex flex-col gap-px">
                {venueData?.openingHours.map((hour) => (
                  <div key={hour.day} className="w-full flex justify-between">
                    <div className="text-Grey text-xs sm:text-sm font-medium font-['Raleway']">
                      {hour.day}
                    </div>
                    <div className="text-Grey text-xs sm:text-sm font-medium font-['Raleway']">
                      {hour.hours.join(" - ")}
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Facilities */}
            <div className="w-full flex flex-col gap-[5px]">
              <div className="text-neutral-800 text-sm sm:text-base font-semibold font-['Raleway']">
                Facilities
              </div>
              <div className="flex flex-wrap gap-2.5">
                {venueData?.facilities
                  .filter((facility) => facility.isActive)
                  .map((facility) => (
                    <div
                      key={facility.name}
                      className="px-3 sm:px-4 py-1.5 bg-zinc-100 rounded-[39px] flex items-center gap-2.5"
                    >
                      <CloudDrizzle className="w-4 h-4 text-Secondary-Font" />
                      <div className="text-Secondary-Font text-xs font-medium font-['Raleway']">
                        {facility.name}
                      </div>
                    </div>
                  ))}
              </div>
            </div>

            {/* Action Buttons */}
            <div className="flex flex-col sm:flex-row justify-start items-center gap-3.5 w-full">
             <button
  className="w-full sm:w-40 h-12 p-1.5 bg-Primary-Grey rounded-[10px] flex items-center gap-3"
  onClick={() =>
    window.open(
      `https://www.google.com/maps?q=${venueData?.location.coordinates[1]},${venueData?.location.coordinates[0]}`,
      "_blank",
      "noopener,noreferrer"
    )
  }
>
  <div className="w-9 h-9 p-2.5 bg-blue-950 rounded-[5px] flex items-center justify-center">
    <MousePointer2
      className="w-4 h-4 text-white rotate-90"
      strokeWidth={1.5}
    />
  </div>
  <span className="text-Secondary-Font text-xs sm:text-sm font-medium font-['Raleway']">
    Directions
  </span>
</button>


              <button
                onClick={() => {
                  if (venueData?.contactInfo) {
                    navigator.clipboard.writeText(venueData.contactInfo);
                    successToast("Number copied to clipboard!");
                  }
                }}
                className="w-full sm:w-40 h-12 p-1.5 bg-Primary-Grey rounded-[10px] flex items-center gap-3"
              >
                <div className="w-9 h-9 p-2.5 bg-blue-950 rounded-[5px] flex items-center justify-center">
                  <Phone className="w-4 h-4 text-white" />
                </div>
                <div className="text-Secondary-Font text-xs sm:text-sm font-medium font-['Raleway']">
                  Call Now
                </div>
              </button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  </div>
</div>
        <SelectFriendModal
          isOpen={showFriendModal}
          onClose={() => setShowFriendModal(false)}
          friends={friends}
          selectedFriendIds={selectedFriendIds}
          onSelect={(friend: any) => {
            if (selectedSlotIndex !== null) {
              const updatedPlayers = [...players];
              updatedPlayers[selectedSlotIndex] = {
                id: friend.id,
                name: friend.name,
                image: friend.image,
                type: friend.type,
              };
              setPlayers(updatedPlayers);
              setShowFriendModal(false);
            }
          }}
          onFriendsUpdate={setFriends}
        />
        <AnimatePresence>
          {showPaymentModal && (
            <motion.div
              className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50 overflow-y-auto hide-scrollbar"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.3 }}
            >
              <motion.div
                className="relative bg-transparent hide-scrollbar w-full max-w-2xl sm:max-w-4xl"
                initial={{ scale: 0.8, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                exit={{ scale: 0.8, opacity: 0 }}
                transition={{ duration: 0.3 }}
              >
                <PaymentCard
                  bookingAmount={totalPrice}
                  imageUrl={
                    venueData?.image
                      ? `${baseImgUrl}/${venueData.image}`
                      : undefined
                  }
                  gameType={selectedGame}
                  address={
                    venueData?.address
                      ? `${venueData.address}, ${venueData.city}, ${venueData.state}`
                      : ""
                  }
                  equipmentCounts={equipmentCounts}
                  setEquipmentCounts={setEquipmentCounts}
                  players={players}
                  userData={userData}
                  selectedDateForBooking={selectedDateForBooking}
                  selectedCourtId={selectedCourtId}
                  selectedTimes={selectedTimes}
                  selectedGameType={selectedGameType}
                  selectedMatchType={selectedMatchType}
                  skillLevel={skillLevel}
                  onClose={() => {
                    setShowPaymentModal(false);
                    setEquipmentCounts({ racket1: 0, ball: 0 });
                  }}
                  VenueId={VenueId}
                />
              </motion.div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </>
  );
}

export default SingleVenue;
