import React from "react";
import { Routes, Route, useLocation } from "react-router-dom";
import Header from "./components/common/Header";
import Footer from "./components/common/Footer";
import PrivacyPolicy from "./pages/PrivacyPolicy";
import TermsOfService from "./pages/TermsOfService";
import HomeLanding from "./pages/HomeLanding";
import ProtectedRoute from "./components/ProtectedRoute";
import Dashboard from "./pages/Dashboard";
import Matches from "./pages/Matches";
import Navbar from "./components/common/Navbar";
import MainVenueComp from "./pages/Venues";
import SingleVenue from "./pages/SingleVenue";
import Account from "./pages/Account";
import MyBookings from "./components/myBookings/MyBookings";
import MyBookingsPage from "./pages/MyBookingsPage";
import Venues2 from "./pages/NewMatchesPage";
import { NotificationProvider } from "./utils/NotificationContext";
import ContactSupport from "./components/landingPage/ContactSupport";
import CancellationAndRefund from "./components/landingPage/CancellationAndRefund";

function App() {
  const location = useLocation();

  const showLayoutRoutes = ["/", "/privacy", "/terms","/contact-us", "/cancellation-refund"];
  const shouldShowLayout = showLayoutRoutes.includes(location.pathname);

  return (
      <NotificationProvider>
    <div className="min-h-screen">
      {shouldShowLayout && <Header />}

      <Routes>
        <Route path="/" element={<HomeLanding />} />
        {/* <Route path="*" element={<HomeLanding />} /> */}
        <Route path="/privacy" element={<PrivacyPolicy />} />
        <Route path="/terms" element={<TermsOfService />} />
        <Route path="/dashboard" element={<Dashboard />} />
            <Route path="/contact-us" element={<ContactSupport />} />
            <Route path="/cancellation-refund" element={<CancellationAndRefund />} />


        <Route element={<ProtectedRoute />}>
        {/* <Route
            path="/matches"
            element={
              <>
                <Navbar />
                <div className="pt">
                  <Matches />
                </div>
              </>
            }
          /> */}

 <Route
            path="/matches"
            element={
              <>
                <Navbar />
                <div className="pt">
                  <Venues2 />
                </div>
              </>
            }
          />
               <Route 
            path="/venues"
            element={
              <>
                <Navbar />
                <div className="pt">
                  <MainVenueComp />
                </div>
              </>
            }
          />

              <Route
            path="/venues/:VenueId"
            element={
              <>
                <Navbar />
                <div className="pt">
                  <SingleVenue />
                </div>
              </>
            }
          />

           <Route
            path="/account"
            element={
              <>
                <Navbar />
                <div className="pt">
                  <Account />
                </div>
              </>
            }
          />

            <Route
            path="/my-bookings"
            element={
              <>
                <Navbar />
                <div className="pt">
                  <MyBookingsPage />
                </div>
              </>
            }
          />
        </Route>

            
    
      </Routes>

      {shouldShowLayout && <Footer />}
    </div>
    </NotificationProvider>
  );
}

export default App;



