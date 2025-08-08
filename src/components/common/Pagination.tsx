import React from "react";

type PaginationProps = {
  currentPage: number;
  totalPages: number;
  totalItems: number;
  itemsPerPage: number;
  onPageChange: (page: number) => void;
};

const Pagination: React.FC<PaginationProps> = ({
  currentPage,
  totalPages,
  totalItems,
  itemsPerPage,
  onPageChange,
}) => {
  const isLastPage = currentPage === totalPages;
  const isFirstPage = currentPage === 1;
  const hasFewerItems = totalItems <= itemsPerPage;

  // Generate visible pages dynamically, always centering the current page
  const visiblePages = (() => {
    if (hasFewerItems || totalPages <= 1) {
      return [1]; // Only show page 1 if items are less than or equal to limit or only one page
    }
    if (totalPages <= 5) {
      return Array.from({ length: totalPages }, (_, i) => i + 1);
    }
    const pages = [];
    const startPage = Math.max(2, currentPage - 1);
    const endPage = Math.min(totalPages - 1, currentPage + 1);

    // Always include page 1
    pages.push(1);

    // Add ellipsis if startPage is greater than 2
    if (startPage > 2) {
      pages.push("...");
    }

    // Add pages around the current page
    for (let i = startPage; i <= endPage; i++) {
      pages.push(i);
    }

    // Add ellipsis if endPage is less than totalPages - 1
    if (endPage < totalPages - 1) {
      pages.push("...");
    }

    // Always include the last page if more than one page
    if (totalPages > 1) {
      pages.push(totalPages);
    }

    return pages;
  })();

  const handlePageClick = (page: number | string) => {
    if (typeof page === "number" && page !== currentPage && !hasFewerItems) {
      onPageChange(page);
    }
  };

  return (
    <div className="w-full flex justify-between items-center mt-4 overflow-x-hidden overflow-y-hidden scrollbar-hide">
      <div className="text-Secondary-Font text-xs font-medium font-['Raleway']">
        Showing {Math.min(totalItems, (currentPage - 1) * itemsPerPage + 1)} to{" "}
        {Math.min(totalItems, currentPage * itemsPerPage)} of {totalItems} items
      </div>

      <div className="flex items-center gap-2">
        <button
          className={`px-2 py-1.5 rounded-md text-xs font-medium font-['Raleway'] transition-colors duration-200 ${
            isFirstPage || hasFewerItems
              ? "bg-gray-200 text-gray-400 cursor-not-allowed"
              : "bg-white text-zinc-800 hover:bg-gray-100"
          }`}
          onClick={() => handlePageClick(currentPage - 1)}
          disabled={isFirstPage || hasFewerItems}
        >
          Prev
        </button>

        {visiblePages.map((p, idx) =>
          p === "..." ? (
            <span
              key={`ellipsis-${idx}`}
              className="w-8 px-2.5 py-1.5 bg-white rounded-md text-zinc-800 text-xs font-medium font-['Raleway'] flex justify-center"
            >
              ...
            </span>
          ) : (
            <button
              key={p}
              className={`w-8 px-2.5 py-1.5 rounded-md text-xs font-medium font-['Raleway'] transition-colors duration-200 ${
                currentPage === p
                  ? "bg-blue-700 text-white"
                  : hasFewerItems
                  ? "bg-gray-200 text-gray-400 cursor-not-allowed"
                  : "bg-white outline outline-1 outline-offset-[-1px] outline-zinc-100 text-zinc-800 hover:bg-gray-100"
              }`}
              onClick={() => handlePageClick(p)}
              disabled={hasFewerItems}
            >
              {p}
            </button>
          )
        )}

        <button
          className={`px-2 py-1.5 rounded-md text-xs font-medium font-['Raleway'] transition-colors duration-200 ${
            isLastPage || hasFewerItems
              ? "bg-gray-200 text-gray-400 cursor-not-allowed"
              : "bg-white text-zinc-800 hover:bg-gray-100"
          }`}
          onClick={() => handlePageClick(currentPage + 1)}
          disabled={isLastPage || hasFewerItems}
        >
          Next
        </button>
      </div>
    </div>
  );
};

export default Pagination;