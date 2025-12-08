// src/Components/Users/Users.js
// Display all profiles/users on the users page
import React, { useState } from "react";
import ProfileCard from "../Home/ProfileCard";
import SearchBar from "../Home/SearchBar";

export default function Users({ profiles }) {
  const [searchTerm, setSearchTerm] = useState("");

  const filteredProfiles = profiles.filter((profile) => {
    // Guard: ensure profile is a valid Parse object before calling .get()
    if (!profile || typeof profile.get !== 'function') {
      return false;
    }
    
    if (!searchTerm) return true; // Show all if no search term

    const searchLower = searchTerm.toLowerCase();
    const name = profile.get("name")?.toLowerCase() || "";
    const username = profile.get("username")?.toLowerCase() || "";

    return name.includes(searchLower) || username.includes(searchLower);
  });

  return (
    <section style={{ padding: "2rem" }}>
      <h1>👥 All Users</h1>
      <p>Select a runner to view their stats!</p>

      <SearchBar searchTerm={searchTerm} onSearchChange={setSearchTerm} />
      <div
        style={{
          display: "flex",
          flexWrap: "wrap",
          justifyContent: "center",
          marginTop: "2rem",
        }}
      >
        {profiles.length > 0 ? (
          filteredProfiles.map((profile) => (
            <ProfileCard key={profile.id} profile={profile} />
          ))
        ) : (
          <p>Loading profiles...</p>
        )}
      </div>
    </section>
  );
}

