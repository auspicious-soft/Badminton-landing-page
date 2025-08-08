import React, { useEffect, useState, useRef } from "react";
import { NavLink } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import logoImage from "../../assets/logonew-removebg-preview.png";
import { Bell } from "lucide-react";
import { getApi, postApi } from "../../utils/api";
import { URLS } from "../../utils/urls";
import NotificationModal from "./NotificationModal";

interface Notification {
  _id: string;
  recipientId: string;
  type:
    | "PAYMENT_FAILED"
    | "PAYMENT_SUCCESSFUL"
    | "PLAYER_JOINED_GAME"
    | "FREE_GAME_EARNED";
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

const Navbar = () => {
  const [showNotificationModal, setShowNotificationModal] = useState(false);
  const [notificationsData, setNotificationsData] = useState<Notification[]>(
    []
  );
  const notificationButtonRef = useRef<HTMLDivElement>(null);

  const navItems = [
    { name: "Venues", path: "/venues" },
    { name: "Open Matches", path: "/matches" },
    { name: "Account", path: "/account" },
  ];

  const unreadCount = notificationsData.filter(
    (notification) => !notification.isRead
  ).length;

  const getNotification = async () => {
    try {
      const response = await getApi(`${URLS.getNotifications}`);
      if (response.status === 200) {
        const notifyData = response.data.data;
        setNotificationsData(notifyData);
      }
    } catch (error) {
      console.log(error, "error");
    }
  };

  const markAllNotificationsRead = async () => {
    try {
      const response = await postApi(`${URLS.markAllNotificationsRead}`, {});
      if (response.status === 200) {
        setNotificationsData((prev) =>
          prev.map((notification) => ({ ...notification, isRead: true }))
        );
      }
    } catch (error) {
      console.error("Error marking all notifications as read:", error);
    }
  };

  const markNotificationRead = async (notificationId: string) => {
    try {
      const response = await postApi(`${URLS.markAllNotificationsRead}`, {
        notificationId,
      });
      if (response.status === 200) {
        setNotificationsData((prev) =>
          prev.map((notification) =>
            notification._id === notificationId
              ? { ...notification, isRead: true }
              : notification
          )
        );
      }
    } catch (error) {
      console.error("Error marking notification as read:", error);
    }
  };

  const toggleNotificationModal = () => {
    setShowNotificationModal(!showNotificationModal);
  };

  useEffect(() => {
    getNotification();
  }, []);

  return (
    <nav className="w-full px-4 sm:px-6 py-4 bg-slate-50/60">
      <div className="max-w-full mx-auto">
        {/* Top row: Logo and Notification (always visible) */}
        <div className="flex items-center justify-between">
          {/* Logo */}
          <div className="flex items-center h-16 sm:h-20 w-auto">
            <img
              src={logoImage}
              alt="Logo"
              className="h-16 sm:h-20 w-auto object-contain"
            />
          </div>

          {/* Desktop Nav Links (hidden on mobile) */}
          <div className="hidden sm:flex items-center gap-2 rounded-full shadow-[0_4px_20px_rgba(92,138,255,0.1)] bg-slate-50/60">
            {navItems.map((item) => (
              <NavLink
                key={item.name}
                to={item.path}
                className={({ isActive }) =>
                  `px-6 sm:px-8 py-3 rounded-full font-semibold font-['Raleway'] text-sm sm:text-base transition-all duration-200 ${
                    isActive
                      ? "bg-gray-950 text-white "
                      : "bg-slate-50/60 text-gray-900 hover:bg-gray-100 hover:shadow-md"
                  }`
                }
              >
                {item.name}
              </NavLink>
            ))}
          </div>

          {/* Notification Icon */}
          <div
            ref={notificationButtonRef}
            className="relative p-2 bg-slate-50/40 rounded-full shadow-[0_4px_20px_rgba(92,138,255,0.1)] transition-shadow duration-200 hover:bg-gray-100 hover:shadow-md cursor-pointer"
            onClick={toggleNotificationModal}
          >
            <div className="w-8 h-8 flex items-center justify-center">
              <Bell className="w-6 h-6 text-gray-900" />
              {unreadCount > 0 && (
                <span className="absolute -top-1 -right-1 bg-red-500 text-white text-xs font-semibold rounded-full w-5 h-5 flex items-center justify-center">
                  {unreadCount}
                </span>
              )}
            </div>
          </div>
        </div>

        {/* Mobile Nav Links (only visible on mobile, below the top row) */}
        <div className="sm:hidden mt-4">
          <div className="flex items-center gap-2 rounded-full shadow-[0_4px_20px_rgba(92,138,255,0.1)] bg-slate-50/60  max-[300px]:px-0 max-[300px]:py-0">
            {navItems.map((item) => (
              <NavLink
                key={item.name}
                to={item.path}
                className={({ isActive }) =>
                  `flex-1 px-4 py-3 rounded-full font-semibold font-['Raleway'] text-sm text-center transition-all duration-200  
       max-[300px]:px-2 max-[300px]:py-2
       ${
         isActive
           ? "bg-gray-950 text-white"
           : "bg-slate-50/60 text-gray-900 hover:bg-gray-100 hover:shadow-md"
       }`
                }
              >
                <span className="max-[395px]:hidden">{item.name}</span>
                <span className="hidden max-[395px]:inline">
                  {item.name === "Open Matches" ? "Open Mat.." : item.name}
                </span>
              </NavLink>
            ))}
          </div>
        </div>
      </div>

      {/* Notification Modal */}
      <NotificationModal
        isOpen={showNotificationModal}
        onClose={() => setShowNotificationModal(false)}
        notifications={notificationsData}
        onMarkAllRead={markAllNotificationsRead}
        onMarkRead={markNotificationRead}
      />
    </nav>
  );
};

export default Navbar;
