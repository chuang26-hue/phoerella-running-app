// src/Components/ProfileRuns/ProfileRuns.js
import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { getRunsByProfileId } from "../../Common/Services/RunService";
import { getProfileById } from "../../Common/Services/ProfileService";
import RunCard from "./RunCard";

export default function ProfileRuns() {
  const { userId } = useParams();
  const [profile, setProfile] = useState(null);
  const [userRuns, setUserRuns] = useState([]);

  useEffect(() => {
    if (userId) {
      getProfileById(userId).then(setProfile);
      getRunsByProfileId(userId).then(setUserRuns);
    }
  }, [userId]);

  return (
    <section style={{ padding: "2rem" }}>
      {profile ? (
        <>
          <h1>{profile.get("name")}'s Runs</h1>
          <p>@{profile.get("username")}</p>

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
