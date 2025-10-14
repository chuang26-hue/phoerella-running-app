import React, { useState, useEffect } from "react";
import { getAllProfiles } from "../../Common/Services/ProfileService";
import { getRunsByProfileId } from "../../Common/Services/RunService";
import Components from "../Components";

const Main = () => {
  const [profiles, setProfiles] = useState([]);
  const [runs, setRuns] = useState([]);

  // Fetch all profiles
  useEffect(() => {
    getAllProfiles().then((results) => {
      console.log("Fetched profiles:", results);
      setProfiles(results); // parse objects
    });
  }, []);

  // Function to fetch runs for a specific profile
  const fetchRunsForProfile = (profileId) => {
    getRunsByProfileId(profileId).then((results) => {
      console.log("Fetched runs:", results);
      setRuns(results); // parse objects
    });
  };

  return (
    <Components
      profiles={profiles}
      runs={runs}
      onSelectProfile={fetchRunsForProfile}
    />
  );
};

export default Main;
