import React, { useState, useEffect } from "react";
import Parse from "parse";
import { followUser, unfollowUser, isFollowing } from "../../Common/Services/FollowService";

const FollowButton = ({ profileId, onFollowChange }) => {
  const [following, setFollowing] = useState(false);
  const [loading, setLoading] = useState(true);
  const [currentUserProfile, setCurrentUserProfile] = useState(null);

  useEffect(() => {
    const checkFollowStatus = async () => {
      const currentUser = Parse.User.current();

      // Get current user's profile
      const Profile = Parse.Object.extend("Profile");
      const query = new Parse.Query(Profile);
      query.equalTo("user", currentUser);

      try {
        const profile = await query.first();
        setCurrentUserProfile(profile);

        if (profile && profile.id !== profileId) {
          // Only check follow status if NOT viewing own profile
          const followStatus = await isFollowing(profile.id, profileId);
          setFollowing(followStatus);
        }
      } catch (error) {
        console.error("Error checking follow status:", error);
      }

      setLoading(false);
    };

    checkFollowStatus();
  }, [profileId]);

  const handleFollowToggle = async () => {
    // Store previous state in case of error
    const previousFollowingState = following;
    setLoading(true);

    try {
      if (following) {
        await unfollowUser(currentUserProfile.id, profileId);
        setFollowing(false);
      } else {
        await followUser(currentUserProfile.id, profileId);
        setFollowing(true);
      }

      if (onFollowChange) {
        await onFollowChange();
      }
    } catch (error) {
      // Revert state on error to prevent UI inconsistency
      setFollowing(previousFollowingState);
      alert("Error updating follow status. Please try again.");
      console.error("Follow action failed:", error);
    } finally {
      setLoading(false);
    }
  };

  // Don't show button if viewing own profile
  if (!currentUserProfile || currentUserProfile.id === profileId) {
    return null;
  }

  return (
    <button
      onClick={handleFollowToggle}
      disabled={loading}
      style={{
        padding: "10px 20px",
        cursor: loading ? "not-allowed" : "pointer",
        backgroundColor: loading ? "#6c757d" : (following ? "#6c757d" : "#007bff"),
        color: "white",
        border: "none",
        borderRadius: "5px",
        fontSize: "14px",
        fontWeight: "bold",
        opacity: loading ? 0.6 : 1,
        transition: "background-color 0.2s",
      }}
    >
      {loading ? "..." : following ? "Unfollow" : "Follow"}
    </button>
  );
};

export default FollowButton;