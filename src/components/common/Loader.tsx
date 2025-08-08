import React from "react";
import { motion } from "framer-motion";

const colors = ["#3B82F6", "#64748B", "#E5E7EB", "#60A5FA", "#CBD5E1"];

const Loader: React.FC<{ fullScreen?: boolean }> = ({ fullScreen = false }) => {
  return (
    <div
      className={`flex flex-col items-center justify-center gap-6 ${
        fullScreen
          ? "fixed inset-0 z-[1000] bg-white/70 backdrop-blur-md"
          : ""
      }`}
    >
      {/* Juggling Bars (Wave-like Bounce) */}
      <div className="flex items-end justify-center gap-2">
        {colors.map((color, index) => (
          <motion.div
            key={index}
            className="w-3 rounded-full"
            style={{
              backgroundColor: color,
              height: `${16 + index * 4}px`,
            }}
            animate={{
              y: [0, -20, 0],
            }}
            transition={{
              duration: 1,
              repeat: Infinity,
              delay: index * 0.15,
              ease: "easeInOut",
            }}
          />
        ))}
      </div>

      {/* Animated "Loading..." Text */}
      <motion.div
        className="text-gray-600 text-sm font-medium tracking-wide"
        initial={{ opacity: 0.6, scale: 0.95 }}
        animate={{
          opacity: [0.6, 1, 0.6],
          scale: [0.95, 1.05, 0.95],
        }}
        transition={{
          duration: 2,
          repeat: Infinity,
          ease: "easeInOut",
        }}
      >
        Loading...
      </motion.div>
    </div>
  );
};

export default Loader;
