import React, { useEffect, useState } from "react";
import { checkUser, createUser } from "./AuthService.js";
import AuthForm from "./AuthForm.js";
import { useNavigate } from "react-router-dom";

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

  useEffect(() => {
    if (checkUser()) {
      alert("You are already logged in");
      navigate("/");
    }
  }, [navigate]);

  useEffect(() => {
    if (newUser && add) {
      createUser(newUser).then((userCreated) => {
        if (userCreated) {
          alert(
            `${userCreated.get("firstName")}, you successfully registered!`
          );
          // User is automatically logged in after signup
          // Navigate them directly to the home page or dashboard
          navigate("/");
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