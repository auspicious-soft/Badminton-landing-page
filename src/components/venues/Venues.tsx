import React from 'react';
import { Map } from 'lucide-react';

// Define interfaces for type safety
interface Venue {
  _id: string;
  name: string;
  location: string;
  imageUrl: string;
}

interface VenuesProps {
  venues: Venue[];
  onVenueClick?: (venue: Venue) => void;
}

const Venues: React.FC<VenuesProps> = ({ venues, onVenueClick }) => {
  // Group venues into rows based on screen size
  const chunkSize = (width: number) => {
    if (width < 640) return 1; // 1 column on mobile
    if (width < 1024) return 2; // 2 columns on tablet
    return 3; // 3 columns on desktop
  };

  // Dynamically calculate rows based on venues
  const rows: Venue[][] = [];
  const currentChunkSize = chunkSize(window.innerWidth);
  for (let i = 0; i < venues.length; i += currentChunkSize) {
    rows.push(venues.slice(i, i + currentChunkSize));
  }

  return (
    <div className="w-full flex flex-col gap-4 sm:gap-5">
      {rows.map((venueRow, rowIndex) => (
        <div
          key={rowIndex}
          className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-5"
        >
          {venueRow.map((venue, venueIndex) => (
            <div
              key={venueIndex}
              className="flex flex-col gap-3 sm:gap-3.5 cursor-pointer"
              onClick={() => onVenueClick?.(venue)}
            >
              <img
                className="w-full h-40 sm:h-48 lg:h-52 rounded-[10px] object-cover"
                src={venue.imageUrl}
                alt={venue.name}
              />
              <div className="flex flex-col gap-1.5 sm:gap-[5px]">
                <div className="text-gray-800 text-base sm:text-lg font-medium font-['Raleway']">
                  {venue.name}
                </div>
                <div className="w-full sm:w-44 flex items-center gap-1.5">
                  <div className="text-gray-600 text-xs sm:text-sm font-medium font-['Raleway'] capitalize leading-none">
                    {venue.location}
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      ))}
    </div>
  );
};

export default Venues;