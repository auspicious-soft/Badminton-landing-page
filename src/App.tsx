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

function App() {
  const location = useLocation();

  const showLayoutRoutes = ["/", "/privacy", "/terms"];
  const shouldShowLayout = showLayoutRoutes.includes(location.pathname);

  return (
    <div className="min-h-screen">
      {shouldShowLayout && <Header />}

      <Routes>
        <Route path="/" element={<HomeLanding />} />
        {/* <Route path="*" element={<HomeLanding />} /> */}
        <Route path="/privacy" element={<PrivacyPolicy />} />
        <Route path="/terms" element={<TermsOfService />} />
        <Route path="/dashboard" element={<Dashboard />} />
    

        <Route element={<ProtectedRoute />}>
        <Route
            path="/matches"
            element={
              <>
                <Navbar />
                <div className="pt">
                  <Matches />
                </div>
              </>
            }
          />
        </Route>

            
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
      </Routes>

      {shouldShowLayout && <Footer />}
    </div>
  );
}

export default App;



