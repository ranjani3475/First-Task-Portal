import React, { useEffect, useState } from "react";
import isAuthenticate from "../components/auth";
import { useNavigate } from "react-router-dom";
import CryptoJS from "crypto-js";

const Dashboard = () => {
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

  return <div>Hello</div>;
};

export default Dashboard;
