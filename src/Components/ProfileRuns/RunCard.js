// src/Components/Profile/RunCard.js
// Formatting to display runs on a profile page
import React from "react";

export default function RunCard({ run }) {
  const distance = run.get("distance");
  const time = run.get("time");
  const pace = run.get("pace");
  const location = run.get("location");
  const date = run.get("date")
    ? new Date(run.get("date")).toLocaleDateString()
    : "";

  return (
    <div
      style={{
        border: "1px solid #ddd",
        borderRadius: "12px",
        padding: "1rem",
        margin: "1rem",
        textAlign: "center",
        width: "200px",
        cursor: "default",
        transition: "transform 0.2s",
      }}
    >
      <h3 style={{ marginBottom: "0.5rem" }}>🏃‍♂️ Run</h3>
      <p>
        <strong>Distance:</strong> {distance} km
      </p>
      <p>
        <strong>Time:</strong> {time} minutes
      </p>
      <p>
        <strong>Pace:</strong> {pace} min/km
      </p>
      <p style={{ fontSize: "0.8rem", color: "#777" }}>
        {date && `Date: ${date}`}
      </p>
    </div>
  );
}
