import React, { useState, useEffect } from "react";
import { BrowserRouter as Router, Route, Routes } from "react-router-dom";

import { getAllProfiles } from "../../Common/Services/ProfileService";

import Home from "../Home/Home.js";
import Users from "../Users/Users.js";
import About from "../About/About.js";
import Footer from "../Shared/Footer.js";
import ProfileRuns from "../ProfileRuns/ProfileRuns";
import AuthLogin from "../Auth/AuthLogin.js";
import AuthRegister from "../Auth/AuthRegister.js";
import ResetPassword from "../Auth/ResetPassword.js";
import ProtectedRoute from "../ProtectedRoute/ProtectedRoute";
import ProtectedAuthRoute from "../ProtectedRoute/ProtectedAuthRoute";

console.log("ResetPassword =", ResetPassword);
const Main = () => {
  const [profiles, setProfiles] = useState([]);

  useEffect(() => {
    getAllProfiles().then((results) => {
      console.log("Fetched profiles:", results);
      setProfiles(results);
    });
  }, []);

  return (
    <Router>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/users" element={<Users profiles={profiles} />} />
        <Route path="/about" element={<About />} />

        <Route
          path="/profile/:userId"
          element={<ProtectedRoute element={ProfileRuns} />}
        />

        <Route path="/reset-password" element={<ResetPassword />} />

        <Route
          path="/login"
          element={<ProtectedAuthRoute element={AuthLogin} />}
        />
        <Route
          path="/register"
          element={<ProtectedAuthRoute element={AuthRegister} />}
        />
      </Routes>

      <Footer />
    </Router>
  );
};

export default Main;
