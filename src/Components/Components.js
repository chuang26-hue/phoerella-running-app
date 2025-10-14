import React from "react";
import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import Home from "./Home/Home.js";
import About from "./About/About.js";
import Footer from "./Shared/Footer.js";
import ProfileRuns from "./ProfileRuns/ProfileRuns";

export default function Components({ profiles, onSelectProfile }) {
  return (
    <Router>
      <Routes>
        {/* Pass profiles to Home so it can render them */}
        <Route path="/" element={<Home profiles={profiles} />} />
        <Route path="/about" element={<About />} />
        <Route path="/profile/:userId" element={<ProfileRuns />} />
      </Routes>
      <Footer />
    </Router>
  );
}
