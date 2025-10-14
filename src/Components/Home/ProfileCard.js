// src/Components/Home/ProfileCard.js
import React from "react";
import { useNavigate } from "react-router-dom";

export default function ProfileCard({ profile }) {
  const navigate = useNavigate();

  const handleClick = () => {
    navigate(`/profile/${profile.id}`);
  };

  const name = profile.get("name");
  const username = profile.get("username");
  const email = profile.get("email");
  const profilePictureFile = profile.get("profilePicture");
  const profilePictureUrl = profilePictureFile
    ? profilePictureFile.url()
    : null;

  return (
    <div
      onClick={handleClick}
      style={{
        border: "1px solid #ddd",
        borderRadius: "12px",
        padding: "1rem",
        margin: "1rem",
        textAlign: "center",
        width: "200px",
        cursor: "pointer",
        transition: "transform 0.2s",
      }}
    >
      {profilePictureUrl && (
        <img
          src={profilePictureUrl}
          alt={`${name}'s profile`}
          style={{
            width: "100px",
            height: "100px",
            borderRadius: "50%",
            objectFit: "cover",
          }}
        />
      )}
      <h3>{name}</h3>
      <p>@{username}</p>
      <p>{email}</p>
    </div>
  );
}
