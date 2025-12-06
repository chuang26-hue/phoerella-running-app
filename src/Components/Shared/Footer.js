import { Link, useLocation } from "react-router-dom";
import React, { useState, useEffect } from "react";
import Parse from "parse";

const Footer = () => {
  const [currentUser, setCurrentUser] = useState(null);
  const [profileId, setProfileId] = useState(null);
  const location = useLocation();

  const checkUserAndProfile = () => {
    const user = Parse.User.current();
    setCurrentUser(user);

    if (user) {
      // Get current user's profile ID
      const Profile = Parse.Object.extend("Profile");
      const query = new Parse.Query(Profile);
      query.equalTo("user", user);
      
      query.first().then((profile) => {
        if (profile) {
          setProfileId(profile.id);
        } else {
          setProfileId(null);
        }
      }).catch((error) => {
        console.error("Error fetching profile:", error);
        setProfileId(null);
      });
    } else {
      setProfileId(null);
    }
  };

  // Check user when component mounts
  useEffect(() => {
    checkUserAndProfile();
  }, []);

  // Re-check user when route changes (handles login/logout navigation)
  useEffect(() => {
    checkUserAndProfile();
  }, [location.pathname]);

  // Re-check user when window regains focus (catches login/logout in same session)
  useEffect(() => {
    const handleFocus = () => {
      checkUserAndProfile();
    };

    window.addEventListener('focus', handleFocus);
    return () => {
      window.removeEventListener('focus', handleFocus);
    };
  }, []);

  return (
    <footer>
      <nav>
        <ul>
          <li>
            <Link to="/"> Home </Link>
          </li>

          <li>
            <Link to="/users"> Users </Link>
          </li>

          <li>
            <Link to="/about"> About </Link>
          </li>

          {currentUser && profileId && (
            <li>
              <Link to={`/profile/${profileId}`}> My Profile </Link>
            </li>
          )}
        </ul>
      </nav>
    </footer>
  );
};

export default Footer;
