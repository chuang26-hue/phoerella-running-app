import React, { useEffect, useState } from "react";
import { createUser } from "./AuthService.js";
import AuthForm from "./AuthForm.js";
import { useNavigate } from "react-router-dom";
import Parse from "parse";

const AuthRegister = () => {
  const [newUser, setNewUser] = useState({
    firstName: "",
    lastName: "",
    username: "",
    email: "",
    password: "",
  });

  const [add, setAdd] = useState(false);
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
    if (newUser && add) {
      createUser(newUser).then(async (userCreated) => {
        if (userCreated) {
          alert(
            `${userCreated.get("firstName")}, you successfully registered!`
          );
          
          // Get their profile objectId and redirect (same as login)
          const profileId = await getProfileIdFromUser(userCreated);
          if (profileId) {
            navigate(`/profile/${profileId}`);
          } else {
            navigate("/"); // No profile found, go to home
          }
        }
        setAdd(false);
      });
    }
  }, [newUser, add, navigate]);

  const onChangeHandler = (e) => {
    const { name, value } = e.target;
    setNewUser((prev) => ({ ...prev, [name]: value }));
  };

  const onSubmitHandler = (e) => {
    e.preventDefault();
    setAdd(true);
  };

  return (
    <div style={{ textAlign: "center", marginTop: "50px" }}>
      <AuthForm
        user={newUser}
        onChange={onChangeHandler}
        onSubmit={onSubmitHandler}
        submitText="Register"
        isRegister={true}
        linkText="Already have an account? Login here"
        linkPath="/login"
      />
    </div>
  );
};

export default AuthRegister;