// src/Components/Home/Home.js
// Display Run activities from people you follow
import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import Parse from "parse";
import RunCard from "../ProfileRuns/RunCard";
import { logoutUser } from "../Auth/AuthService";
import { getFollowingProfiles } from "../../Common/Services/FollowService";
import { getRunsByProfileIds } from "../../Common/Services/RunService";

export default function Home() {
  const navigate = useNavigate();
  const [currentUser, setCurrentUser] = useState(null);
  const [currentUserProfile, setCurrentUserProfile] = useState(null);
  const [runs, setRuns] = useState([]);
  const [loading, setLoading] = useState(true);

  // Check if user is logged in and fetch runs from followed users
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
          setCurrentUserProfile(profile);
          // Get all profiles the user follows
          return getFollowingProfiles(profile.id);
        }
        return [];
      }).then((followedProfiles) => {
        if (followedProfiles && followedProfiles.length > 0) {
          // Get profile IDs
          const profileIds = followedProfiles.map((profile) => profile.id);
          // Get all runs from followed profiles
          return getRunsByProfileIds(profileIds);
        }
        return [];
      }).then((runsData) => {
        setRuns(runsData || []);
        setLoading(false);
      }).catch((error) => {
        console.error("Error fetching runs:", error);
        setRuns([]);
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
        setCurrentUserProfile(null);
        setRuns([]);
        alert("Logged out successfully!");
      }
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
      <h1>🏃 Welcome to our Running App</h1>
      {currentUser ? (
        <p>Run activities from people you follow</p>
      ) : (
        <p>Please log in to see run activities from people you follow!</p>
      )}

      {loading ? (
        <p>Loading runs...</p>
      ) : (
        <div
          style={{
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            marginTop: "2rem",
            gap: "1rem",
          }}
        >
          {runs.length > 0 ? (
            runs.map((run) => {
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
          ) : currentUser ? (
            <p>No runs from people you follow yet. Start following people to see their activities!</p>
          ) : (
            <p>Please log in to see run activities.</p>
          )}
        </div>
      )}

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