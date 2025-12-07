// src/Components/Home/Home.js
// Display Run activities from people you follow with infinite scroll
import './Home.css';
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
      const Profile = Parse.Object.extend("Profile");
      const query = new Parse.Query(Profile);
      query.equalTo("user", user);
      
      query.first().then((profile) => {
        if (profile) {
          return getFollowingProfiles(profile.id);
        }
        return [];
      }).then((followedProfiles) => {
        if (followedProfiles && followedProfiles.length > 0) {
          const profileIds = followedProfiles.map((profile) => profile.id);
          setFollowedProfileIds(profileIds);
          return getRunsByProfileIds(profileIds, 0, RUNS_PER_PAGE);
        }
        setFollowedProfileIds([]);
        return [];
      }).then((runsData) => {
        const runs = runsData || [];
        setDisplayedRuns(runs);
        setHasMore(runs.length === RUNS_PER_PAGE);
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

  const loadMoreRuns = () => {
    if (followedProfileIds.length === 0) {
      setHasMore(false);
      return;
    }

    getRunsByProfileIds(followedProfileIds, skip, RUNS_PER_PAGE)
      .then((newRuns) => {
        if (newRuns.length > 0) {
          setDisplayedRuns([...displayedRuns, ...newRuns]);
          setSkip(skip + newRuns.length);
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

  const getRunProfilePictureUrl = (run) => {
    try {
      const profilePointer = run.get("ProfilePointer");
      if (profilePointer && typeof profilePointer.get === 'function') {
        const profilePictureFile = profilePointer.get("profilePicture");
        if (!profilePictureFile) return null;
        
        if (typeof profilePictureFile === 'string') {
          return profilePictureFile;
        } else if (typeof profilePictureFile.url === 'function') {
          return profilePictureFile.url();
        }
      }
      return null;
    } catch (error) {
      return null;
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <section className="p-8">
        <style>{`
          @keyframes spin {
            0% { transform: rotate(0deg); }
            100% { transform: rotate(360deg); }
          }
        `}</style>
        
        <h1 className="text-3xl font-bold mb-4">🏃 Welcome to our Running App</h1>
        {currentUser ? (
          <p className="text-lg mb-4">Run activities from people you follow</p>
        ) : (
          <p className="text-lg mb-4">Please log in to see run activities from people you follow!</p>
        )}

        {loading ? (
          <div className="flex flex-col items-center justify-center mt-8 gap-2 text-gray-500">
            <div className="w-10 h-10 border-4 border-gray-300 border-t-blue-500 rounded-full animate-spin"></div>
            <p>Loading runs…</p>
          </div>
        ) : !currentUser ? (
          null
        ) : (
          <InfiniteScroll
            dataLength={displayedRuns.length}
            next={loadMoreRuns}
            hasMore={hasMore}
            loader={
              <div className="sticky bottom-0 w-full bg-white/90 backdrop-blur-md p-4 text-center text-gray-500 flex flex-col items-center gap-2">
                <div className="w-8 h-8 border-4 border-gray-300 border-t-blue-500 rounded-full animate-spin"></div>
                <p className="m-0">Loading more runs…</p>
              </div>
            }
            endMessage={
              <div className="text-center p-8 text-gray-500">
                <p><b>You've seen all {displayedRuns.length} runs!</b></p>
              </div>
            }
          >
            <div className="flex flex-col items-center mt-8 gap-4">
              {displayedRuns.length > 0 ? (
                displayedRuns.map((run) => {
                  const profileName = getRunProfileName(run);
                  const profileUsername = getRunProfileUsername(run);
                  const profileId = getRunProfileId(run);
                  const profilePictureUrl = getRunProfilePictureUrl(run);

                  return (
                    <div key={run.id} className="relative w-full max-w-2xl">
                      {profileId && (
                        <div
                          onClick={() => navigate(`/profile/${profileId}`)}
                          className="absolute top-2 left-2 bg-white/95 p-2 rounded-lg text-sm font-bold z-10 cursor-pointer transition-all duration-200 flex items-center gap-2 shadow-sm border border-gray-400 hover:bg-blue-500 hover:text-white hover:scale-105 hover:border-blue-500"
                        >
                          {profilePictureUrl && (
                            <img
                              src={profilePictureUrl}
                              alt={`${profileName}'s profile`}
                              className="w-8 h-8 rounded-full object-cover border-2 border-white"
                            />
                          )}
                          <div>
                            <div className="font-bold">{profileName}</div>
                            {profileUsername && (
                              <div className="text-xs opacity-80">@{profileUsername}</div>
                            )}
                          </div>
                        </div>
                      )}
                      <RunCard run={run} width="100%" />
                    </div>
                  );
                })
              ) : (
                <p>Follow people to see their runs!</p>
              )}
            </div>
          </InfiniteScroll>
        )}

        <div className="text-center mt-8">
          {currentUser ? (
            <>
              <p className="mb-4">Welcome back, {currentUser.get("firstName")}!</p>
              <button
                className="m-2.5 px-5 py-2.5 cursor-pointer bg-red-600 text-white border-none rounded hover:bg-red-700 transition-colors"
                onClick={handleLogout}
              >
                Logout
              </button>
            </>
          ) : (
            <>
              <p className="mb-4">Please log in or register to continue.</p>
              <button
                className="m-2.5 px-5 py-2.5 cursor-pointer bg-blue-500 text-white border-none rounded hover:bg-blue-600 transition-colors"
                onClick={() => navigate("/login")}
              >
                Login
              </button>
              <button
                className="m-2.5 px-5 py-2.5 cursor-pointer bg-green-600 text-white border-none rounded hover:bg-green-700 transition-colors"
                onClick={() => navigate("/register")}
              >
                Register
              </button>
            </>
          )}
        </div>
      </section>
    </div>
  );
}