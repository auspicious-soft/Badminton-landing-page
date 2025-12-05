// import { initializeApp } from "firebase/app";
// import { getMessaging, getToken, onMessage } from "firebase/messaging";

// const firebaseConfig = {
//   apiKey: "AIzaSyDY1COVts8jbneqWcMM9oJznyF7RO2WogA",
//   authDomain: "play-app-9c4df.firebaseapp.com",
//   projectId: "play-app-9c4df",
//   storageBucket: "play-app-9c4df.firebasestorage.app",
//   messagingSenderId: "48002840638",
//   appId: "1:48002840638:web:7562b4453d2f294fccb96f",
//   measurementId: "G-7TK9NBWPDJ"
// };

// const app = initializeApp(firebaseConfig);
// export const messaging = typeof window !== "undefined" ? getMessaging(app) : null;

// export const getBrowserToken = async () => {
//   if (!messaging) return null;

//   try {
//     const permission = await Notification.requestPermission();
//     if (permission !== "granted") {
//       console.warn("Permission not granted");
//       return null;
//     }

//     const token = await getToken(messaging, {
//       vapidKey: process.env.NEXT_PUBLIC_FIREBASE_VAPID_KEY
//     });

//     return token;
//   } catch (err) {
//     console.error("Token error", err);
//     return null;
//   }
// };
import { initializeApp } from "firebase/app";
import { getMessaging, getToken } from "firebase/messaging";

export const firebaseConfig = {
  apiKey: import.meta.env.VITE_FIREBASE_API_KEY,
  authDomain: import.meta.env.VITE_FIREBASE_AUTH_DOMAIN,
  projectId: import.meta.env.VITE_FIREBASE_PROJECT_ID,
  storageBucket: import.meta.env.VITE_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: import.meta.env.VITE_FIREBASE_MESSAGING_SENDER_ID,
  appId: import.meta.env.VITE_FIREBASE_APP_ID,
  measurementId: import.meta.env.VITE_FIREBASE_MEASUREMENT_ID,
};
// {
//   apiKey: "AIzaSyDY1COVts8jbneqWcMM9oJznyF7RO2WogA",
//   authDomain: "play-app-9c4df.firebaseapp.com",
//   projectId: "play-app-9c4df",
//   storageBucket: "play-app-9c4df.firebasestorage.app",
//   messagingSenderId: "48002840638",
//   appId: "1:48002840638:web:7562b4453d2f294fccb96f",
//   measurementId: "G-7TK9NBWPDJ",
// };

const app = initializeApp(firebaseConfig);

export const messaging =
  typeof window !== "undefined" ? getMessaging(app) : null;

export const requestNotificationPermission = async () => {
  try {
    // ⛔ THIS is what triggers the browser-built-in popup
    const permission = await Notification.requestPermission();

    console.log("Browser permission:", permission);

    return permission;
  } catch (error) {
    console.error("Permission error:", error);
    return null;
  }
};

export const getBrowserToken = async () => {
  if (!messaging) return null;

  try {
    const token = await getToken(messaging, {
      vapidKey: import.meta.env.VITE_FIREBASE_VAPID_KEY,
    });
    localStorage.setItem("fcmToken", token || "abcd");
    return token;
  } catch (error) {
    console.error("Token error:", error);
    return null;
  }
};
