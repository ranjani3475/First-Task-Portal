import React, { useEffect, useState } from "react";
import CryptoJS from "crypto-js";
import { useNavigate } from "react-router-dom";
import isAuthenticate from "../components/auth";
import { FaUserCircle } from "react-icons/fa"; // React icon for avatar
import "./Profile.css";

const Profile = () => {
  const navigate = useNavigate();
  const [userInfo, setUserInfo] = useState(null);

  useEffect(() => {
    const checkAuthentication = () => {
      const access = isAuthenticate();
      if (!access) {
        navigate("/"); // Redirect to login if not authenticated
      } else {
        try {
          // Retrieve and decrypt the token
          const encryptedToken = localStorage.getItem("accessToken");
          if (encryptedToken) {
            const bytes = CryptoJS.AES.decrypt(
              encryptedToken,
              "abcdefghijklmnopqrstuvwxyz1234567890"
            );
            const decryptedToken = bytes.toString(CryptoJS.enc.Utf8);

            // Parse and set user information
            setUserInfo(JSON.parse(decryptedToken));
          }
        } catch (error) {
          console.error("Error decrypting token:", error);
          navigate("/"); // Redirect if decryption fails
        }
      }
    };

    // Fetch user info each time the component mounts (on page refresh as well)
    checkAuthentication();
  }, [navigate]);

  if (!userInfo) return <div>Loading...</div>; // Loading state while fetching userInfo

  return (
    <div className="profile-container">
      <div className="profile-card">
        <div className="avatar-container">
          <FaUserCircle className="avatar" /> {/* React icon as avatar */}
        </div>
        <div className="user-info">
          <h2 className="username">{userInfo.username}</h2>
          <p className="text">Department: {userInfo.department_code}</p>
          <p className="text">Role: {userInfo.roll_name.toUpperCase()}</p>
        </div>
      </div>
    </div>
  );
};

export default Profile;
