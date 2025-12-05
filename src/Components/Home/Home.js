// src/Components/Home/Home.js
// Formatting to display profiles on home page with infinite scroll
// First install: npm install react-infinite-scroll-component
import React, { useState, useEffect, useMemo } from "react";
import { useNavigate } from "react-router-dom";
import Parse from "parse";
import InfiniteScroll from "react-infinite-scroll-component";
import ProfileCard from "./ProfileCard";
import SearchBar from "./SearchBar";
import { logoutUser } from "../Auth/AuthService";

export default function Home({ profiles }) {
  const navigate = useNavigate();
  const [currentUser, setCurrentUser] = useState(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [displayedProfiles, setDisplayedProfiles] = useState([]);
  const [hasMore, setHasMore] = useState(true);
  
  const PROFILES_PER_PAGE = 4; 

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

  const filteredProfiles = useMemo(() => {
    return profiles.filter((profile) => {
      if (!searchTerm) return true; // Show all if no search term

      const searchLower = searchTerm.toLowerCase();
      const name = profile.get("name")?.toLowerCase() || "";
      const username = profile.get("username")?.toLowerCase() || "";

      return name.includes(searchLower) || username.includes(searchLower);
    });
  }, [profiles, searchTerm]);

  // Initialize displayed profiles when component mounts or search changes
  useEffect(() => {
    const initialProfiles = filteredProfiles.slice(0, PROFILES_PER_PAGE);
    setDisplayedProfiles(initialProfiles);
    setHasMore(initialProfiles.length < filteredProfiles.length);
  }, [filteredProfiles]);

  // Function to load more profiles
  const loadMoreProfiles = () => {
    const currentLength = displayedProfiles.length;
    const nextProfiles = filteredProfiles.slice(
      currentLength,
      currentLength + PROFILES_PER_PAGE
    );
    
    setDisplayedProfiles([...displayedProfiles, ...nextProfiles]);
    setHasMore(currentLength + nextProfiles.length < filteredProfiles.length);
  };

  return (
    <section style={{ padding: "2rem" }}>
      <h1>🏃 Welcome to our Running App</h1>
      <p>Select a runner to view their stats!</p>

      <SearchBar searchTerm={searchTerm} onSearchChange={setSearchTerm} />
      
      <InfiniteScroll
        dataLength={displayedProfiles.length}
        next={loadMoreProfiles}
        hasMore={hasMore}
        loader={
          <div style={{ textAlign: "center", padding: "2rem", color: "#666" }}>
            <h4>Loading more profiles...</h4>
          </div>
        }
        endMessage={
          <div style={{ textAlign: "center", padding: "2rem", color: "#666" }}>
            <p>
              <b>You've seen all {filteredProfiles.length} profiles!</b>
            </p>
          </div>
        }
      >
        <div
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(2, 1fr)",
            gap: "2rem",
            maxWidth: "800px",
            margin: "2rem auto 0",
            padding: "0 1rem",
          }}
        >
          {displayedProfiles.length > 0 ? (
            displayedProfiles.map((profile) => (
              <ProfileCard key={profile.id} profile={profile} />
            ))
          ) : profiles.length === 0 ? (
            <p>Loading profiles...</p>
          ) : (
            <p>No profiles found matching "{searchTerm}"</p>
          )}
        </div>
      </InfiniteScroll>

      <div style={{ textAlign: "center", marginTop: "2rem" }}>
        {currentUser ? (
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
