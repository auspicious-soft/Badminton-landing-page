import React, { useEffect, useRef } from "react";

type InfiniteScrollPaginationProps = {
  currentPage: number;
  totalPages: number;
  totalItems: number;
  itemsPerPage: number;
  onPageChange: (page: number, append: boolean) => void;
  isLoading: boolean;
};

const InfiniteScrollPagination: React.FC<InfiniteScrollPaginationProps> = ({
  currentPage,
  totalPages,
  totalItems,
  itemsPerPage,
  onPageChange,
  isLoading,
}) => {
  const bottomRef = useRef<HTMLDivElement>(null);
  const topRef = useRef<HTMLDivElement>(null);
  const bottomObserverRef = useRef<IntersectionObserver | null>(null);
  const topObserverRef = useRef<IntersectionObserver | null>(null);

  // Update observer when currentPage, totalPages, or isLoading changes
  useEffect(() => {
    // Clean up previous observers
    if (bottomObserverRef.current) {
      bottomObserverRef.current.disconnect();
    }
    if (topObserverRef.current) {
      topObserverRef.current.disconnect();
    }

    // Only observe if not loading and there are more pages
    if (!isLoading && currentPage < totalPages) {
      bottomObserverRef.current = new IntersectionObserver(
        (entries) => {
          if (entries[0].isIntersecting && !isLoading) {
            bottomObserverRef.current?.disconnect(); // Stop observing to prevent multiple triggers
            onPageChange(currentPage + 1, true); // Fetch next page
          }
        },
        { threshold: 0.1 }
      );

      if (bottomRef.current) {
        bottomObserverRef.current.observe(bottomRef.current);
      }
    }

    // Observe top ref for resetting to page 1
    if (!isLoading && currentPage > 1) {
      topObserverRef.current = new IntersectionObserver(
        (entries) => {
          if (entries[0].isIntersecting && !isLoading) {
            topObserverRef.current?.disconnect(); // Stop observing to prevent multiple triggers
            onPageChange(1, false); // Reset to page 1
          }
        },
        { threshold: 0.1 }
      );

      if (topRef.current) {
        topObserverRef.current.observe(topRef.current);
      }
    }

    // Cleanup on unmount
    return () => {
      if (bottomObserverRef.current) {
        bottomObserverRef.current.disconnect();
      }
      if (topObserverRef.current) {
        topObserverRef.current.disconnect();
      }
    };
  }, [currentPage, totalPages, isLoading, onPageChange]);

  return (
    <div>
      <div ref={topRef} className="h-1" />
      {isLoading && (
        <div className="text-center text-dark-blue text-sm font-medium font-['Raleway'] py-4">
          Loading next page...
        </div>
      )}
      <div className="text-Secondary-Font text-xs font-medium font-['Raleway'] text-center py-2">
        Showing {Math.min(totalItems, currentPage * itemsPerPage)} of {totalItems} items
      </div>
      {currentPage < totalPages && <div ref={bottomRef} className="h-1" />}
    </div>
  );
};

export default InfiniteScrollPagination;