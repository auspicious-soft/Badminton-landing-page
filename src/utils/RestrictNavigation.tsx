import { useEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom";

export function useBlockIfNotOnboarded(userData: any) {
  const navigate = useNavigate();
  const location = useLocation();

  const isOnboarded = userData?.phoneVerified;

  useEffect(() => {
    if (!isOnboarded && location.pathname !== "/venues") {
      navigate("/venues", { replace: true });
    }
  }, [isOnboarded, location.pathname, navigate]);
}
