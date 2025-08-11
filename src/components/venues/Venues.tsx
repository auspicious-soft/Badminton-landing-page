import React, { useState } from 'react';
import { Map, ChevronDown, ChevronUp } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

// Define interfaces for type safety
interface Court {
  _id: string;
  name: string;
  venueId: string;
  games: string;
  hourlyRate: number;
  image: string;
  availableSlots: string[];
}

interface Venue {
  _id: string;
  name: string;
  location: string;
  imageUrl: string;
  courts: Court[];
  weather: {
    status: string;
    icon: string;
    temperature: number;
    lastUpdated: string;
  };
}

interface VenuesProps {
  venues: Venue[];
  onVenueClick?: (venue: Venue) => void;
  onCourtClick?: (venue: Venue, court: { _id: string; games: string }) => void;
}

const Venues: React.FC<VenuesProps> = ({ venues, onVenueClick, onCourtClick }) => {
  // State to track which venue's courts are open
  const [openVenueId, setOpenVenueId] = useState<string | null>(null);

  // Toggle courts visibility
  const toggleCourts = (venueId: string) => {
    setOpenVenueId(openVenueId === venueId ? null : venueId);
  };

  // Group venues into rows based on screen size
  const chunkSize = (width: number) => {
    if (width < 640) return 1; // 1 column on mobile
    if (width < 1024) return 2; // 2 columns on tablet
    return 2; // 2 columns on desktop
  };

  // Dynamically calculate rows based on venues
  const rows: Venue[][] = [];
  const currentChunkSize = chunkSize(window.innerWidth);
  for (let i = 0; i < venues.length; i += currentChunkSize) {
    rows.push(venues.slice(i, i + currentChunkSize));
  }

  // Hover animation variants for courts
  const courtHoverVariants = {
    rest: { 
      scale: 1, 
      backgroundColor: '#f3f4f6',
      boxShadow: '0 1px 3px rgba(0, 0, 0, 0.1)'
    },
    hover: { 
      scale: 1.02, 
      backgroundColor: '#dbeafe', 
      boxShadow: '0 4px 12px rgba(59, 130, 246, 0.15)',
      transition: { duration: 0.2 } 
    },
  };

  // Handle court click to navigate to SingleVenue with pre-selected court and game
  const handleCourtClick = (venue: Venue, court: Court, e: React.MouseEvent) => {
    e.stopPropagation(); // Prevent venue click and courts toggle
    if (onCourtClick) {
      onCourtClick(venue, { _id: court._id, games: court.games });
    }
  };

  // Handle venue header click (excluding courts section)
  const handleVenueClick = (venue: Venue, e: React.MouseEvent) => {
    // Check if the click is not on the courts section
    if (!(e.target as HTMLElement).closest('.courts-section')) {
      onVenueClick?.(venue);
    }
  };

  return (
    <div className="w-full flex flex-col gap-4 sm:gap-5">
      {rows.map((venueRow, rowIndex) => (
        <div
          key={rowIndex}
          className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-2 gap-4 sm:gap-5"
        >
          {venueRow.map((venue, venueIndex) => (
            <div
              key={venueIndex}
              className="flex flex-col gap-3 sm:gap-3.5 cursor-pointer"
              onClick={(e) => handleVenueClick(venue, e)}
            >
              <img
                className="w-full h-40 sm:h-48 lg:h-52 rounded-[10px] object-cover"
                src={venue.imageUrl}
                alt={venue.name}
              />
              <div className="flex flex-row gap-4 sm:gap-5 items-start">
                <div className="flex flex-col gap-1.5 sm:gap-[5px] flex-1">
                  <div className="text-gray-800 text-base sm:text-lg font-medium font-['Raleway']">
                    {venue.name}
                  </div>
                  <div className="flex items-center gap-1.5">
                    <Map className="w-4 h-4 text-gray-600" />
                    <div className="text-gray-600 text-xs sm:text-sm font-medium font-['Raleway'] capitalize leading-none">
                      {venue.location}
                    </div>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <img
                    className="w-6 h-6"
                    src={venue.weather.icon}
                    alt={venue.weather.status}
                  />
                  <div className="text-gray-600 text-xs sm:text-sm font-medium font-['Raleway']">
                    {venue.weather.temperature}°C, {venue.weather.status}
                  </div>
                </div>
              </div>
              <div className="w-full bg-gray-100 rounded-lg shadow-[0_4px_20px_rgba(92,138,255,0.1)] courts-section">
                <div
                  className="flex items-center justify-between p-2 cursor-pointer"
                  onClick={(e) => {
                    e.stopPropagation(); // Prevent triggering onVenueClick
                    toggleCourts(venue._id);
                  }}
                >
                  <span className="text-gray-800 text-sm font-medium font-['Raleway']">
                    Courts ({venue.courts.length})
                  </span>
                  {openVenueId === venue._id ? (
                    <ChevronUp className="w-5 h-5 text-gray-600" />
                  ) : (
                    <ChevronDown className="w-5 h-5 text-gray-600" />
                  )}
                </div>
                <AnimatePresence>
                  {openVenueId === venue._id && (
                    <motion.div
                      initial={{ height: 0, opacity: 0 }}
                      animate={{ height: 'auto', opacity: 1 }}
                      exit={{ height: 0, opacity: 0 }}
                      transition={{ duration: 0.3 }}
                      className="w-full min-w-[200px] max-h-[200px] overflow-y-auto scrollbar-hide"
                    >
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
                      <div className="flex flex-col gap-2 p-2">
                        {venue.courts.length > 0 ? (
                          venue.courts.map((court) => (
                            <motion.div
                              key={court._id}
                              className="text-gray-800 text-sm font-medium font-['Raleway'] p-3 border-b border-gray-200 last:border-b-0 rounded-md cursor-pointer flex justify-between items-center"
                              variants={courtHoverVariants}
                              initial="rest"
                              whileHover="hover"
                              onClick={(e) => handleCourtClick(venue, court, e)}
                            >
                              <div className="flex flex-col">
                                <span className="font-semibold text-gray-900">{court.name}</span>
                                <span className="text-xs text-gray-600 mt-1">
                                  {court.games}
                                </span>
                              </div>
                              <div className="flex flex-col items-end">
                              
                                <span className="text-xs text-blue-600 mt-1 hover:underline">
                                  Quick Book →
                                </span>
                              </div>
                            </motion.div>
                          ))
                        ) : (
                          <div className="text-gray-600 text-sm font-medium font-['Raleway'] text-center p-2">
                            No courts available
                          </div>
                        )}
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            </div>
          ))}
        </div>
      ))}
    </div>
  );
};

export default Venues;