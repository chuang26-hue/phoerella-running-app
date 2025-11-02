import Parse from "parse";

export const createUser = (newUser) => {
  const user = new Parse.User();

  user.set("username", newUser.email);
  user.set("firstName", newUser.firstName);
  user.set("lastName", newUser.lastName);
  user.set("email", newUser.email);
  user.set("password", newUser.password);

  return user
    .signUp()
    .then((newUserSaved) => {
      return createProfileForUser(newUserSaved, newUser);
    })
    .catch((error) => {
      alert(`Error: ${error.message}`);
    });
};

const createProfileForUser = (user, userData) => {
  const Profile = Parse.Object.extend("Profile");
  const profile = new Profile();

  profile.set("username", `${userData.email}`);
  profile.set("name", `${userData.firstName} ${userData.lastName}`);
  profile.set("user", user); // pointer to User object

  return profile
    .save()
    .then((savedProfile) => {
      console.log("Profile created successfully:", savedProfile.id);
      return user; // return user so the rest of the flow works
    })
    .catch((error) => {
      console.error("Profile creation error:", error);
      alert(`Profile creation failed: ${error.message}`);
      return user; // still return user even if profile fails
    });
};

export const loginUser = (userCredentials) => {
  const { email, password } = userCredentials;

  return Parse.User.logIn(email, password)
    .then((loggedInUser) => {
      console.log("User logged in successfully:", loggedInUser);
      return loggedInUser;
    })
    .catch((error) => {
      alert(`Login failed: ${error.message}`);
      return null;
    });
};
