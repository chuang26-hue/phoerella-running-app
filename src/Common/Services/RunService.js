import Parse from "parse";

// CREATE new run
export const createRun = (distance, time, pace, location, profileId, 
  taggedRunners = []) => {
  console.log("Creating run for profile: ", profileId);
  const Run = Parse.Object.extend("Runs");
  const run = new Run();

  run.set("distance", distance);
  run.set("time", time);
  run.set("pace", pace);
  run.set("location", location);

  // connect run to profile
  const Profile = Parse.Object.extend("Profile");
  const profilePointer = Profile.createWithoutData(profileId);
  run.set("ProfilePointer", profilePointer);

  // Set tagged runners as array of Profile pointers
  if (taggedRunners && taggedRunners.length > 0) {
    const taggedPointers = taggedRunners.map((runnerId) => {
      return Profile.createWithoutData(runnerId);
    });
    run.set("taggedRunners", taggedPointers);
  } else {
    run.set("taggedRunners", []);
  }

  return run.save().then((result) => {
    // returns new run object
    return result;
  });
};

// READ get run by id
export const getRunById = (id) => {
  const Run = Parse.Object.extend("Runs");
  const query = new Parse.Query(Run);
  query.include("taggedRunners"); // Include tagged runners in query
  return query.get(id).then((result) => {
    // return Run object with objectId: id
    return result;
  });
};

// cache as done in class
export let Runs = {};
Runs.byProfile = {};

// READ get all runs for a specific profile
export const getRunsByProfileId = (profileId) => {
  const Run = Parse.Object.extend("Runs");
  const Profile = Parse.Object.extend("Profile");

  const query = new Parse.Query(Run);
  const profilePointer = Profile.createWithoutData(profileId);
  console.log("Fetching runs for profileId:", profileId);
  query.equalTo("ProfilePointer", profilePointer);
  query.include("taggedRunners"); // Include tagged runners in query
  query.descending("createdAt"); // Most recent first

  return query
    .find()
    .then((results) => {
      console.log("runs for profile: ", results);
      // use cache
      Runs.byProfile[profileId] = results;
      // returns array of run objects
      return results;
    })
    .catch((error) => {
      console.log("error: ", error);
      return [];
    });
};

// UPDATE run by ID
export const updateRun = (id, updates) => {
  const Run = Parse.Object.extend("Runs");
  const query = new Parse.Query(Run);
  return query.get(id).then((run) => {
    // Update fields if provided
    if (updates.distance) run.set("distance", updates.distance);
    if (updates.time) run.set("time", updates.time);
    if (updates.pace) run.set("pace", updates.pace);
    if (updates.location) run.set("location", updates.location);

    return run.save();
  });
};

// DELETE run by ID
export const removeRun = (id) => {
  const Run = Parse.Object.extend("Runs");
  const query = new Parse.Query(Run);
  return query.get(id).then((run) => {
    return run.destroy();
  });
};

// Get all runs from multiple profiles (for feed)
export const getRunsByProfileIds = (profileIds) => {
  if (!profileIds || profileIds.length === 0) {
    return Promise.resolve([]);
  }

  const Run = Parse.Object.extend("Runs");
  const Profile = Parse.Object.extend("Profile");

  const query = new Parse.Query(Run);
  
  // Create profile pointers for all followed profiles
  const profilePointers = profileIds.map((profileId) => {
    return Profile.createWithoutData(profileId);
  });
  
  // Query runs where ProfilePointer is in the array of followed profiles
  query.containedIn("ProfilePointer", profilePointers);
  query.include("taggedRunners"); // Include tagged runners in query
  query.include("ProfilePointer"); // Include profile info
  query.descending("createdAt"); // Most recent first

  return query
    .find()
    .then((results) => {
      console.log("runs from followed profiles: ", results);
      return results;
    })
    .catch((error) => {
      console.log("error fetching runs from followed profiles: ", error);
      return [];
    });
};
