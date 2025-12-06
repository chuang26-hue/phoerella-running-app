// src/Components/Home/Home.js
// Display Run activities from people you follow with infinite scroll
import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import Parse from "parse";
import InfiniteScroll from "react-infinite-scroll-component";
import RunCard from "../ProfileRuns/RunCard";
import { logoutUser } from "../Auth/AuthService";
import { getFollowingProfiles } from "../../Common/Services/FollowService";
import { getRunsByProfileIds } from "../../Common/Services/RunService";

export default function Home() {
  const navigate = useNavigate();
  const [currentUser, setCurrentUser] = useState(null);
  const [followedProfileIds, setFollowedProfileIds] = useState([]);
  const [displayedRuns, setDisplayedRuns] = useState([]);
  const [loading, setLoading] = useState(true);
  const [hasMore, setHasMore] = useState(true);
  const [skip, setSkip] = useState(0);
  
  const RUNS_PER_PAGE = 5;

  // Check if user is logged in and get followed profiles
  useEffect(() => {
    const user = Parse.User.current();
    setCurrentUser(user);
    
    if (user) {
      // Get current user's profile
      const Profile = Parse.Object.extend("Profile");
      const query = new Parse.Query(Profile);
      query.equalTo("user", user);
      
      query.first().then((profile) => {
        if (profile) {
          // Get all profiles the user follows
          return getFollowingProfiles(profile.id);
        }
        return [];
      }).then((followedProfiles) => {
        if (followedProfiles && followedProfiles.length > 0) {
          // Get profile IDs
          const profileIds = followedProfiles.map((profile) => profile.id);
          setFollowedProfileIds(profileIds);
          // Load first batch of runs
          return getRunsByProfileIds(profileIds, 0, RUNS_PER_PAGE);
        }
        setFollowedProfileIds([]);
        return [];
      }).then((runsData) => {
        const runs = runsData || [];
        setDisplayedRuns(runs);
        setHasMore(runs.length === RUNS_PER_PAGE); // If we got a full page, there might be more
        setSkip(RUNS_PER_PAGE);
        setLoading(false);
      }).catch((error) => {
        console.error("Error fetching runs:", error);
        setDisplayedRuns([]);
        setLoading(false);
      });
    } else {
      setLoading(false);
    }
  }, []);

  const handleLogout = () => {
    logoutUser().then((success) => {
      if (success) {
        setCurrentUser(null);
        setFollowedProfileIds([]);
        setDisplayedRuns([]);
        setSkip(0);
        alert("Logged out successfully!");
      }
    });
  };

  // Function to load more runs from server with pagination
  const loadMoreRuns = () => {
    if (followedProfileIds.length === 0) {
      setHasMore(false);
      return;
    }

    // Fetch next batch from server
    getRunsByProfileIds(followedProfileIds, skip, RUNS_PER_PAGE)
      .then((newRuns) => {
        if (newRuns.length > 0) {
          setDisplayedRuns([...displayedRuns, ...newRuns]);
          setSkip(skip + newRuns.length);
          // If we got fewer runs than requested, we've reached the end
          setHasMore(newRuns.length === RUNS_PER_PAGE);
        } else {
          setHasMore(false);
        }
      })
      .catch((error) => {
        console.error("Error loading more runs:", error);
        setHasMore(false);
      });
  };

  // Helper function to get profile name from run
  const getRunProfileName = (run) => {
    try {
      const profilePointer = run.get("ProfilePointer");
      if (profilePointer && typeof profilePointer.get === 'function') {
        return profilePointer.get("name") || "Unknown Runner";
      }
      return "Unknown Runner";
    } catch (error) {
      return "Unknown Runner";
    }
  };

  // Helper function to get profile username from run
  const getRunProfileUsername = (run) => {
    try {
      const profilePointer = run.get("ProfilePointer");
      if (profilePointer && typeof profilePointer.get === 'function') {
        return profilePointer.get("username") || "";
      }
      return "";
    } catch (error) {
      return "";
    }
  };

  // Helper function to get profile ID from run
  const getRunProfileId = (run) => {
    try {
      const profilePointer = run.get("ProfilePointer");
      if (profilePointer) {
        return profilePointer.id;
      }
      return null;
    } catch (error) {
      return null;
    }
  };

  // Helper function to get profile picture URL from run
  const getRunProfilePictureUrl = (run) => {
    try {
      const profilePointer = run.get("ProfilePointer");
      if (profilePointer && typeof profilePointer.get === 'function') {
        const profilePictureFile = profilePointer.get("profilePicture");
        if (!profilePictureFile) return null;
        
        // Handle different types of profile picture data
        if (typeof profilePictureFile === 'string') {
          return profilePictureFile; // Already a URL string
        } else if (typeof profilePictureFile.url === 'function') {
          return profilePictureFile.url(); // Parse File object
        }
      }
      return null;
    } catch (error) {
      return null;
    }
  };

  return (
    <section style={{ padding: "2rem" }}>
      <style>{`
        @keyframes spin {
          0% { transform: rotate(0deg); }
          100% { transform: rotate(360deg); }
        }
      `}</style>
      <h1>🏃 Welcome to our Running App</h1>
      {currentUser ? (
        <p>Run activities from people you follow</p>
      ) : (
        <p>Please log in to see run activities from people you follow!</p>
      )}

{loading ? (
  <p>Loading runs...</p>
) : !currentUser ? (
  <p>Please log in to see run activities.</p>
) : (
  <InfiniteScroll
    dataLength={displayedRuns.length}
    next={loadMoreRuns}
    hasMore={hasMore}
    loader={
      <div style={{ 
        textAlign: "center", 
        padding: "2rem", 
        color: "#666",
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        gap: "1rem"
      }}>
        <div style={{
          width: "40px",
          height: "40px",
          border: "4px solid #f3f3f3",
          borderTop: "4px solid #007bff",
          borderRadius: "50%",
          animation: "spin 1s linear infinite"
        }}></div>
        <h4 style={{ margin: 0 }}>Loading more runs...</h4>
      </div>
    }
    endMessage={
      <div style={{ textAlign: "center", padding: "2rem", color: "#666" }}>
        <p><b>You've seen all {displayedRuns.length} runs!</b></p>
      </div>
    }
  >
    <div
      style={{
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        marginTop: "2rem",
        gap: "1rem",
      }}
    >
      {displayedRuns.length > 0 ? (
        displayedRuns.map((run) => {
          const profileName = getRunProfileName(run);
          const profileUsername = getRunProfileUsername(run);
          const profileId = getRunProfileId(run);
          const profilePictureUrl = getRunProfilePictureUrl(run);

          return (
            <div key={run.id} style={{ position: "relative", width: "100%", maxWidth: "600px" }}>
              {profileId && (
                <div
                  onClick={() => navigate(`/profile/${profileId}`)}
                  style={{
                    position: "absolute",
                    top: "0.5rem",
                    left: "0.5rem",
                    backgroundColor: "rgba(255, 255, 255, 0.95)",
                    padding: "0.5rem",
                    borderRadius: "8px",
                    fontSize: "0.85rem",
                    fontWeight: "bold",
                    zIndex: 1,
                    cursor: "pointer",
                    transition: "all 0.2s",
                    display: "flex",
                    alignItems: "center",
                    gap: "0.5rem",
                    boxShadow: "0 2px 4px rgba(0,0,0,0.1)",
                  }}
                  onMouseEnter={(e) => {
                    e.currentTarget.style.backgroundColor = "rgba(0, 123, 255, 0.9)";
                    e.currentTarget.style.color = "white";
                    e.currentTarget.style.transform = "scale(1.05)";
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.backgroundColor = "rgba(255, 255, 255, 0.95)";
                    e.currentTarget.style.color = "inherit";
                    e.currentTarget.style.transform = "scale(1)";
                  }}
                >
                  {profilePictureUrl && (
                    <img
                      src={profilePictureUrl}
                      alt={`${profileName}'s profile`}
                      style={{
                        width: "32px",
                        height: "32px",
                        borderRadius: "50%",
                        objectFit: "cover",
                        border: "2px solid #fff",
                      }}
                    />
                  )}
                  <div>
                    <div style={{ fontWeight: "bold" }}>{profileName}</div>
                    {profileUsername && (
                      <div style={{ fontSize: "0.75rem", opacity: 0.8 }}>@{profileUsername}</div>
                    )}
                  </div>
                </div>
              )}
              <RunCard run={run} width="100%" />
            </div>
          );
        })
      ) : (
        <p>No runs from people you follow yet.</p>
      )}
    </div>
  </InfiniteScroll>
)}

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
