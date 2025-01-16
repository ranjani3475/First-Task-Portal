import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import AlertMessage from "../components/AlertMessage";
import "./login.css";
import logo from "../assets/logo.png";
import CryptoJS from "crypto-js";
import { ClipLoader } from "react-spinners";

const Login = () => {
  const navigate = useNavigate();

  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [showAlert, setShowAlert] = useState(false);
  const [alertMessage, setAlertMessage] = useState("");
  const [loading, setLoading] = useState(false);

  const handleLogin = async (e) => {
    e.preventDefault();

    setLoading(true);

    const loginData = { userName: username, password: password };

    try {
      const response = await fetch("http://localhost:5000/api/v1/user/signin", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(loginData),
      });

      setLoading(false);

      if (response.ok) {
        const data = await response.json();

        const accessToken = JSON.stringify(data.data.result);

        const encryptedToken = CryptoJS.AES.encrypt(
          accessToken,
          "abcdefghijklmnopqrstuvwxyz1234567890"
        ).toString();

        localStorage.setItem("accessToken", encryptedToken);

        navigate("/dashboard/");
      } else {
        setAlertMessage("Invalid username or password");
        setShowAlert(true);
      }
    } catch (error) {
      setLoading(false);
      setAlertMessage("Something went wrong. Please try again.");
      setShowAlert(true);
    }
  };

  return (
    <div className="login-body">
      <div className="login-container">
        {loading ? (
          <div className="loading-screen">
            <ClipLoader color="#2771b2" loading={loading} size={100} />
          </div>
        ) : (
          <>
            <h3>BIT TASK PORTAL</h3>
            <img src={logo} alt="BIT Logo" className="logo" />

            <form className="login-form" onSubmit={handleLogin}>
              <div className="input-group">
                <label>Username</label>
                <input
                  type="text"
                  placeholder="Enter your username"
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                />
              </div>
              <div className="input-group">
                <label>Password</label>
                <input
                  type="password"
                  placeholder="Enter your password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                />
              </div>
              <button type="submit" className="login-button" disabled={loading}>
                {loading ? "Logging In..." : "Login"}
              </button>
            </form>

            <AlertMessage
              show={showAlert}
              onClose={() => setShowAlert(false)}
              message={alertMessage}
              type="danger"
            />
          </>
        )}
      </div>
    </div>
  );
};

export default Login;
