import React, { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import MyBookings from "../components/myBookings/MyBookings";
import Venues from "../components/venues/Venues";
import { Search, ChevronDown } from "lucide-react";
import { getApi } from "../utils/api";
import { baseImgUrl, URLS } from "../utils/urls";
import { useAuth } from "../utils/AuthContext";
import { useNavigate } from "react-router-dom";
import Pagination from "../components/common/Pagination";
import InfiniteScrollPagination from "../components/common/ScrollPagination";
import Loader from "../components/common/Loader";

// Define interfaces for type safety
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
  score: object;
  // winner:string;
  bookingdate:string;
}

interface BookingGroup {
  date: string;
  time: string;
  bookings: Booking[];
}

interface Venue {
  name: string;
  location: string;
  imageUrl: string;
  _id: string;
}

interface ApiVenue {
  _id: string;
  name: string;
  address: string;
  city: string;
  state: string;
  image: string;
  gamesAvailable: string[];
  weather: {
    status: string;
    icon: string;
    temperature: number;
    lastUpdated: string;
  };
  distance: number;
  location: {
    type: string;
    coordinates: [number, number];
  };
  date: string;
  formattedDate: string;
  courts: {
    _id: string;
    name: string;
    venueId: string;
    games: string;
    hourlyRate: number;
    image: string;
    availableSlots: string[];
  }[];
  hasFilteredCourts: boolean;
}

interface ApiPlayer {
  playerId: string;
  playerType: string;
  playerPayment: number;
  paymentStatus: string;
  transactionId: string;
  paidBy: string;
  rackets: number;
  balls: number;
  _id: string;
  playerData: {
    _id: string;
    fullName: string;
    profilePic: string | null;
  };
}

interface ApiBooking {
  _id: string;
  userId: string;
  gameType: string;
  askToJoin: boolean;
  isCompetitive: boolean;
  skillRequired: number;
  team1: ApiPlayer[];
  team2: ApiPlayer[];
  venueId: {
    _id: string;
    name: string;
    address: string;
    city: string;
    state: string;
  };
  courtId: {
    _id: string;
    games: string;
  };
  bookingType: string;
  bookingAmount: number;
  bookingPaymentStatus: boolean;
  bookingDate: string;
  bookingSlots: string;
  expectedPayment: number;
  cancellationReason: string | null;
  isMaintenance: boolean;
  maintenanceReason: string | null;
  createdAt: string;
  updatedAt: string;
  score: object;
  status: string;
}

// MainVenueComp Component
const MainVenueComp: React.FC = () => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [venuesData, setVenuesData] = useState<Venue[]>([]);
  const [bookingGroups, setBookingGroups] = useState<BookingGroup[]>([]);
  const [selectedFilter, setSelectedFilter] = useState<
    "all" | "upcoming" | "previous"
  >("all");
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const [venuesCurrentPage, setVenuesCurrentPage] = useState(1);
  const [venuesTotalPages, setVenuesTotalPages] = useState(1);
  const [venuesTotalItems, setVenuesTotalItems] = useState(0);
  const [bookingsCurrentPage, setBookingsCurrentPage] = useState(1);
  const [bookingsTotalPages, setBookingsTotalPages] = useState(1);
  const [bookingsTotalItems, setBookingsTotalItems] = useState(0);
  const limit = 10;
  const { userData } = useAuth();
  const navigate = useNavigate();
  const coordinates = {
    long: userData?.location.coordinates[0],
    lat: userData?.location.coordinates[1],
  };

  const today = new Date();
  const formattedDate = today.toISOString().split("T")[0];

  useEffect(() => {
    const fetchVenues = async () => {
      try {
        setLoading(true);
        const response = await getApi(
          `${URLS.getAllVenues}?date=${formattedDate}&distance=DESC&game=all&lng=${coordinates.long}&lat=${coordinates.lat}&page=${venuesCurrentPage}&limit=${limit}`
        );

        if (response.status === 200) {
          const apiVenues: ApiVenue[] = response.data.data;
          const total = response.data.total || apiVenues.length;
          setVenuesTotalItems(total);
          setVenuesTotalPages(Math.ceil(total / limit));
          const transformedVenues: Venue[] = apiVenues.map((apiVenue) => ({
            _id: apiVenue._id,
            name: apiVenue.name,
            location: `${apiVenue.city}, ${apiVenue.state}`,
            imageUrl: `${baseImgUrl}/${apiVenue.image}`,
          }));
          setVenuesData(transformedVenues);
        }
      } catch (error) {
        console.error("Error fetching venues:", error);
        setError("Failed to fetch venues. Please try again.");
      } finally {
        setLoading(false);
      }
    };

    if (coordinates.long && coordinates.lat) {
      fetchVenues();
    }
  }, [coordinates.long, coordinates.lat, venuesCurrentPage]);

