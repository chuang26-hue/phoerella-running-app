import React, { useEffect, useState } from "react";
import { createUser } from "./AuthService.js";
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
  const [registered, setRegistered] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    if (newUser && add) {
      createUser(newUser).then((userCreated) => {
        if (userCreated) {
          alert(
            `${userCreated.get("firstName")}, you successfully registered!`
          );
          setRegistered(true);
        }
        setAdd(false);
      });
    }
  }, [newUser, add]);

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
      {!registered ? (
        <AuthForm
          user={newUser}
          onChange={onChangeHandler}
          onSubmit={onSubmitHandler}
          submitText="Register"
          isRegister={true}
          linkText="Already have an account? Login here"
          linkPath="/login"
        />
      ) : (
        <div>
          <p>Registration successful! Please log in.</p>
          <button
            style={{ padding: "10px 20px" }}
            onClick={() => navigate("/login")}
          >
            Go to Login
          </button>
        </div>
      )}
    </div>
  );
};

export default AuthRegister;