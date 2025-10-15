// src/Components/ProfileRuns/AddRunForm.js
// goal is to create a form to get users input, to add a run to their profile
import React, { useState } from "react";
import { createRun } from "../../Common/Services/RunService"; // adjust path if needed

export default function AddRunForm({ profileId, onAdded }) {
  const [distance, setDistance] = useState("");
  const [time, setTime] = useState("");
  const [pace, setPace] = useState("");
  const [location, setLocation] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      // using RunService.createRun signature:
      // createRun(distance, time, pace, location, profileId)
      await createRun(
        parseFloat(distance), 
        parseFloat(time),
        pace,
        location,
        profileId
      );

      // call parent to refresh runs
      if (onAdded) await onAdded();

      // clear form
      setDistance("");
      setTime("");
      setPace("");
      setLocation("");
    } catch (err) {
      console.error("Failed to create run:", err);
      alert("Could not add run. Check console for details.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} style={{ maxWidth: 420, marginBottom: 20 }}>
      <h3>Add a Run to Your Profile</h3>

      <input
        name="distance"
        type="number"
        step="any"
        placeholder="Distance (km)"
        value={distance}
        onChange={(e) => setDistance(e.target.value)}
        required
        style={{ display: "block", width: "100%", marginBottom: 8 }}
      />

      <input
        name="time"
        type="text"
        placeholder="Time in Minutes"
        value={time}
        onChange={(e) => setTime(e.target.value)}
        required
        style={{ display: "block", width: "100%", marginBottom: 8 }}
      />

      <input
        name="pace"
        type="text"
        placeholder="Pace (min/km)"
        value={pace}
        onChange={(e) => setPace(e.target.value)}
        style={{ display: "block", width: "100%", marginBottom: 8 }}
      />

      <input
        name="location"
        type="text"
        placeholder="Location"
        value={location}
        onChange={(e) => setLocation(e.target.value)}
        style={{ display: "block", width: "100%", marginBottom: 12 }}
      />

      <button type="submit" disabled={loading}>
        {loading ? "Adding…" : "Add Run"}
      </button>
    </form>
  );
}
