// src/Components/ProfileRuns/AddRunForm.js
// goal is to create a form to get users input, to add a run to their profile
import React, { useState, useEffect, useRef } from "react";
import { createRun } from "../../Common/Services/RunService";
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
  const currentUserProfileId = profileId;

  // Filter profiles for autocomplete
  const filteredProfiles = allProfiles.filter((profile) => {
    if (!searchTerm) return false;

    const isSelected = selectedRunners.some((selected) => selected.id === profile.id);
    if (isSelected) return false;

    if (profile.id === currentUserProfileId) return false;

    const searchLower = searchTerm.toLowerCase();
    const name = profile.get("name")?.toLowerCase() || "";
    const username = profile.get("username")?.toLowerCase() || "";

    return name.includes(searchLower) || username.includes(searchLower);
  }).slice(0, 10);

  const handleSelectRunner = (profile) => {
    if (selectedRunners.length >= 10) {
      alert("Maximum 10 runners can be tagged");
      return;
    }

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
    
    const hrs = parseInt(hours) || 0;
    const mins = parseInt(minutes) || 0;
    if (hrs === 0 && mins === 0) {
      alert("Please enter at least hours or minutes for the run time.");
      return;
    }

    setLoading(true);
    try {
      const taggedRunnerIds = selectedRunners.map((runner) => runner.id);
      const totalTimeMinutes = (hrs * 60) + mins;
      const dist = parseFloat(distance);
      
      let calculatedPaceValue = "";
      if (dist > 0) {
        const paceDecimal = totalTimeMinutes / dist;
        calculatedPaceValue = formatPace(paceDecimal);
      }

      await createRun(
        dist, 
        totalTimeMinutes,
        calculatedPaceValue,
        location,
        profileId,
        taggedRunnerIds
      );

      if (onAdded) await onAdded();

      // Clear form
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
    <form onSubmit={handleSubmit} className="max-w-md mb-5">
      <h3 className="text-xl font-bold mb-4">Add a Run to Your Profile</h3>

      <input
        name="distance"
        type="number"
        step="any"
        placeholder="Distance (km)"
        value={distance}
        onChange={(e) => setDistance(e.target.value)}
        required
        className="block w-full mb-2 px-3 py-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
      />

      {/* Time Input: Hours and Minutes */}
      <div className="flex gap-2 mb-2">
        <div className="flex-1">
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
            className="block w-full px-3 py-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>
        <div className="flex-1">
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
            className="block w-full px-3 py-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>
      </div>
      
      {(hours || minutes) && (
        <div className="text-xs text-gray-500 mb-2 italic">
          Total time: {hours || "0"}h {minutes || "0"}m
        </div>
      )}

      {/* Calculated Pace Display */}
      {calculatedPace && (
        <div className="mb-2">
          <div className="text-sm font-bold mb-1">
            Calculated Pace:
          </div>
          <div className="p-2 bg-gray-100 rounded text-base text-blue-500 font-bold">
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
        className="block w-full mb-3 px-3 py-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
      />

      {/* Tag Runners Section */}
      <div className="mb-3 relative">
        <label className="block mb-1 text-sm font-bold">
          Tag Runners {selectedRunners.length > 0 && `(${selectedRunners.length}/10)`}
        </label>
        <input
          ref={searchInputRef}
          type="text"
          placeholder="Search runners by name or username..."
          value={searchTerm}
          onChange={(e) => handleSearchChange(e.target.value)}
          onFocus={() => searchTerm && setShowDropdown(true)}
          className="block w-full px-3 py-2 border border-gray-300 rounded mb-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
        />

        {/* Autocomplete Dropdown */}
        {showDropdown && filteredProfiles.length > 0 && (
          <div
            ref={dropdownRef}
            className="absolute top-full left-0 right-0 bg-white border border-gray-300 rounded max-h-48 overflow-y-auto z-50 shadow-lg"
          >
            {filteredProfiles.map((profile) => (
              <div
                key={profile.id}
                onClick={() => handleSelectRunner(profile)}
                className="p-2.5 cursor-pointer border-b border-gray-200 transition-colors hover:bg-gray-100"
              >
                <div className="font-bold">{profile.get("name")}</div>
                <div className="text-xs text-gray-500">
                  @{profile.get("username")}
                </div>
              </div>
            ))}
          </div>
        )}

        {/* Selected Runners Chips */}
        {selectedRunners.length > 0 && (
          <div className="flex flex-wrap gap-2 mt-2">
            {selectedRunners.map((runner) => (
              <div
                key={runner.id}
                className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-blue-500 text-white rounded-full text-sm"
              >
                <span>{runner.get("name")}</span>
                <button
                  type="button"
                  onClick={() => handleRemoveRunner(runner.id)}
                  className="bg-transparent border-none text-white cursor-pointer text-base font-bold p-0 ml-1 leading-none hover:opacity-70 transition-opacity"
                >
                  ×
                </button>
              </div>
            ))}
          </div>
        )}

        {selectedRunners.length >= 10 && (
          <div className="text-xs text-red-600 mt-1">
            Maximum 10 runners reached
          </div>
        )}
      </div>

      <button 
        type="submit" 
        disabled={loading}
        className="w-full bg-blue-500 text-white py-2.5 px-4 rounded font-medium hover:bg-blue-600 transition-colors disabled:bg-gray-400 disabled:cursor-not-allowed"
      >
        {loading ? "Adding…" : "Add Run"}
      </button>
    </form>
  );
}