import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { loginUser } from "./AuthService.js";
import AuthForm from "./AuthForm.js";

const AuthLogin = () => {
  const [userCredentials, setUserCredentials] = useState({
    username: "",
    password: "",
  });
  const [attemptLogin, setAttemptLogin] = useState(false);

  const navigate = useNavigate();

  useEffect(() => {
    if (attemptLogin) {
      loginUser(userCredentials).then((loggedInUser) => {
        if (loggedInUser) {
          alert(`Welcome back, ${loggedInUser.get("firstName")}!`);
          navigate("/user");
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
      isRegister={false}
      linkText="Don't have an account? Register here"
      linkPath="/register"
    />
  );
};

export default AuthLogin;