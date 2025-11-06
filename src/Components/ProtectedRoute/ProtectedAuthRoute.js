import React, { useRef } from "react";
import { Navigate } from "react-router-dom";
import { checkUser } from "../Auth/AuthService";

const ProtectedAuthRoute = ({ element: Component, ...rest }) => {
  const hasAlerted = useRef(false);

  if (checkUser()) {
    // Only alert once
    if (!hasAlerted.current) {
      hasAlerted.current = true;
      alert("You are already logged in");
    }
    return <Navigate to="/" replace />;
  }

  return <Component {...rest} />;
};

export default ProtectedAuthRoute;