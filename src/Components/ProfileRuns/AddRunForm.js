// src/Components/ProfileRuns/AddRunForm.js
// goal is to create a form to get users input, to add a run to their profile
import React, { useState, useEffect, useRef } from "react";
import { createRun } from "../../Common/Services/RunService"; // adjust path if needed
import { getAllProfiles } from "../../Common/Services/ProfileService";

export default function AddRunForm({ profileId, onAdded }) {
  const [distance, setDistance] = useState("");
  const [hours, setHours] = useState("");
  const [minutes, setMinutes] = useState("");
  const [location, setLocation] = useState("");
  const [loading, setLoading] = useState(false);
  
  // Tagging state
  const [allProfiles, setAllProfiles] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedRunners, setSelectedRunners] = useState([]);
  const [showDropdown, setShowDropdown] = useState(false);
  const searchInputRef = useRef(null);
  const dropdownRef = useRef(null);

  // Fetch all profiles on mount
  useEffect(() => {
    getAllProfiles().then(setAllProfiles);
  }, []);

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (
        dropdownRef.current &&
        !dropdownRef.current.contains(event.target) &&
        searchInputRef.current &&
        !searchInputRef.current.contains(event.target)
      ) {
        setShowDropdown(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  // Get current user's profile ID to exclude from tagging
  const currentUserProfileId = profileId; // The profileId prop is the current user's profile

  // Filter profiles for autocomplete - exactly like Home.js pattern
  const filteredProfiles = allProfiles.filter((profile) => {
    if (!searchTerm) return false; // Don't show suggestions if empty

    // Exclude already selected runners
    const isSelected = selectedRunners.some((selected) => selected.id === profile.id);
    if (isSelected) return false;

    // Exclude current user's profile
    if (profile.id === currentUserProfileId) return false;

    const searchLower = searchTerm.toLowerCase();
    const name = profile.get("name")?.toLowerCase() || "";
    const username = profile.get("username")?.toLowerCase() || "";

    return name.includes(searchLower) || username.includes(searchLower);
  }).slice(0, 10); // Limit to 10 suggestions

  const handleSelectRunner = (profile) => {
    if (selectedRunners.length >= 10) {
      alert("Maximum 10 runners can be tagged");
      return;
    }

    // Check if already selected
    if (selectedRunners.some((selected) => selected.id === profile.id)) {
      return;
    }

    setSelectedRunners([...selectedRunners, profile]);
    setSearchTerm("");
    setShowDropdown(false);
  };

  const handleRemoveRunner = (runnerId) => {
    setSelectedRunners(selectedRunners.filter((runner) => runner.id !== runnerId));
  };

  const handleSearchChange = (value) => {
    setSearchTerm(value);
    setShowDropdown(value.length > 0);
  };

  // Format pace from decimal minutes to minutes:seconds format
  const formatPace = (decimalMinutes) => {
    const minutes = Math.floor(decimalMinutes);
    const seconds = Math.round((decimalMinutes - minutes) * 60);
    return `${minutes}:${seconds.toString().padStart(2, '0')}`;
  };

  // Calculate pace automatically from distance, hours, and minutes
  const calculatePace = () => {
    const dist = parseFloat(distance);
    const hrs = parseInt(hours) || 0;
    const mins = parseInt(minutes) || 0;
    
    if (!dist || dist <= 0) return null;
    if (hrs === 0 && mins === 0) return null;
    
    const totalMinutes = (hrs * 60) + mins;
    const calculatedPaceDecimal = totalMinutes / dist;
    
    return {
      decimal: calculatedPaceDecimal,
      formatted: formatPace(calculatedPaceDecimal)
    };
  };

  const calculatedPace = calculatePace();

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    // Validate that at least hours or minutes is provided
    const hrs = parseInt(hours) || 0;
    const mins = parseInt(minutes) || 0;
    if (hrs === 0 && mins === 0) {
      alert("Please enter at least hours or minutes for the run time.");
      return;
    }

    setLoading(true);
    try {
      // Extract runner IDs from selected runners
      const taggedRunnerIds = selectedRunners.map((runner) => runner.id);

      // Calculate total time in minutes
      const totalTimeMinutes = (hrs * 60) + mins;

      // Calculate pace in minutes:seconds format
      const dist = parseFloat(distance);
      let calculatedPaceValue = "";
      if (dist > 0) {
        const paceDecimal = totalTimeMinutes / dist;
        calculatedPaceValue = formatPace(paceDecimal);
      }

      // using RunService.createRun signature:
      // createRun(distance, time, pace, location, profileId, taggedRunners)
      await createRun(
        dist, 
        totalTimeMinutes, // Pass as number, not string
        calculatedPaceValue,
        location,
        profileId,
        taggedRunnerIds
      );

      // call parent to refresh runs
      if (onAdded) await onAdded();

      // clear form
      setDistance("");
      setHours("");
      setMinutes("");
      setLocation("");
      setSelectedRunners([]);
      setSearchTerm("");
      setShowDropdown(false);
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

      {/* Time Input: Hours and Minutes */}
      <div style={{ display: "flex", gap: "8px", marginBottom: 8 }}>
        <div style={{ flex: 1 }}>
          <input
            name="hours"
            type="number"
            min="0"
            placeholder="Hours"
            value={hours}
            onChange={(e) => {
              const val = e.target.value;
              if (val === "" || (parseInt(val) >= 0)) {
                setHours(val);
              }
            }}
            style={{ display: "block", width: "100%", padding: "8px" }}
          />
        </div>
        <div style={{ flex: 1 }}>
          <input
            name="minutes"
            type="number"
            min="0"
            max="59"
            placeholder="Minutes"
            value={minutes}
            onChange={(e) => {
              const val = e.target.value;
              if (val === "" || (parseInt(val) >= 0 && parseInt(val) <= 59)) {
                setMinutes(val);
              }
            }}
            style={{ display: "block", width: "100%", padding: "8px" }}
          />
        </div>
      </div>
      {(hours || minutes) && (
        <div style={{ fontSize: "12px", color: "#666", marginBottom: 8, fontStyle: "italic" }}>
          Total time: {hours || "0"}h {minutes || "0"}m
        </div>
      )}

      {/* Calculated Pace Display */}
      {calculatedPace && (
        <div style={{ marginBottom: 8 }}>
          <div style={{ fontSize: "14px", fontWeight: "bold", marginBottom: 4 }}>
            Calculated Pace:
          </div>
          <div
            style={{
              padding: "8px",
              backgroundColor: "#f5f5f5",
              borderRadius: "4px",
              fontSize: "16px",
              color: "#007bff",
              fontWeight: "bold",
            }}
          >
            {calculatedPace.formatted} min/km
          </div>
        </div>
      )}

      <input
        name="location"
        type="text"
        placeholder="Location"
        value={location}
        onChange={(e) => setLocation(e.target.value)}
        style={{ display: "block", width: "100%", marginBottom: 12 }}
      />

      {/* Tag Runners Section */}
      <div style={{ marginBottom: 12, position: "relative" }}>
        <label style={{ display: "block", marginBottom: 4, fontSize: "14px", fontWeight: "bold" }}>
          Tag Runners {selectedRunners.length > 0 && `(${selectedRunners.length}/10)`}
        </label>
        <input
          ref={searchInputRef}
          type="text"
          placeholder="Search runners by name or username..."
          value={searchTerm}
          onChange={(e) => handleSearchChange(e.target.value)}
          onFocus={() => searchTerm && setShowDropdown(true)}
          style={{
            display: "block",
            width: "100%",
            padding: "8px",
            border: "1px solid #ddd",
            borderRadius: "4px",
            marginBottom: 8,
          }}
        />

        {/* Autocomplete Dropdown */}
        {showDropdown && filteredProfiles.length > 0 && (
          <div
            ref={dropdownRef}
            style={{
              position: "absolute",
              top: "100%",
              left: 0,
              right: 0,
              backgroundColor: "white",
              border: "1px solid #ddd",
              borderRadius: "4px",
              maxHeight: "200px",
              overflowY: "auto",
              zIndex: 1000,
              boxShadow: "0 2px 8px rgba(0,0,0,0.1)",
            }}
          >
            {filteredProfiles.map((profile) => (
              <div
                key={profile.id}
                onClick={() => handleSelectRunner(profile)}
                onMouseEnter={(e) => (e.currentTarget.style.backgroundColor = "#f5f5f5")}
                onMouseLeave={(e) => (e.currentTarget.style.backgroundColor = "white")}
                style={{
                  padding: "10px",
                  cursor: "pointer",
                  borderBottom: "1px solid #eee",
                  transition: "background-color 0.2s",
                }}
              >
                <div style={{ fontWeight: "bold" }}>{profile.get("name")}</div>
                <div style={{ fontSize: "12px", color: "#666" }}>
                  @{profile.get("username")}
                </div>
              </div>
            ))}
          </div>
        )}

        {/* Selected Runners Chips */}
        {selectedRunners.length > 0 && (
          <div
            style={{
              display: "flex",
              flexWrap: "wrap",
              gap: "8px",
              marginTop: "8px",
            }}
          >
            {selectedRunners.map((runner) => (
              <div
                key={runner.id}
                style={{
                  display: "inline-flex",
                  alignItems: "center",
                  gap: "6px",
                  padding: "6px 12px",
                  backgroundColor: "#007bff",
                  color: "white",
                  borderRadius: "20px",
                  fontSize: "14px",
                }}
              >
                <span>{runner.get("name")}</span>
                <button
                  type="button"
                  onClick={() => handleRemoveRunner(runner.id)}
                  style={{
                    background: "none",
                    border: "none",
                    color: "white",
                    cursor: "pointer",
                    fontSize: "16px",
                    fontWeight: "bold",
                    padding: 0,
                    marginLeft: "4px",
                    lineHeight: 1,
                  }}
                  onMouseEnter={(e) => (e.target.style.opacity = "0.7")}
                  onMouseLeave={(e) => (e.target.style.opacity = "1")}
                >
                  ×
                </button>
              </div>
            ))}
          </div>
        )}

        {selectedRunners.length >= 10 && (
          <div style={{ fontSize: "12px", color: "#dc3545", marginTop: 4 }}>
            Maximum 10 runners reached
          </div>
        )}
      </div>

      <button type="submit" disabled={loading}>
        {loading ? "Adding…" : "Add Run"}
      </button>
    </form>
  );
}
