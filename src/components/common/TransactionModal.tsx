import React from "react";
import { motion, AnimatePresence } from "framer-motion";
import { X } from "lucide-react";

interface Transaction {
  _id: string;
  text: string;
  amount: number;
  status: string;
  method: string;
  notes: string[];
  playcoinsUsed: number;
  createdAt: string;
  transactionType: string;
  paymentMethod: string;
  paymentBreakdown: {
    totalAmount: number;
    moneyPaid: number;
    playcoinsUsed: number;
  };
}

interface TransactionModalProps {
  transaction: Transaction;
  onClose: () => void;
}

const TransactionModal: React.FC<TransactionModalProps> = ({
  transaction,
  onClose,
}) => {
  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        transition={{ duration: 0.3 }}
        className="fixed inset-0 bg-black bg-opacity-60 flex items-center justify-center z-50"
      >
        <motion.div
          initial={{ scale: 0.8, y: 50, opacity: 0 }}
          animate={{ scale: 1, y: 0, opacity: 1 }}
          exit={{ scale: 0.8, y: 50, opacity: 0 }}
          transition={{ duration: 0.3, ease: "easeOut" }}
          className="bg-white rounded-2xl shadow-2xl w-[90vw] max-w-md sm:max-w-2xl max-h-[90vh] overflow-y-auto scrollbar-hide"
        >
          <style>
            {`
              .scrollbar-hide::-webkit-scrollbar {
                display: none;
              }
              .scrollbar-hide {
                -ms-overflow-style: none;
                scrollbar-width: none;
              }
            `}
          </style>
          <div className="relative bg-gradient-to-r from-blue-500 to-indigo-600 p-3 sm:p-4 flex justify-between items-center">
            <h3 className="text-white text-lg sm:text-xl font-semibold font-['Raleway']">
              Transaction Details
            </h3>
            <button
              onClick={onClose}
              className="absolute top-1 right-1 sm:top-2 sm:right-2 text-white hover:text-gray-200 transition z-10 w-5 h-5 sm:w-6 sm:h-6 flex justify-center items-center"
            >
              <X className="w-4 h-4 sm:w-6 sm:h-6" />
            </button>
          </div>
          <div className="p-4 sm:p-6 bg-zinc-100">
            <div className="grid grid-cols-1 gap-3 sm:gap-4 text-gray-800 font-['Raleway'] text-sm sm:text-base">
              <div className="flex flex-col sm:flex-row justify-between border-b pb-2">
                <span className="font-medium">Transaction ID:</span>
                <span className="break-all">{transaction._id}</span>
              </div>
              <div className="flex flex-col sm:flex-row justify-between border-b pb-2">
                <span className="font-medium">Description:</span>
                <span className="break-all">{transaction.text}</span>
              </div>
              <div className="flex justify-between border-b pb-2">
                <span className="font-medium">Amount:</span>
                <span>${transaction.amount}</span>
              </div>
              <div className="flex justify-between border-b pb-2">
                <span className="font-medium">Status:</span>
                <span className="capitalize">{transaction.status}</span>
              </div>
              <div className="flex justify-between border-b pb-2">
                <span className="font-medium">Payment Method:</span>
                <span className="capitalize">{transaction.paymentMethod}</span>
              </div>
              <div className="flex flex-col sm:flex-row justify-between border-b pb-2">
                <span className="font-medium">Time Slots:</span>
                <span className="break-all">
                  {Array.isArray(transaction.notes) &&
                  transaction.notes.length > 0
                    ? transaction.notes.join(", ")
                    : "N/A"}
                </span>
              </div>
              <div className="flex justify-between border-b pb-2">
                <span className="font-medium">Playcoins Used:</span>
                <span>{transaction.playcoinsUsed}</span>
              </div>
              <div className="flex justify-between border-b pb-2">
                <span className="font-medium">Date:</span>
                <span className="break-all">{new Date(transaction.createdAt).toLocaleString()}</span>
              </div>
              <div className="flex justify-between border-b pb-2">
                <span className="font-medium">Transaction Type:</span>
                <span className="capitalize">{transaction.transactionType}</span>
              </div>
              <div className="mt-2">
                <span className="font-medium">Payment Breakdown:</span>
                <ul className="mt-2 ml-4 list-disc text-xs sm:text-sm">
                  <li>Total Amount: ${transaction.paymentBreakdown.totalAmount}</li>
                  <li>Money Paid: ${transaction.paymentBreakdown.moneyPaid}</li>
                  <li>Playcoins Used: {transaction.paymentBreakdown.playcoinsUsed}</li>
                </ul>
              </div>
            </div>
            <div className="mt-4 sm:mt-6 flex justify-end">
              <button
                onClick={onClose}
                className="bg-blue-500 text-white px-4 sm:px-6 py-2 rounded-lg hover:bg-blue-600 transition font-['Raleway'] font-medium text-sm sm:text-base"
              >
                Close
              </button>
            </div>
          </div>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
};

export default TransactionModal;