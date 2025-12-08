// src/Components/Users/Users.js
// Display all profiles/users on the users page
import React, { useState } from "react";
<<<<<<< HEAD
import ProfileCard from "./ProfileCard";
import SearchBar from "./SearchBar";
=======
import ProfileCard from "../Home/ProfileCard";
import SearchBar from "../Home/SearchBar";
>>>>>>> 5c22930 (Merge pull request #5 from chuang26-hue/feature-6-B)

export default function Users({ profiles }) {
  const [searchTerm, setSearchTerm] = useState("");

  const filteredProfiles = profiles.filter((profile) => {
<<<<<<< HEAD
    if (!profile || typeof profile.get !== "function") return false;

    if (!searchTerm) return true;
    const searchLower = searchTerm.toLowerCase();

=======
    // Guard: ensure profile is a valid Parse object before calling .get()
    if (!profile || typeof profile.get !== 'function') {
      return false;
    }
    
    if (!searchTerm) return true; // Show all if no search term

    const searchLower = searchTerm.toLowerCase();
>>>>>>> 5c22930 (Merge pull request #5 from chuang26-hue/feature-6-B)
    const name = profile.get("name")?.toLowerCase() || "";
    const username = profile.get("username")?.toLowerCase() || "";

    return name.includes(searchLower) || username.includes(searchLower);
  });

  return (
<<<<<<< HEAD
    <div className="bg-gray-50 min-h-screen">
      <section className="p-8 max-w-5xl mx-auto">
        <h1 className="text-3xl font-bold mb-2">👥 All Users</h1>
        <p className="text-lg mb-6">Select a runner to view their stats!</p>

        <SearchBar searchTerm={searchTerm} onSearchChange={setSearchTerm} />

        <div className="flex flex-wrap justify-center mt-8 gap-4">
          {profiles.length > 0 ? (
            filteredProfiles.map((profile) => (
              <ProfileCard key={profile.id} profile={profile} />
            ))
          ) : (
            <p className="text-gray-500">Loading profiles...</p>
          )}
        </div>
      </section>
    </div>
  );
}
=======
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

>>>>>>> 5c22930 (Merge pull request #5 from chuang26-hue/feature-6-B)
