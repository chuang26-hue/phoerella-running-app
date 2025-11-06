import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { loginUser } from "./AuthService.js";
import AuthForm from "./AuthForm.js";
import Parse from "parse";

const AuthLogin = () => {
  const [userCredentials, setUserCredentials] = useState({
    username: "",
    password: "",
  });
  const [attemptLogin, setAttemptLogin] = useState(false);

  const navigate = useNavigate();

  // Helper function to get profile ID from user
  const getProfileIdFromUser = async (user) => {
    const Profile = Parse.Object.extend("Profile");
    const query = new Parse.Query(Profile);
    query.equalTo("user", user);
    const profile = await query.first();
    return profile ? profile.id : null;
  };

  useEffect(() => {
    if (attemptLogin) {
      loginUser(userCredentials).then((loggedInUser) => {
        if (loggedInUser) {
          alert(`Welcome back, ${loggedInUser.get("firstName")}!`);
          // Get their profile objectId and redirect
          getProfileIdFromUser(loggedInUser).then((profileId) => {
            if (profileId) {
              navigate(`/profile/${profileId}`);
            } else {
              navigate("/"); // No profile found, go to home
            }
          });
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