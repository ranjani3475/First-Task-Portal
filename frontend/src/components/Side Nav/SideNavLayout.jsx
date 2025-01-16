import React, { useEffect, useState } from "react";
import isAuthenticate from "../../components/auth";
import { Outlet, useNavigate } from "react-router-dom";
import CryptoJS from "crypto-js";
import SideNav from "./SideNav";
import TopNav from "./TopNav";
import "./SideNav.css";

const SideNavLayout = () => {
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

  console.log(userInfo);
  return (
    <div>
      <div className="top-nav">
        <TopNav />
      </div>
      <div className="side-nav">
        <SideNav />
      </div>
      <div className="content">
        <Outlet />
      </div>
    </div>
  );
};

export default SideNavLayout;
