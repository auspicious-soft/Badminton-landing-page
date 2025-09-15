// utils/NotificationContext.tsx
import React, {
  createContext,
  useContext,
  useState,
  useCallback,
  useEffect,
} from "react";
import { getApi, postApi } from "./api";
import { URLS } from "./urls";
import { Notification } from "../types/Notification"; // ✅ use shared type

interface NotificationMeta {
  total: number;
  page: number;
  limit: number;
  totalPages: number;
  hasPreviousPage: boolean;
  hasNextPage: boolean;
}

interface NotificationContextType {
  notifications: Notification[];
  unreadCount: number;
  loading: boolean;
  hasNextPage: boolean;
  fetchNotifications: (page?: number) => Promise<void>;
  loadMore: () => Promise<void>;
  markAllAsRead: () => Promise<void>;
  markAsRead: (id: string) => Promise<void>;
  refreshNotifications: () => Promise<void>; // 👈 add this
  fetchUserProfileData: () => Promise<void>;
   mainData: any;
}
interface Data {
  _id: string;
  playCoins: number;
  profilePic: string;
  [key: string]: any;
}
const NotificationContext = createContext<NotificationContextType | null>(null);

export const NotificationProvider: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [mainData, setMainData] = useState<Data | null>(null);
  const [meta, setMeta] = useState<NotificationMeta>({
    total: 0,
    page: 1,
    limit: 10,
    totalPages: 1,
    hasPreviousPage: false,
    hasNextPage: false,
  });
  const [loading, setLoading] = useState(false);

  const fetchNotifications = useCallback(async (page = 1) => {
    try {
      setLoading(true);
      const res = await getApi(
        `${URLS.getNotifications}?page=${page}&limit=10`
      );
      if (res.status === 200) {
        const notifyData = res.data.data;
        const metaData = res.data.meta;

        setMeta(metaData);

        setNotifications((prev) =>
          page === 1 ? notifyData : [...prev, ...notifyData]
        );
      }
    } catch (err) {
      console.error("Error fetching notifications:", err);
    } finally {
      setLoading(false);
    }
  }, []);

  const loadMore = useCallback(async () => {
    if (meta.hasNextPage && !loading) {
      await fetchNotifications(meta.page + 1);
    }
  }, [meta, loading, fetchNotifications]);

  const markAllAsRead = useCallback(async () => {
    try {
      const res = await postApi(URLS.markAllNotificationsRead, {});
      if (res.status === 200) {
        setNotifications((prev) => prev.map((n) => ({ ...n, isRead: true })));
      }
    } catch (err) {
      console.error("Error marking all notifications as read:", err);
    }
  }, []);
  const fetchUserProfileData = async () => {
    try {
      const response = await getApi(`${URLS.getUserProfile}`);
      if (response.status === 200) {
        setMainData(response.data.data);
      }
    } catch (error) {
      console.error("Error fetching user profile:", error);
    }
  };

  const markAsRead = useCallback(async (id: string) => {
    try {
      const res = await postApi(URLS.markAllNotificationsRead, {
        notificationId: id,
      });
      if (res.status === 200) {
        setNotifications((prev) =>
          prev.map((n) => (n._id === id ? { ...n, isRead: true } : n))
        );
      }
    } catch (err) {
      console.error("Error marking notification as read:", err);
    }
  }, []);

  const unreadCount = notifications.filter((n) => !n.isRead).length;

  // fetch initial notifications once
  useEffect(() => {
    fetchNotifications(1);
    fetchUserProfileData();
  }, [fetchNotifications]);

  return (
    <NotificationContext.Provider
      value={{
        notifications,
        unreadCount,
        loading,
        hasNextPage: meta.hasNextPage,
        fetchNotifications,
        fetchUserProfileData,
        loadMore,
        markAllAsRead,
        markAsRead,
        refreshNotifications: () => fetchNotifications(1),
        mainData,
      }}
    >
      {children}
    </NotificationContext.Provider>
  );
};

export const useNotification = () => {
  const ctx = useContext(NotificationContext);
  if (!ctx) {
    throw new Error("useNotification must be used within NotificationProvider");
  }
  return ctx;
};
