import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { loginUser } from "./AuthService.js";
import AuthForm from "./AuthForm.js";

const AuthLogin = () => {
  const [userCredentials, setUserCredentials] = useState({
    email: "",
    password: "",
  });
  const [attemptLogin, setAttemptLogin] = useState(false);

  const navigate = useNavigate(); // ✅ for routing after login

  useEffect(() => {
    if (attemptLogin) {
      loginUser(userCredentials).then((loggedInUser) => {
        if (loggedInUser) {
          alert(`Welcome back, ${loggedInUser.get("firstName")}!`);
          navigate("/user"); // ✅ go to protected route
        } else {
          alert("Invalid email or password. Please try again.");
        }
        setAttemptLogin(false);
      });
    }
  }, [attemptLogin, userCredentials, navigate]);

  const onChangeHandler = (e) => {
    const { name, value } = e.target;
    setUserCredentials((prev) => ({ ...prev, [name]: value }));
  };

  const onSubmitHandler = (e) => {
    e.preventDefault();
    setAttemptLogin(true);
  };

  return (
    <AuthForm
      user={userCredentials}
      onChange={onChangeHandler}
      onSubmit={onSubmitHandler}
      submitText="Login"
      showNameFields={false}
    />
  );
};

export default AuthLogin;
