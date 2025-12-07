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
    <footer className="fixed top-4 right-4 z-50">
      <nav className="bg-white rounded-full shadow-sm border border-gray-200 px-4 py-2">
        <ul className="flex gap-3 items-center">
          <li>
            <Link 
              to="/" 
              className="text-sm text-gray-700 hover:text-gray-900 transition-colors font-medium"
            >
              Home
            </Link>
          </li>

          <li>
            <Link 
              to="/users" 
              className="text-sm text-gray-700 hover:text-gray-900 transition-colors font-medium"
            >
              Users
            </Link>
          </li>

          <li>
            <Link 
              to="/about" 
              className="text-sm text-gray-700 hover:text-gray-900 transition-colors font-medium"
            >
              About
            </Link>
          </li>

          {currentUser && profileId && (
            <li>
              <Link 
                to={`/profile/${profileId}`} 
                className="text-sm text-gray-700 hover:text-gray-900 transition-colors font-medium"
              >
                My Profile
              </Link>
            </li>
          )}
        </ul>
      </nav>
    </footer>
  );
};

export default Footer;