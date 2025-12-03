import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { getRunsByProfileId } from "../../Common/Services/RunService";
import { getProfileById } from "../../Common/Services/ProfileService";
import { getFollowerCount, getFollowingCount } from "../../Common/Services/FollowService";
import Parse from "parse";
import RunCard from "./RunCard";
import AddRunForm from "./AddRunForm";
import FollowButton from "./FollowButton";

export default function ProfileRuns() {
  const { userId } = useParams();
  const [profile, setProfile] = useState(null);
  const [userRuns, setUserRuns] = useState([]);
  const [followerCount, setFollowerCount] = useState(0);
  const [followingCount, setFollowingCount] = useState(0);

  const fetchRuns = async () => {
    if (!userId) return;
    const runs = await getRunsByProfileId(userId);
    setUserRuns(runs || []);
  };

  useEffect(() => {
    if (userId) {
      getProfileById(userId)
        .then(setProfile)
        .catch((error) => {
          console.error("Error fetching profile:", error);
          setProfile(null);
        });
      getRunsByProfileId(userId)
        .then(setUserRuns)
        .catch((error) => {
          console.error("Error fetching runs:", error);
          setUserRuns([]);
        });
      getFollowerCount(userId)
        .then(setFollowerCount)
        .catch((error) => {
          console.error("Error fetching follower count:", error);
          setFollowerCount(0);
        });
      getFollowingCount(userId)
        .then(setFollowingCount)
        .catch((error) => {
          console.error("Error fetching following count:", error);
          setFollowingCount(0);
        });
    }
  }, [userId]);

  const currentUser = Parse.User.current();
  // Only calculate isOwnProfile when profile is a valid Parse object
  const isOwnProfile = currentUser && profile && typeof profile.get === 'function' && profile.get("user")?.id === currentUser.id;

  // Safely get profile picture URL
  const getProfilePictureUrl = (profilePictureFile) => {
    if (!profilePictureFile) return null;
    if (typeof profilePictureFile === 'string') {
      return profilePictureFile; // Already a URL string
    }
    if (typeof profilePictureFile.url === 'function') {
      return profilePictureFile.url(); // Parse File object
    }
    return null;
  };

  // Get profile picture URL if profile is valid
  const profilePictureUrl = profile && typeof profile.get === 'function' 
    ? getProfilePictureUrl(profile.get("profilePicture"))
    : null;

  return (
    <section style={{ padding: "2rem" }}>
      {profile && typeof profile.get === 'function' ? (
        <>
          {/* Profile header: picture + name side by side */}
          <div
            style={{
              display: "flex",
              alignItems: "center",
              gap: "1rem",
              marginBottom: "1rem",
            }}
          >
            {profilePictureUrl && (
              <img
                src={profilePictureUrl}
                alt={`${profile.get("name")}'s profile`}
                style={{
                  width: "80px",
                  height: "80px",
                  borderRadius: "50%",
                  objectFit: "cover",
                }}
              />
            )}
            <div style={{ flex: 1 }}>
              <h1 style={{ margin: 0 }}>{profile.get("name")}'s Runs</h1>
              <p style={{ margin: "0.5rem 0" }}>@{profile.get("username")}</p>
              {/* Follower stats */}
              <div style={{ fontSize: "14px", color: "#666" }}>
                <span style={{ marginRight: "1rem" }}>
                  <strong>{followerCount}</strong> followers
                </span>
                <span>
                  <strong>{followingCount}</strong> following
                </span>
              </div>
            </div>
            {/* Follow button */}
            <FollowButton profileId={userId} />
          </div>

          {isOwnProfile && <AddRunForm profileId={userId} onAdded={fetchRuns} />}

          <div
            style={{
              display: "flex",
              flexWrap: "wrap",
              justifyContent: "center",
              marginTop: "1rem",
            }}
          >
            {userRuns.length > 0 ? (
              userRuns.map((run) => <RunCard key={run.id} run={run} />)
            ) : (
              <p>No runs yet.</p>
            )}
          </div>
        </>
      ) : (
        <p>Loading profile...</p>
      )}
    </section>
  );
}