const fetchBookings = async () => {
  try {
    setLoading(true);
    const response = await getApi(
      `${URLS.getBookings}?type=${selectedFilter}&page=${bookingsCurrentPage}&limit=${limit}`
    );
    if (response.status === 200) {
      const apiBookings: ApiBooking[] = response.data.data;
      const total = response.data.pagination?.totalCount || apiBookings.length;
      setBookingsTotalItems(total);
      setBookingsTotalPages(Math.ceil(total / limit));
      const transformedBookingGroups: BookingGroup[] = apiBookings.reduce(
        (groups: BookingGroup[], booking: ApiBooking) => {
          const bookingDate = new Date(booking.bookingDate);
          const formattedDate = bookingDate.toLocaleDateString("en-US", {
            year: "numeric",
            month: "short",
            day: "numeric",
          });
          const time = booking.bookingSlots;

          const team1: Player[] = booking.team1.map((player) => ({
            name: player.playerData.fullName,
            rating: booking.skillRequired / 100,
            imageUrl:
              player.playerData.profilePic &&
              player.playerData.profilePic.startsWith("https://")
                ? player.playerData.profilePic
                : player.playerData.profilePic
                ? `${baseImgUrl}/${player.playerData.profilePic}`
                : "",
          }));

          const team2: Player[] = booking.team2.map((player) => ({
            name: player.playerData.fullName,
            rating: booking.skillRequired / 100,
            imageUrl:
              player.playerData.profilePic &&
              player.playerData.profilePic.startsWith("https://")
                ? player.playerData.profilePic
                : player.playerData.profilePic
                ? `${baseImgUrl}/${player.playerData.profilePic}`
                : "",
          }));

          const bookingItem: Booking = {
            game: booking.courtId.games,
            duration: "60min",
            type: booking.gameType,
            team1,
            team2,
            location: `${booking.venueId.city}, ${booking.venueId.state}`,
            status: booking.status,
            isComp: booking.isCompetitive ? "Competitive Match" : "Friendly Match",
            dateOfCreation: booking.createdAt,
            bookingId: booking._id,
            bookingType: booking.bookingType,
            askToJoin: booking.askToJoin,
            userId: booking.userId,
            score: booking.score ? booking.score : {},
            bookingdate: booking.bookingDate,
          };

          let group = groups.find(
            (g) => g.date === formattedDate && g.time === time
          );
          if (!group) {
            group = { date: formattedDate, time, bookings: [] };
            groups.push(group);
          }
          group.bookings.push(bookingItem);

          return groups;
        },
        []
      );

      setBookingGroups(transformedBookingGroups);
    }
  } catch (error) {
    console.error("Error fetching bookings:", error);
    setError("Failed to fetch bookings. Please try again.");
  } finally {
    setLoading(false);
  }
};

