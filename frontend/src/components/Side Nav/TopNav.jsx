import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import isAuthenticate from "../../components/auth";
import CryptoJS from "crypto-js";

const TopNav = () => {
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

  if (!userInfo) return null; // Optionally return a loading state while fetching userInfo

  return (
    <div style={styles.topNav}>
      <div style={styles.userInfo}>
        <span>{userInfo.username}</span> |{" "}
        <span style={styles.highlight}>{userInfo.roll_name.toUpperCase()}</span>
      </div>
    </div>
  );
};

const styles = {
  topNav: {
    display: "flex",
    justifyContent: "flex-end", // Aligns the content to the right
    padding: "1rem",
    width: "100%", // Ensures the topNav takes up the full width
  },
  userInfo: {
    fontSize: "16px",
    fontWeight: "500",
  },
  highlight: {
    backgroundColor: "#90ee90", // Light green background
    padding: "0.2rem 0.5rem", // Padding around the text
    borderRadius: "4px", // Optional rounded corners
  },
};

export default TopNav;
