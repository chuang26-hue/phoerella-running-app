import React from "react";
import { useNavigate } from "react-router-dom";
import { logoutUser } from "./AuthService.js";

const AuthLogout = () => {
  const navigate = useNavigate();

  const handleLogout = () => {
    logoutUser().then((success) => {
      if (success) {
        alert("You have been logged out successfully!");
        navigate("/"); // Redirect to home page
      }
    });
  };

  return (
    <button
      onClick={handleLogout}
      style={{
        padding: "10px 20px",
        cursor: "pointer",
        backgroundColor: "#dc3545",
        color: "white",
        border: "none",
        borderRadius: "5px",
      }}
    >
      Logout
    </button>
  );
};

export default AuthLogout;