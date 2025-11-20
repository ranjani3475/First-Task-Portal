import React, { useEffect, useState } from "react";
import { Pie } from "react-chartjs-2";
import {
  Chart as ChartJS,
  ArcElement,
  Tooltip,
  Legend,
} from "chart.js";
import CryptoJS from "crypto-js";

ChartJS.register(ArcElement, Tooltip, Legend);

const Analytics = () => {
  const [completed, setCompleted] = useState(0);
  const [nonCompleted, setNonCompleted] = useState(0);
  const [userInfo, setUserInfo] = useState(null);
  const [selectedDate, setSelectedDate] = useState(""); // ⭐ Added date state
  const [errorMessage, setErrorMessage] = useState("");

  // ⭐ Convert DD-MM-YYYY → YYYY-MM-DD (Fixes 400 error)
  const convertDateFormat = (dateStr) => {
    if (!dateStr) return "";
    const [day, month, year] = dateStr.split("-");
    return `${year}-${month}-${day}`;
  };

  // Load user info from encrypted token
  useEffect(() => {
    try {
      const encryptedToken = localStorage.getItem("accessToken");
      if (encryptedToken) {
        const bytes = CryptoJS.AES.decrypt(
          encryptedToken,
          "abcdefghijklmnopqrstuvwxyz1234567890"
        );
        const decryptedToken = bytes.toString(CryptoJS.enc.Utf8);
        setUserInfo(JSON.parse(decryptedToken));
      }
    } catch (error) {
      console.error("Error decrypting token:", error);
    }
  }, []);

  // Fetch analytics only after userInfo or date changes
  useEffect(() => {
    if (!userInfo || !selectedDate) return;

    const fetchTaskStats = async () => {
      try {
        const formattedDate = convertDateFormat(selectedDate);

const url = `http://localhost:5000/api/v1/task/list?fromDate=${formattedDate}&toDate=${formattedDate}&limit=9999&offset=0&userId=${userInfo.user_id}&roll=${userInfo.roll_name}`;

        const response = await fetch(url);

        if (!response.ok) {
          setErrorMessage("API responded with " + response.status);
          return;
        }

        const data = await response.json();

        if (data?.data?.result) {
          const tasks = data.data.result;

          const completedCount = tasks.filter(
            (task) => task.status === "Completed"
          ).length;

          const nonCompletedCount = tasks.filter(
            (task) => task.status !== "Completed"
          ).length;

          setCompleted(completedCount);
          setNonCompleted(nonCompletedCount);
        }
      } catch (error) {
        setErrorMessage("Network error occurred.");
        console.error("Error fetching analytics:", error);
      }
    };

    fetchTaskStats();
  }, [userInfo, selectedDate]); // ⭐ Added selectedDate here

  // Chart Data
  const chartData = {
    labels: ["Completed", "Not Completed"],
    datasets: [
      {
        label: "Task Distribution",
        data: [completed, nonCompleted],
        backgroundColor: ["#4CAF50", "#FF5252"],
        borderColor: ["#2e7d32", "#c62828"],
        borderWidth: 1,
      },
    ],
  };

  return (
    <div style={{ width: "50%", margin: "80px auto", textAlign: "center" }}>
      <h2>Task Analytics Dashboard</h2>

      {/* ⭐ DATE INPUT ADDED */}
      <input
        type="text"
        placeholder="DD-MM-YYYY"
        value={selectedDate}
        onChange={(e) => setSelectedDate(e.target.value)}
        style={{
          padding: "10px",
          width: "250px",
          marginBottom: "20px",
          borderRadius: "5px",
          border: "1px solid #999",
          fontSize: "16px"
        }}
      />

      {/* ⭐ Show Error Message */}
      {errorMessage && (
        <p style={{ color: "red", marginTop: "10px" }}>
          Error: {errorMessage}<br />
          Check console & network tab.
        </p>
      )}

      <Pie data={chartData} />
    </div>
  );
};

export default Analytics;
