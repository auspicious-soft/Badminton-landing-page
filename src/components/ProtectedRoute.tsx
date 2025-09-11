import { Navigate, Outlet } from "react-router-dom";
import { useBlockIfNotOnboarded } from "../utils/RestrictNavigation";

const ProtectedRoute = () => {
  const token = localStorage.getItem("token");
  const userData = JSON.parse(localStorage.getItem("userData") || "{}");

  // 1. Redirect to login if not authenticated
  if (!token) {
    return <Navigate to="/" replace />;
  }

  // 2. Apply onboarding guard (keeps user on /venues until completed)
  useBlockIfNotOnboarded(userData);

  return <Outlet />;
};

export default ProtectedRoute;
