import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import Parse from "parse";

const ResetPassword = () => {
  const [email, setEmail] = useState("");
  const navigate = useNavigate();

  const sendReset = async () => {
    try {
      await Parse.User.requestPasswordReset(email);
      alert("Password reset email sent! Check your inbox.");
      navigate("/login"); // Redirect to login page
    } catch (err) {
      alert(err.message);
    }
  };

  return (
    <div style={{ maxWidth: "400px", margin: "0 auto", padding: "1rem" }}>
      <h2>Reset Password</h2>

      <input
        type="email"
        placeholder="Enter your email"
        value={email}
        onChange={(e) => setEmail(e.target.value)}
        style={{ width: "100%", padding: "10px", marginTop: "1rem" }}
      />

      <button
        onClick={sendReset}
        style={{
          marginTop: "1rem",
          padding: "10px 20px",
          cursor: "pointer",
          backgroundColor: "#007bff",
          color: "white",
          border: "none",
          borderRadius: "5px",
          width: "100%",
        }}
      >
        Send Reset Link
      </button>
    </div>
  );
};

export default ResetPassword;
