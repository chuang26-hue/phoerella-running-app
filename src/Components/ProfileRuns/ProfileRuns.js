// src/Components/ProfileRuns/ProfileRuns.js
import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { getRunsByProfileId } from "../../Common/Services/RunService";
import { getProfileById } from "../../Common/Services/ProfileService";
import RunCard from "./RunCard";
import AddRunForm from "./AddRunForm"

export default function ProfileRuns() {
  const { userId } = useParams();
  const [profile, setProfile] = useState(null);
  const [userRuns, setUserRuns] = useState([]);

  const fetchRuns = async () => {
    if (!userId) return;
    const runs = await getRunsByProfileId(userId);
    setUserRuns(runs || []);
  };

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
    {/* Profile header: picture + name side by side */}
    <div
      style={{
        display: "flex",
        alignItems: "center",
        gap: "1rem", // space between image and text
        marginBottom: "1rem",
      }}
    >
      {profile.get("profilePicture") && (
        <img
          src={profile.get("profilePicture").url()}
          alt={`${profile.get("name")}'s profile`}
          style={{
            width: "80px",
            height: "80px",
            borderRadius: "50%",
            objectFit: "cover",
          }}
        />
      )}
      <h1 style={{ margin: 0 }}>{profile.get("name")}'s Runs</h1>
    </div>

    <p>@{profile.get("username")}</p>

    <AddRunForm profileId={userId} onAdded={fetchRuns} />

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
