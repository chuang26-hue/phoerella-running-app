import React, { useEffect, useState, useCallback } from "react";
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

  const fetchRuns = useCallback(async () => {
    if (!userId) return;
    try {
      const runs = await getRunsByProfileId(userId);
      setUserRuns(runs || []);
    } catch (error) {
      console.error("Error fetching runs:", error);
      setUserRuns([]);
    }
  }, [userId]);

  const refreshFollowerCounts = async () => {
    if (!userId) return;
    try {
      const [followerCountResult, followingCountResult] = await Promise.all([
        getFollowerCount(userId, true),
        getFollowingCount(userId, true)
      ]);
      setFollowerCount(followerCountResult);
      setFollowingCount(followingCountResult);
    } catch (error) {
      console.error("Error refreshing follower counts:", error);
    }
  };

  useEffect(() => {
    if (userId) {
      getProfileById(userId)
        .then(setProfile)
        .catch(() => setProfile(null));
  
      fetchRuns();
  
      getFollowerCount(userId)
        .then(setFollowerCount)
        .catch(() => setFollowerCount(0));
  
      getFollowingCount(userId)
        .then(setFollowingCount)
        .catch(() => setFollowingCount(0));
    }
  }, [userId, fetchRuns]);

  const currentUser = Parse.User.current();
  const isOwnProfile = currentUser && profile && typeof profile.get === 'function' && profile.get("user")?.id === currentUser.id;

  const getProfilePictureUrl = (profilePictureFile) => {
    if (!profilePictureFile) return null;
    if (typeof profilePictureFile === 'string') return profilePictureFile;
    if (typeof profilePictureFile.url === 'function') return profilePictureFile.url();
    return null;
  };

  const profilePictureUrl = profile && typeof profile.get === 'function' 
    ? getProfilePictureUrl(profile.get("profilePicture"))
    : null;

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-4xl mx-auto px-6 py-8">
        {profile && typeof profile.get === 'function' ? (
          <>
            {/* Profile Header */}
            <div className="bg-white rounded-2xl shadow-sm p-8 mb-6">
              <div className="flex items-start gap-6">
                {profilePictureUrl ? (
                  <img
                    src={profilePictureUrl}
                    alt={`${profile.get("name")}'s profile`}
                    className="w-24 h-24 rounded-full object-cover ring-4 ring-gray-100"
                  />
                ) : (
                  <div className="w-24 h-24 rounded-full bg-gray-200 flex items-center justify-center text-gray-500 text-3xl font-semibold ring-4 ring-gray-100">
                    {profile.get("name")?.charAt(0)}
                  </div>
                )}

                <div className="flex-1">
                  <h1 className="text-3xl font-bold text-gray-900 mb-1">{profile.get("name")}</h1>
                  <p className="text-lg text-gray-500 mb-4">@{profile.get("username")}</p>

                  <div className="flex gap-6 text-sm mb-4">
                    <div>
                      <span className="font-bold text-gray-900">{followerCount}</span>
                      <span className="text-gray-600 ml-1">followers</span>
                    </div>
                    <div>
                      <span className="font-bold text-gray-900">{followingCount}</span>
                      <span className="text-gray-600 ml-1">following</span>
                    </div>
                  </div>

                  {/* Follow Button */}
                  {!isOwnProfile && (
                    <FollowButton profileId={userId} onFollowChange={refreshFollowerCounts} />
                  )}
                </div>
              </div>
            </div>

            {/* Add Run Form */}
            {isOwnProfile && (
              <div className="bg-white rounded-2xl shadow-sm p-6 mb-6">
                <AddRunForm profileId={userId} onAdded={fetchRuns} />
              </div>
            )}

            {/* Runs Section */}
            <div>
              <h2 className="text-2xl font-bold text-gray-900 mb-4">Recent Runs</h2>
              <div className="flex flex-wrap justify-center gap-4">
                {userRuns.length > 0 ? (
                  userRuns.map((run) => <RunCard key={run.id} run={run} />)
                ) : (
                  <div className="bg-white rounded-2xl shadow-sm p-12 text-center w-full">
                    <div className="text-5xl mb-4">🏃‍♂️</div>
                    <p className="text-gray-600">No runs yet.</p>
                  </div>
                )}
              </div>
            </div>
          </>
        ) : (
          <div className="flex flex-col items-center justify-center py-20">
            <div className="w-12 h-12 border-4 border-gray-200 border-t-blue-500 rounded-full animate-spin mb-4"></div>
            <p className="text-gray-500">Loading profile...</p>
          </div>
        )}
      </div>
    </div>
  );
}
