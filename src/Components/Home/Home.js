// src/Components/Home/Home.js
// Formatting to display profiles on home page
// In future: create "Race" and "Challenge" objects and allow users to join races/challenges against other users
import React from "react";
import ProfileCard from "./ProfileCard";
import { useNavigate } from "react-router-dom";

export default function Home({ profiles }) {
  const navigate = useNavigate();
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
      <p>Please log in or register to continue.</p>
      <button
        style={{ margin: "10px", padding: "10px 20px" }}
        onClick={() => navigate("/login")}
      >
        Login
      </button>
      <button
        style={{ margin: "10px", padding: "10px 20px" }}
        onClick={() => navigate("/register")}
      >
        Register
      </button>
    </section>
  );
}
