import  { useEffect } from "react";
import { useNavigate } from "react-router-dom";

const Logout = () => {
  const navigate = useNavigate();

  useEffect(() => {
    // Remove the access token from localStorage
    localStorage.removeItem("accessToken");

    // Redirect to the login page
    navigate("/");
  }, [navigate]);

  return null; // No UI needed for logout
};

export default Logout;
