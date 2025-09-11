import React from "react";
import { motion } from "framer-motion";
import clsx from "clsx";

type TableHeader = string;

type TableRow = {
  id: string | number;
  values: (string | React.ReactNode)[];
};

type DynamicTableProps = {
  headers: TableHeader[];
  rows: TableRow[];
  actionIcon?: React.ReactNode;
  onActionClick?: (rowId: string | number) => void;
  activeRowId?: string | number;
  className?: string;
};

const DynamicTable: React.FC<DynamicTableProps> = ({
  headers,
  rows,
  actionIcon,
  onActionClick,
  activeRowId,
  className,
}) => {
  return (
    <div
      className={clsx(
        "w-full p-1 sm:p-2 md:p-4 bg-Table-Clr rounded-[20px] shadow-[0px_4px_20px_rgba(92,138,255,0.10)] overflow-x-auto",
        className
      )}
    >
      {/* Table Content Wrapper */}
      <div className="flex flex-col max-h-[600px] min-w-[300px]">
        {/* Header */}
        <div className="grid grid-cols-6 gap-1 sm:gap-2 md:gap-4 w-full px-1 sm:px-2 md:px-3.5">
          {headers.map((header, idx) => (
            <div
              key={idx}
              className={clsx(
                "text-Secondary-Font text-[8px] sm:text-[10px] md:text-xs font-medium font-['Raleway'] h-8 flex items-center",
                idx === 0 ? "justify-start pl-2 sm:pl-3 md:pl-4" : "justify-center"
              )}
            >
              {header}
            </div>
          ))}
        </div>
        <div className="w-full h-px bg-stone-300" />

        {/* Rows */}
        <div className="flex flex-col gap-1 sm:gap-2 md:gap-2.5 max-h-[560px] overflow-y-auto hide-scrollbar">
  {rows.length === 0 ? (
    <div className="text-center text-Primary-Font text-[8px] sm:text-[10px] md:text-xs font-medium font-['Raleway'] py-4">
      No data available
    </div>
          ) : (
            rows.map((row, rowIdx) => {
              const isAlternate = rowIdx % 2 !== 0;
              const isActive = activeRowId === row.id;

              return (
                <motion.div
                  key={row.id}
                  className={clsx(
                    "grid grid-cols-6 gap-1 sm:gap-2 md:gap-4 w-full px-1 sm:px-2 md:px-3.5 py-1 sm:py-2 md:py-3 rounded-[10px] items-center cursor-pointer",
                    isActive
                      ? "bg-blue-500 text-white"
                      : isAlternate
                      ? "bg-Grey"
                      : "bg-Row-color"
                  )}
                  onClick={() => onActionClick?.(row.id)}
                  animate={{
                    backgroundColor: isActive
                      ? "#3b82f6"
                      : isAlternate
                      ? "#f3f4f6"
                      : "#ffffff",
                    scale: isActive ? 1.02 : 1,
                    opacity: isActive ? 0.95 : 1,
                  }}
                  transition={{ duration: 0.3, ease: "easeInOut" }}
                >
                  {row.values.map((value, colIdx) => (
                    <div
                      key={colIdx}
                      className={clsx(
                        "text-[8px] sm:text-[10px] md:text-xs font-medium font-['Raleway'] h-8 flex items-center",
                        colIdx === 0
                          ? "justify-start pl-2 sm:pl-4 md:pl-8 truncate gap-1 sm:gap-2 md:gap-4"
                          : "justify-center",
                        isActive ? "text-white" : "text-gray-900"
                      )}
                    >
                      {value || "N/A"}
                    </div>
                  ))}

                  {/* Action Icon (Last Column) */}
                  {actionIcon && (
                    <div
                      onClick={(e) => {
                        e.stopPropagation();
                        onActionClick?.(row.id);
                      }}
                      className="cursor-pointer w-full flex items-center justify-center hover:scale-105 transition-transform h-8"
                    >
                      {actionIcon}
                    </div>
                  )}
                </motion.div>
              );
            })
          )}
        </div>
      </div>
    </div>
  );
};

export default DynamicTable;