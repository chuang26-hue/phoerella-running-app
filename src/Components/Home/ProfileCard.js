// src/Components/Home/ProfileCard.js
import React from "react";
import { useNavigate } from "react-router-dom";

export default function ProfileCard({ profile }) {
  const navigate = useNavigate();

  // Guard: ensure profile is a valid Parse object
  if (!profile || typeof profile.get !== 'function') {
    return null;
  }

  const handleClick = () => {
    navigate(`/profile/${profile.id}`);
  };

  const name = profile.get("name");
  const username = profile.get("username");
  const email = profile.get("email");
  const profilePictureFile = profile.get("profilePicture");
  
  // Safely get profile picture URL
  // profilePictureFile could be: null, a Parse File object, or a string URL
  let profilePictureUrl = null;
  if (profilePictureFile) {
    if (typeof profilePictureFile === 'string') {
      // Already a URL string
      profilePictureUrl = profilePictureFile;
    } else if (typeof profilePictureFile.url === 'function') {
      // Parse File object
      profilePictureUrl = profilePictureFile.url();
    }
  }

  return (
    <div
      onClick={handleClick}
      style={{
        border: "1px solid #ddd",
        borderRadius: "12px",
        padding: "1rem",
        textAlign: "center",
        width: "100%", // Changed from "200px" to take full grid cell width
        cursor: "pointer",
        transition: "transform 0.2s",
      }}
      onMouseEnter={(e) => (e.currentTarget.style.transform = "scale(1.05)")}
      onMouseLeave={(e) => (e.currentTarget.style.transform = "scale(1)")}
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