useEffect(() => {
  fetchBookings();
}, [selectedFilter, bookingsCurrentPage]);

  const handleVenueClick = async (venue: Venue) => {
    navigate(`/venues/${venue._id}`);
  };

  const toggleDropdown = () => {
    setIsDropdownOpen(!isDropdownOpen);
  };

  const handleFilterSelect = (filter: "all" | "upcoming" | "previous") => {
    setSelectedFilter(filter);
    setIsDropdownOpen(false);
    setBookingsCurrentPage(1); // Reset to page 1 on filter change
  };

  const handleVenuesPageChange = (page: number) => {
    setVenuesCurrentPage(page);
  };

  const handleBookingsPageChange = (page: number) => {
    setBookingsCurrentPage(page);
  };

  return (
  <>
   {loading && <Loader fullScreen />}
    <div className="w-full max-w-screen p-4 sm:p-6 flex flex-col lg:flex-row gap-6 lg:gap-10 overflow-x-hidden bg-slate-50/60">
      <div className="w-full lg:w-[68%] flex flex-col gap-5">
        <div className="self-stretch inline-flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 sm:gap-0">
          <div className="text-dark-blue text-2xl sm:text-3xl font-semibold font-['Raleway']">
            All Venues
          </div>
        </div>
        {loading && <div>Loading venues...</div>}
        {error && <div className="text-red-500">{error}</div>}
        {!loading && !error && (
          <Venues venues={venuesData} onVenueClick={handleVenueClick} />
        )}
        {venuesData && venuesData.length >= 10 && (
          <div className="mt-6 sm:mt-8">
            <Pagination
              currentPage={venuesCurrentPage}
              totalPages={venuesTotalPages}
              totalItems={venuesTotalItems}
              itemsPerPage={limit}
              onPageChange={handleVenuesPageChange}
            />
          </div>
        )}
      </div>
      <div className="w-full lg:w-[32%] pt-0 ">
        <div className="flex items-center justify-between gap-3 mb-5">
          <div className="text-dark-blue text-2xl sm:text-3xl font-semibold font-['Raleway'] leading-tight">
            My Bookings
          </div>
          <div className="relative">
            <button
              onClick={toggleDropdown}
              className="flex items-center justify-between gap-2 px-4 sm:px-6 py-2 sm:py-3 bg-white rounded-[39px] shadow-[0px_4px_20px_0px_rgba(92,138,255,0.10)] text-dark-blue text-sm font-medium font-['Raleway'] w-32 sm:w-36 h-10 sm:h-12"
            >
              {selectedFilter.charAt(0).toUpperCase() + selectedFilter.slice(1)}
              <ChevronDown className="w-4 sm:w-5 h-4 sm:h-5 text-dark-blue flex-shrink-0" />
            </button>
            <AnimatePresence>
              {isDropdownOpen && (
                <motion.div
                  initial={{ opacity: 0, y: -10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -10 }}
                  transition={{ duration: 0.2 }}
                  className="absolute top-12 sm:top-14 left-0 bg-white rounded-[10px] shadow-[0px_4px_20px_0px_rgba(92,138,255,0.10)] z-10 w-32 sm:w-36"
                >
                  <div
                    onClick={() => handleFilterSelect("all")}
                    className="px-4 py-2 text-dark-blue text-sm font-medium font-['Raleway'] hover:bg-gray-100 cursor-pointer"
                  >
                    All
                  </div>
                  <div
                    onClick={() => handleFilterSelect("previous")}
                    className="px-4 py-2 text-dark-blue text-sm font-medium font-['Raleway'] hover:bg-gray-100 cursor-pointer"
                  >
                    Previous
                  </div>
                  <div
                    onClick={() => handleFilterSelect("upcoming")}
                    className="px-4 py-2 text-dark-blue text-sm font-medium font-['Raleway'] hover:bg-gray-100 cursor-pointer"
                  >
                    Upcoming
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </div>
        <div className="max-h-[500px] overflow-y-auto scrollbar-hide">
          <style>
            {`
              .scrollbar-hide::-webkit-scrollbar {
                display: none;
              }
              .scrollbar-hide {
                -ms-overflow-style: none;  /* IE and Edge */
                scrollbar-width: none;  /* Firefox */
              }
            `}
          </style>
          <MyBookings bookingGroups={bookingGroups} onScoreUpdate={fetchBookings}/>
        </div>
        <div className="mt-6 sm:mt-8">
          {bookingsTotalItems > 0 &&(
          <Pagination
            currentPage={bookingsCurrentPage}
            totalPages={bookingsTotalPages}
            totalItems={bookingsTotalItems}
            itemsPerPage={limit}
            onPageChange={handleBookingsPageChange}
          />
          )}
        </div>
      </div>
    </div>
  </>
  );
};

export default MainVenueComp;
