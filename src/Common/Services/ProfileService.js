import Parse from "parse";

/* SERVICE FOR PARSE SERVER OPERATIONS - PROFILES */

// CREATE operation - new profile
export const createProfile = (name, email, username, profilePicture) => {
  console.log("Creating profile: ", name);
  const Profile = Parse.Object.extend("Profile");
  const profile = new Profile();

  profile.set("name", name);
  profile.set("email", email);
  profile.set("username", username);
  profile.set("profilePicture", profilePicture);

  return profile.save().then((result) => {
    // returns new Profile object
    return result;
  });
};

// READ operation - get profile by ID
export const getProfileById = (id) => {
  const Profile = Parse.Object.extend("Profile");
  const query = new Parse.Query(Profile);
  return query.get(id).then((result) => {
    // return Profile object with objectId: id
    return result;
  });
};

// Cache object
export let Profiles = {};
Profiles.collection = [];

// READ operation - get all profiles
export const getAllProfiles = () => {
  const Profile = Parse.Object.extend("Profile");
  const query = new Parse.Query(Profile);
  return query
    .find()
    .then((results) => {
      console.log("profiles: ", results);
      // Store in cache
      Profiles.collection = results;
      // returns array of Profile Parse objects
      return results;
    })
    .catch((error) => {
      console.log("error: ", error);
      return [];
    });
};

// UPDATE operation - update profile by ID
export const updateProfile = (id, updates) => {
  const Profile = Parse.Object.extend("Profile");
  const query = new Parse.Query(Profile);
  return query.get(id).then((profile) => {
    // Update fields if provided
    if (updates.name) profile.set("name", updates.name);
    if (updates.email) profile.set("email", updates.email);
    if (updates.username) profile.set("username", updates.username);
    if (updates.profilePicture)
      profile.set("profilePicture", updates.profilePicture);

    return profile.save();
  });
};

// DELETE operation - remove profile by ID
export const removeProfile = (id) => {
  const Profile = Parse.Object.extend("Profile");
  const query = new Parse.Query(Profile);
  return query.get(id).then((profile) => {
    return profile.destroy();
  });
};
