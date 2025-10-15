import React, { useState, useEffect } from "react";
import { BrowserRouter as Router, Route, Routes } from "react-router-dom";

import { getAllProfiles } from "../../Common/Services/ProfileService";
import { getRunsByProfileId } from "../../Common/Services/RunService";

import Home from "../Home/Home.js";
import About from "../About/About.js";
import Footer from "../Shared/Footer.js";
import ProfileRuns from "../ProfileRuns/ProfileRuns";

const Main = () => {
  const [profiles, setProfiles] = useState([]);
  const [runs, setRuns] = useState([]);

  // Fetch all profiles
  useEffect(() => {
    getAllProfiles().then((results) => {
      console.log("Fetched profiles:", results);
      setProfiles(results); // parse objects
    });
  }, []);

  // Function to fetch runs for a specific profile
  const fetchRunsForProfile = (profileId) => {
    getRunsByProfileId(profileId).then((results) => {
      console.log("Fetched runs:", results);
      setRuns(results); // parse objects
    });
  };

  return (
    <Router>
      <Routes>
        <Route
          path="/"
          element={<Home profiles={profiles} onSelectProfile={fetchRunsForProfile} />}
        />
        <Route path="/about" element={<About />} />
        <Route
          path="/profile/:userId"
          element={<ProfileRuns runs={runs} />}
        />
      </Routes>
      <Footer />
    </Router>
  );
};

export default Main;
