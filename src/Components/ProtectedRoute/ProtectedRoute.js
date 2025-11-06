import React from "react";
import { useNavigate } from "react-router-dom";
import { checkUser } from "../Auth/AuthService";

const ProtectedRoute = ({ element: Component, ...rest }) => {
  //console.log("element: ", Component);
  const navigate = useNavigate();

  if (checkUser()) {
    return <Component {...rest} />;
  } else {
    return (
      <div style={{ textAlign: "center", marginTop: "50px" }}>
        <h2>Unauthorized!</h2>
        <p>Login or sign up to view others runners' profiles</p>
        <button
          style={{
            margin: "10px",
            padding: "10px 20px",
            cursor: "pointer",
            backgroundColor: "#007bff",
            color: "white",
            border: "none",
            borderRadius: "5px",
          }}
          onClick={() => navigate("/login")}
        >
          Login
        </button>
        <button
          style={{
            margin: "10px",
            padding: "10px 20px",
            cursor: "pointer",
            backgroundColor: "#28a745",
            color: "white",
            border: "none",
            borderRadius: "5px",
          }}
          onClick={() => navigate("/register")}
        >
          Register
        </button>
      </div>
    );
  }
};

export default ProtectedRoute;