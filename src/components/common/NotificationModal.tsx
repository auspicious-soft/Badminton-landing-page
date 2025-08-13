import React, { useRef } from "react";
import { AnimatePresence, motion, Variants } from "framer-motion";
import { ChevronLeft, X } from "lucide-react";
import paymentSuccess from "../../assets/accepted-1.png";
import paymentFailed from "../../assets/image-1.png";
import defaultIcon from "../../assets/tennis-ball.png";
import freeGame from "../../assets/star-badge-1.png";
import playerJoined from "../../assets/football-player.png";
import { postApi } from "../../utils/api";
import { URLS } from "../../utils/urls";

interface Notification {
  _id: string;
  recipientId: string;  
  type: "PAYMENT_FAILED" | "PAYMENT_SUCCESSFUL" | "PLAYER_JOINED_GAME" | "FREE_GAME_EARNED";
  title: string;
  message: string;
  notificationType: string;
  category: "PAYMENT" | "GAME" | "SYSTEM";
  priority: string;
  referenceId: string;
  referenceType: string;
  metadata: {
    bookingId: string;
    transactionId?: string;
    amount?: number;
    newPlayerId?: string;
    newPlayerName?: string;
    newPlayerPosition?: string;
    newPlayerTeam?: string;
    timestamp: string;
  };
  isRead: boolean;
  isReadyByAdmin: boolean;
  isDeleted: boolean;
  createdAt: string;
  updatedAt: string;
}

interface NotificationModalProps {
  isOpen: boolean;
  onClose: () => void;
  notifications: Notification[];
  onMarkAllRead: () => void;
  onMarkRead: (notificationId: string) => void;
    onScrollEnd?: () => void;
    loadingNot: boolean;
    
}

const NotificationModal: React.FC<NotificationModalProps> = ({
  isOpen,
  onClose,
  notifications,
  onMarkAllRead,
  onMarkRead,
  onScrollEnd,
  loadingNot,
}) => {

  const modalRef = useRef<HTMLDivElement>(null);
  const listRef = useRef<HTMLDivElement>(null);

  const modalVariants: Variants = {
    hidden: { opacity: 0, y: -10 },
    visible: {
      opacity: 1,
      y: 0,
      transition: { duration: 0.2, ease: "easeOut" },
    },
    exit: {
      opacity: 0,
      y: -10,
      transition: { duration: 0.2, ease: "easeIn" },
    },
  };

  const handleOutsideClick = (e: React.MouseEvent<HTMLDivElement>) => {
    if (modalRef.current && !modalRef.current.contains(e.target as Node)) {
      onClose();
    }
  };


  const getIcon = (type: string) => {
    switch (type) {
      case "PAYMENT_SUCCESSFUL":
        return (
          <img src={paymentSuccess} alt="Payment Icon" className="w-5 h-5 m-auto" />
        );
         case "PAYMENT_FAILED":
        return (
          <img src={paymentFailed} alt="Payment Icon" className="w-5 h-5" />
        );
      case "PLAYER_JOINED_GAME":
        return <img src={playerJoined} alt="Game Icon" className="w-5 h-5" />;
      case "FREE_GAME_EARNED":
        return (
          <img src={freeGame} alt="System Icon" className="w-5 h-5" />
        );
      default:
        return (
          <img src={defaultIcon} alt="Default Icon" className="w-5 h-5" />
        );
    }
  };

  const handleScroll = () => {
    if (listRef.current) {
      const { scrollTop, scrollHeight, clientHeight } = listRef.current;
      if (scrollTop + clientHeight >= scrollHeight - 10) {
        onScrollEnd && onScrollEnd();
      }
    }
  };


  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
         className="
      fixed inset-0 z-50 flex items-start justify-end pt-14 pr-4 sm:pr-6
      max-[500px]:mt-[6rem] max-[500px]:pt-0 max-[500px]:pr-0 max-[500px]:justify-center
    "
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          onClick={handleOutsideClick}
        >
          <motion.div
            ref={modalRef}
             className="
    w-full max-w-md bg-white rounded-lg shadow-lg
    max-[550px]:w-full max-[550px]:h-screen max-[550px]:rounded-none
  "
            variants={modalVariants}
            initial="hidden"
            animate="visible"
            exit="exit"
          >
           <div className="flex justify-between items-center p-4 border-b border-gray-200">
  <div className="flex items-center gap-2">
    {/* Show back icon only on mobile */}
    <button
      onClick={onClose}
      className="hidden max-[550px]:inline-flex items-center justify-center p-1 rounded-full hover:bg-gray-100"
    >
   <ChevronLeft className="w-5 h-5"/>
    </button>

    <h2 className="text-lg font-semibold font-['Raleway'] text-gray-800">
      Notifications
    </h2>
  </div>

  <button
    className="text-sm font-medium font-['Raleway'] text-blue-600 hover:text-blue-700"
    onClick={onMarkAllRead}
  >
    Mark all as read
  </button>
</div>

            <div 
            className=" max-h-96 overflow-y-auto hide-scrollbar
    max-[550px]:max-h-[calc(100vh-60px)]"
             onScroll={handleScroll}
              ref={listRef}
            >
              {notifications.length === 0 ? (
                <div className="p-4 text-center text-gray-600 text-sm font-['Raleway']">
                  No notifications available
                </div>
              ) : (
                notifications.map((notification) => (
                  <div
                    key={notification._id}
                    className="flex items-start gap-3 p-4 border-b border-gray-100 hover:bg-gray-50"
                  >
                    <div className="flex-shrink-0 mt-1">
                      {getIcon(notification.type)}
                    </div>
                    <div className="flex-1">
                      <div className="text-sm font-semibold font-['Raleway'] text-gray-800">
                        {notification.title}
                      </div>
                      <div className="text-sm font-normal font-['Raleway'] text-gray-600">
                        {notification.message}
                      </div>
                    </div>
                    <div className="flex items-center gap-2">
                      {!notification.isRead && (
                        <>
                          <div className="flex-shrink-0 mt-2">
                            <div className="w-2 h-2 rounded-full bg-green-500"></div>
                          </div>
                          <button
                            className="text-xs font-medium font-['Raleway'] text-blue-600 hover:text-blue-700"
                            onClick={() => onMarkRead(notification._id)}
                          >
                            Mark as read
                          </button>
                        </>
                      )}
                    </div>
                    {loadingNot && (
                    <div className="flex justify-center items-center py-4">
                      <svg className="animate-spin h-6 w-6 text-blue-500" viewBox="0 0 24 24">
                        <circle
                          className="opacity-25"
                          cx="12"
                          cy="12"
                          r="10"
                          stroke="currentColor"
                          strokeWidth="4"
                          fill="none"
                        />
                        <path
                          className="opacity-75"
                          fill="currentColor"
                          d="M4 12a8 8 0 018-8v4a4 4 0 00-4 4H4z"
                        />
                      </svg>
                    </div>
                  )}
                  </div>
                ))
              )}
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

export default NotificationModal;