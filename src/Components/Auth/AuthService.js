import Parse from "parse";

export const createUser = (newUser) => {
  const user = new Parse.User();

  user.set("username", newUser.email);
  user.set("firstName", newUser.firstName);
  user.set("lastName", newUser.lastName);
  user.set("email", newUser.email);
  user.set("username", newUser.username);
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

  profile.set("username", `${userData.username}`);
  profile.set("email", `${userData.email}`);
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
  const { username, password } = userCredentials;

  return Parse.User.logIn(username, password)
    .then((loggedInUser) => {
      console.log("User logged in successfully:", loggedInUser);
      return loggedInUser;
    })
    .catch((error) => {
      alert(`Login failed: ${error.message}`);
      return null;
    });
};

export const checkUser = () => {
  return Parse.User.current()?.authenticated;
};

export const logoutUser = () => {
  return Parse.User.logOut()
    .then(() => {
      console.log("User logged out successfully");
      return true;
    })
    .catch((error) => {
      console.error("Logout error:", error);
      alert(`Logout failed: ${error.message}`);
      return false;
    });
};