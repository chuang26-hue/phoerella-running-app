// src/Components/Home/Home.js
// Formatting to display profiles on home page
// In future: create "Race" and "Challenge" objects and allow users to join races/challenges against other users
import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import Parse from "parse";
import ProfileCard from "./ProfileCard";
import { logoutUser } from "../Auth/AuthService";

export default function Home({ profiles }) {
  const navigate = useNavigate();
  const [currentUser, setCurrentUser] = useState(null);

  // Check if user is logged in
  useEffect(() => {
    const user = Parse.User.current();
    setCurrentUser(user);
  }, []);

  const handleLogout = () => {
    logoutUser().then((success) => {
      if (success) {
        setCurrentUser(null);
        alert("Logged out successfully!");
      }
    });
  };

  return (
    <section style={{ padding: "2rem" }}>
      <h1>🏃 Welcome to our Running App</h1>
      <p>Select a runner to view their stats!</p>

      <div
        style={{
          display: "flex",
          flexWrap: "wrap",
          justifyContent: "center",
          marginTop: "2rem",
        }}
      >
        {profiles.length > 0 ? (
          profiles.map((profile) => (
            <ProfileCard key={profile.id} profile={profile} />
          ))
        ) : (
          <p>Loading profiles...</p>
        )}
      </div>

      <div style={{ textAlign: "center", marginTop: "2rem" }}>
        {currentUser ? (
          // User is logged in - show welcome message and logout button
          <>
            <p>Welcome back, {currentUser.get("firstName")}!</p>
            <button
              style={{
                margin: "10px",
                padding: "10px 20px",
                cursor: "pointer",
                backgroundColor: "#dc3545",
                color: "white",
                border: "none",
                borderRadius: "5px",
              }}
              onClick={handleLogout}
            >
              Logout
            </button>
          </>
        ) : (
          // User is not logged in - show login/register buttons
          <>
            <p>Please log in or register to continue.</p>
            <button
              style={{
                margin: "10px",
                padding: "10px 20px",
                cursor: "pointer",
                backgroundColor: "#007bff",
                color: "white",
                border: "none",
                borderRadius: "5px",
              }}
              onClick={() => navigate("/login")}
            >
              Login
            </button>
            <button
              style={{
                margin: "10px",
                padding: "10px 20px",
                cursor: "pointer",
                backgroundColor: "#28a745",
                color: "white",
                border: "none",
                borderRadius: "5px",
              }}
              onClick={() => navigate("/register")}
            >
              Register
            </button>
          </>
        )}
      </div>
    </section>
  );
}