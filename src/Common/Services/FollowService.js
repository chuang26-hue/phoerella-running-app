import Parse from "parse";

// Follow a user
export const followUser = async (followerProfileId, followingProfileId) => {
  try {
    const Follows = Parse.Object.extend("Follows");
    const follow = new Follows();

    // Create pointers to existing profiles (not creating new profiles)
    const Profile = Parse.Object.extend("Profile");
    
    const followerPointer = new Profile();
    followerPointer.id = followerProfileId;

    const followingPointer = new Profile();
    followingPointer.id = followingProfileId;

    follow.set("follower", followerPointer);
    follow.set("following", followingPointer);

    await follow.save();
    console.log("Successfully followed user");
    return follow;
  } catch (error) {
    console.error("Error following user:", error);
    throw error;
  }
};

// Unfollow a user
export const unfollowUser = async (followerProfileId, followingProfileId) => {
  try {
    const Follows = Parse.Object.extend("Follows");
    const query = new Parse.Query(Follows);

    // Create pointers to find the relationship
    const Profile = Parse.Object.extend("Profile");
    
    const followerPointer = new Profile();
    followerPointer.id = followerProfileId;

    const followingPointer = new Profile();
    followingPointer.id = followingProfileId;

    query.equalTo("follower", followerPointer);
    query.equalTo("following", followingPointer);

    const follow = await query.first();
    if (follow) {
      await follow.destroy();
      console.log("Successfully unfollowed user");
      return true;
    } else {
      console.log("Follow relationship not found");
      return false;
    }
  } catch (error) {
    console.error("Error unfollowing user:", error);
    throw error;
  }
};

// Check if user is following another user
export const isFollowing = async (followerProfileId, followingProfileId) => {
  try {
    const Follows = Parse.Object.extend("Follows");
    const query = new Parse.Query(Follows);

    const Profile = Parse.Object.extend("Profile");
    
    const followerPointer = new Profile();
    followerPointer.id = followerProfileId;

    const followingPointer = new Profile();
    followingPointer.id = followingProfileId;

    query.equalTo("follower", followerPointer);
    query.equalTo("following", followingPointer);

    const follow = await query.first();
    return !!follow;
  } catch (error) {
    console.error("Error checking follow status:", error);
    return false;
  }
};

// Get follower count for a profile
export const getFollowerCount = async (profileId) => {
  try {
    const Follows = Parse.Object.extend("Follows");
    const query = new Parse.Query(Follows);

    const Profile = Parse.Object.extend("Profile");
    const profilePointer = new Profile();
    profilePointer.id = profileId;

    query.equalTo("following", profilePointer);
    const count = await query.count();
    return count;
  } catch (error) {
    console.error("Error getting follower count:", error);
    return 0;
  }
};

// Get following count for a profile
export const getFollowingCount = async (profileId) => {
  try {
    const Follows = Parse.Object.extend("Follows");
    const query = new Parse.Query(Follows);

    const Profile = Parse.Object.extend("Profile");
    const profilePointer = new Profile();
    profilePointer.id = profileId;

    query.equalTo("follower", profilePointer);
    const count = await query.count();
    return count;
  } catch (error) {
    console.error("Error getting following count:", error);
    return 0;
  }
};