import React, { useEffect, useState } from "react";
import isAuthenticate from "../../components/auth";
import { useNavigate } from "react-router-dom";
import CryptoJS from "crypto-js";
import { Link } from "react-router-dom"; // For navigation
import {
  FaUserCircle,
  FaPlusSquare,
  FaListAlt,
  FaChartLine,
  FaSignOutAlt,
} from "react-icons/fa"; // Importing React-Bootstrap icons

const styles = {
  sideNav: {
    height: "90%", // Adjusted for layout below TopNav
    width: "15%", // Fixed width
    position: "fixed",
    top: "10%", // Starts below the TopNav
    left: "0",
    backgroundColor: "#f8f9fa", // Light gray background
    borderRight: "1px solid #ccc",
    display: "flex",
    flexDirection: "column", // Vertical stack
    justifyContent: "space-between", // Items and logout aligned
    padding: "1rem",
    boxShadow: "2px 0 5px rgba(0, 0, 0, 0.1)",
  },
  menu: {
    display: "flex",
    flexDirection: "column",
    gap: "1rem",
  },
  menuItem: {
    textDecoration: "none",
    color: "#000",
    fontSize: "18px",
    fontWeight: "500",
    display: "flex",
    alignItems: "center",
    gap: "0.5rem", // Space between icon and text
    padding: "0.5rem", // Add padding to make the background area larger
    borderRadius: "4px", // Rounded corners for the background
    transition: "background-color 0.3s ease", // Smooth background color transition
  },
  logout: {
    textDecoration: "none",
    color: "red",
    fontSize: "16px",
    fontWeight: "600",
    display: "flex",
    alignItems: "center",
    gap: "0.5rem",
  },
};

const SideNav = () => {
  const navigate = useNavigate();
  const [userInfo, setUserInfo] = useState(null);
  useEffect(() => {
    const checkAuthentication = () => {
      const access = isAuthenticate();
      if (!access) {
        navigate("/");
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
    checkAuthentication();
  }, [navigate]);
  const isHod = userInfo?.roll_name === "hod"; // Ensure the condition is safe
  return (
    <div style={styles.sideNav}>
      <div style={styles.menu}>
        <Link to="/dashboard/profile" style={styles.menuItem}>
          <FaUserCircle /> Profile Page
        </Link>

        {/* Conditionally render the 'Create Task' link only for HOD */}
        {isHod && (
          <Link to="/dashboard/create-task" style={styles.menuItem}>
            <FaPlusSquare /> Create Task
          </Link>
        )}

        <Link to="/dashboard/view-task" style={styles.menuItem}>
          <FaListAlt /> View Task
        </Link>
        <Link to="/dashboard/analytics" style={styles.menuItem}>
          <FaChartLine /> Analytics
        </Link>
      </div>
      <Link to="/logout" style={styles.logout}>
        <FaSignOutAlt /> Logout
      </Link>
    </div>
  );
};

// CSS for hover effect
document.styleSheets[0].insertRule(
  `
  .menu-item:hover {
    background-color: #d4f8e2; /* Light green background on hover */
  }`,
  document.styleSheets[0].cssRules.length
);

export default SideNav;
