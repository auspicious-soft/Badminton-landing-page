import React, { useEffect, useState, useRef } from "react";
import { NavLink, useNavigate } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import logoImage from "../../assets/logonew-removebg-preview.png";
import { Calendar, User, LogOut, Bell, UserRound } from "lucide-react";
import { getApi, postApi } from "../../utils/api";
import { baseImgUrl, URLS } from "../../utils/urls";
import NotificationModal from "./NotificationModal";
import { useAuth } from "../../utils/AuthContext";
import dummyImg from "../../assets/user1book.png";
import { useToast } from "../../utils/ToastContext";
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
  const [isProfileDropdownOpen, setIsProfileDropdownOpen] = useState(false);
  const [notificationsData, setNotificationsData] = useState<Notification[]>(
    []
  );
  const [notificationPage, setNotificationPage] = useState(1);
  const [notificationMeta, setNotificationMeta] = useState({
    total: 0,
    page: 1,
    limit: 10,
    totalPages: 1,
    hasPreviousPage: false,
    hasNextPage: true,
  });
  const [notificationLoading, setNotificationLoading] = useState(false);
  const { userData, logout } = useAuth();
  const { errorToast, successToast } = useToast();
  const navigate = useNavigate();
  const profileRef = useRef<HTMLDivElement>(null);

  const navItems = [
    { name: "Venues", path: "/venues" },
    { name: "Open Matches", path: "/matches" },
    { name: "Bookings", path: "/my-bookings" },
  ];

  const unreadCount = notificationsData.filter(
    (notification) => !notification.isRead
  ).length;

  const getNotification = async (page = 1) => {
    try {
      setNotificationLoading(true);
      const response = await getApi(
        `${URLS.getNotifications}?page=${page}&limit=10`
      );
      if (response.status === 200) {
        const notifyData = response.data.data;
        const meta = response.data.meta;
        setNotificationMeta(meta); // This should update page number!
        setNotificationsData((prev) =>
          page === 1 ? notifyData : [...prev, ...notifyData]
        );
      }
    } catch (error) {
      console.log(error, "error");
    } finally {
      setNotificationLoading(false);
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
    setIsProfileDropdownOpen(false);
  };

  const handleLogout = async () => {
    logout();
    setIsProfileDropdownOpen(false);
    successToast("Logout SuccessFully.");
    navigate("/");
  };

  useEffect(() => {
    getNotification();
  }, []);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        profileRef.current &&
        !profileRef.current.contains(event.target as Node)
      ) {
        setIsProfileDropdownOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  return (
    <nav className="w-full px-4 sm:px-6 py-4 bg-slate-50/60">
      <div className="max-w-full mx-auto">
        {/* Top row: Logo and Icons (always visible) */}
        <div className="flex items-center justify-between">
          {/* Logo */}
          <div className="flex items-center h-16 sm:h-20 w-auto">
            <img
              src={logoImage}
              alt="Logo"
              className="h-16 sm:h-20 w-auto object-contain  cursor-pointer"
              onClick={() => navigate("/venues")}
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

          {/* Icons: Bookings and Profile */}
          <div className="flex items-center gap-3 ">
            <div ref={profileRef} className="relative">
              <div
                className=" bg-slate-50/40 rounded-full shadow-[0_4px_20px_rgba(92,138,255,0.1)] transition-shadow duration-200 hover:bg-gray-100 hover:shadow-md cursor-pointer"
                onClick={() => setIsProfileDropdownOpen(!isProfileDropdownOpen)}
              >
                <div className="w-12 h-12 rounded-full overflow-hidden">
                  <img
                    src={
                      userData
                        ? userData.profilePic.startsWith("https")
                          ? userData.profilePic
                          : `${baseImgUrl}/${userData.profilePic}`
                        : dummyImg
                    }
                    className="w-full h-full object-cover"
                    alt="Profile"
                  />
                </div>
                {unreadCount > 0 && (
                  <span className="absolute -top-1 -right-1 bg-red-500 text-white text-xs font-semibold rounded-full w-5 h-5 flex items-center justify-center">
                    {unreadCount}
                  </span>
                )}
              </div>
              <AnimatePresence>
                {isProfileDropdownOpen && (
                  <motion.div
                    initial={{ opacity: 0, y: -10 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -10 }}
                    transition={{ duration: 0.2 }}
                    className="absolute right-0 top-12 bg-white rounded-lg shadow-lg z-10 w-48"
                  >
                    <div
                      className="px-4 py-2 flex items-center gap-2 hover:bg-gray-100 cursor-pointer"
                      onClick={() => navigate("/account")}
                    >
                      <UserRound className="w-5 h-5 text-gray-900" />
                      <span className="text-gray-900 font-medium">Account</span>
                    </div>
                    <div
                      className="px-4 py-2 flex items-center gap-2 hover:bg-gray-100 cursor-pointer"
                      onClick={toggleNotificationModal}
                    >
                      <Bell className="w-5 h-5 text-gray-900" />
                      <span className="text-gray-900 font-medium">
                        Notifications
                      </span>
                    </div>
                    <div
                      className="px-4 py-2 flex items-center gap-2 hover:bg-gray-100 cursor-pointer"
                      onClick={handleLogout}
                    >
                      <LogOut className="w-5 h-5 text-gray-900" />
                      <span className="text-gray-900 font-medium">Logout</span>
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
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
        onScrollEnd={async () => {
          if (!notificationLoading && notificationMeta.hasNextPage) {
            const nextPage = notificationMeta.page + 1;
            await getNotification(nextPage);
          }
        }}
        loadingNot={notificationLoading}
      />
    </nav>
  );
};

export default Navbar;
