import React, { useState, useEffect, useRef } from "react";
import CryptoJS from "crypto-js"; // Ensure you have crypto-js installed
import { useNavigate } from "react-router-dom";
import isAuthenticate from "../components/auth";
import "./CreateTask.css"; // Import the CSS file

const CreateTask = () => {
  const [userInfo, setUserInfo] = useState(null);
  const [taskName, setTaskName] = useState(""); // Task name state
  const [assignedPerson, setAssignedPerson] = useState("");
  const [start, setStart] = useState("");
  const [end, setEnd] = useState("");
  const [description, setDescription] = useState("");
  const [users, setUsers] = useState([]);
  const [errors, setErrors] = useState({
    taskName: "",
    assignedPerson: "",
    start: "",
    end: "",
    description: "",
  });
  const navigate = useNavigate();
  const hasFetched = useRef(false);

  useEffect(() => {
    const checkAuthentication = () => {
      const access = isAuthenticate(); // Check if the user is authenticated
      if (!access) {
        navigate("/"); // Redirect to login if not authenticated
      } else {
        try {
          const encryptedToken = localStorage.getItem("accessToken");
          if (encryptedToken) {
            const bytes = CryptoJS.AES.decrypt(
              encryptedToken,
              "abcdefghijklmnopqrstuvwxyz1234567890"
            );
            const decryptedToken = bytes.toString(CryptoJS.enc.Utf8);
            setUserInfo(JSON.parse(decryptedToken)); // Set user info after decryption
          }
        } catch (error) {
          console.error("Error decrypting token:", error);
          navigate("/"); // Redirect if decryption fails
        }
      }
    };

    checkAuthentication();
  }, [navigate]);

  useEffect(() => {
    if (userInfo && !hasFetched.current) {
      hasFetched.current = true; // Set flag to avoid re-fetching

      const hodId = userInfo.user_id; // Extract user ID from userInfo

      const fetchUsers = async () => {
        try {
          const response = await fetch(
            `http://localhost:5000/api/v1/user/hod/user?userId=${hodId}`
          );
          const data = await response.json();

          if (response.ok) {
            setUsers(data.data.result); // Update users state with the 'result' data
          } else {
            console.error("No users found or server error:", data.message);
          }
        } catch (error) {
          console.error("Error fetching users:", error);
        }
      };

      fetchUsers(); // Call the function to fetch users
    }
  }, [userInfo]); // Only fetch users after userInfo is available

  const validate = () => {
    let valid = true;
    let errorMessages = {};

    if (!taskName) {
      errorMessages.taskName = "Task Name is required";
      valid = false;
    }
    if (!assignedPerson) {
      errorMessages.assignedPerson = "Staff is required";
      valid = false;
    }
    if (!start) {
      errorMessages.start = "Start date is required";
      valid = false;
    }
    if (!end) {
      errorMessages.end = "End date is required";
      valid = false;
    } else if (new Date(start) > new Date(end)) {
      errorMessages.end =
        "End date must be greater than or equal to the start date";
      valid = false;
    }
    if (!description) {
      errorMessages.description = "Description is required";
      valid = false;
    }
    setErrors(errorMessages);
    return valid;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (validate()) {
      const taskData = {
        hodId: userInfo?.user_id, // Set hodId from userInfo
        taskName, // Include taskName in payload
        assigned_person_id: assignedPerson, // Use assigned_person_id instead of assigned_person
        start,
        end,
        description,
      };

      console.log(taskData, "payload");

      try {
        const response = await fetch(
          "http://localhost:5000/api/v1/task/create",
          {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
            },
            body: JSON.stringify(taskData),
          }
        );

        if (response.ok) {
          alert("Task created successfully!");
          // Reset form fields
          setTaskName(""); // Reset taskName
          setAssignedPerson("");
          setStart("");
          setEnd("");
          setDescription("");
        } else {
          const errorResponse = await response.json();
          alert(`${errorResponse.message || "Unknown error"}`);
        }
      } catch (err) {
        console.error("Error creating task:", err);
        alert("Error creating task");
      }
    }
  };

  return (
    <div className="card-bg">
      <div className="create-task-container">
        <div className="create-task-card">
          <h2 className="create-task-title">Create New Task</h2>
          <form onSubmit={handleSubmit}>
            <div className="mb-3">
              <label htmlFor="task_name" className="form-label">
                Task Name:
              </label>
              <input
                type="text"
                className={`form-control ${errors.taskName ? "is-invalid" : ""}`}
                id="task_name"
                value={taskName}
                onChange={(e) => setTaskName(e.target.value)}
              />
              {errors.taskName && (
                <div className="invalid-feedback">{errors.taskName}</div>
              )}
            </div>

            <div className="mb-3">
              <label htmlFor="assigned_person" className="form-label">
                Select Staff:
              </label>
              <select
                className={`form-select ${
                  errors.assignedPerson ? "is-invalid" : ""
                }`}
                id="assigned_person"
                value={assignedPerson}
                onChange={(e) => setAssignedPerson(e.target.value)}
              >
                <option value="">Select Staff</option>
                {users.map((user) => (
                  <option key={user.user_id} value={user.user_id}>
                    {user.username}
                  </option>
                ))}
              </select>
              {errors.assignedPerson && (
                <div className="invalid-feedback">{errors.assignedPerson}</div>
              )}
            </div>

            <div className="mb-3">
              <label htmlFor="start" className="form-label">
                Start Date:
              </label>
              <input
                type="datetime-local"
                className={`form-control ${errors.start ? "is-invalid" : ""}`}
                id="start"
                value={start}
                onChange={(e) => setStart(e.target.value)}
              />
              {errors.start && (
                <div className="invalid-feedback">{errors.start}</div>
              )}
            </div>

            <div className="mb-3">
              <label htmlFor="end" className="form-label">
                End Date:
              </label>
              <input
                type="datetime-local"
                className={`form-control ${errors.end ? "is-invalid" : ""}`}
                id="end"
                value={end}
                onChange={(e) => setEnd(e.target.value)}
              />
              {errors.end && (
                <div className="invalid-feedback">{errors.end}</div>
              )}
            </div>

            <div className="mb-3">
              <label htmlFor="description" className="form-label">
                Description:
              </label>
              <textarea
                className={`form-control ${
                  errors.description ? "is-invalid" : ""
                }`}
                id="description"
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                rows="4"
                style={{ resize: "none" }}
              ></textarea>
              {errors.description && (
                <div className="invalid-feedback">{errors.description}</div>
              )}
            </div>

            <button type="submit" className="create-task-btn">
              Create Task
            </button>
          </form>
        </div>
      </div>
    </div>
  );
};

export default CreateTask;
