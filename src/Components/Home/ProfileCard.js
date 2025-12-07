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
      className="border border-gray-300 rounded-xl p-4 text-center w-48 cursor-pointer transition-transform duration-200 hover:scale-105"
    >
      {profilePictureUrl && (
        <img
          src={profilePictureUrl}
          alt={`${name}'s profile`}
          className="w-24 h-24 rounded-full object-cover mx-auto mb-3"
        />
      )}
      <h3 className="text-base font-bold mb-1 truncate">{name}</h3>
      <p className="text-gray-600 text-sm mb-1 truncate">@{username}</p>
      <p className="text-gray-500 text-sm truncate">{email}</p>
    </div>
  );
}