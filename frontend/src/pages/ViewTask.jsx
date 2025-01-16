import React, { useState, useEffect } from "react";
import { Table, Form, Pagination, Modal, Button } from "react-bootstrap";
import moment from "moment";
import { FaCheck, FaHourglassHalf, FaTimes, FaEye } from "react-icons/fa";
import CryptoJS from "crypto-js";
import { useNavigate } from "react-router-dom";
import isAuthenticate from "../components/auth";

const ViewTask = () => {
  const [tasks, setTasks] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [tasksPerPage] = useState(5);
  const [selectedDate, setSelectedDate] = useState(
    moment().format("YYYY-MM-DD")
  );
  const [showModal, setShowModal] = useState(false);
  const [selectedTask, setSelectedTask] = useState(null);
  const [userInfo, setUserInfo] = useState(null);
  const [totalCount, setTotalCount] = useState(0); // State to store the total count of tasks
  const navigate = useNavigate();

  // Authentication check and token decryption
  useEffect(() => {
    const checkAuthentication = () => {
      const access = isAuthenticate();
      if (!access) {
        navigate("/");
      } else {
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
          navigate("/");
        }
      }
    };

    checkAuthentication();
  }, [navigate]);

  useEffect(() => {
    if (userInfo) {
      console.log("User Info:", userInfo); // Log user info to verify it's correct
    }
  }, [userInfo]);

  // Fetch tasks based on current page, selected date, and user info
  const fetchTasks = async () => {
    try {
      const response = await fetch(
        `http://localhost:5000/api/v1/task/list?limit=${tasksPerPage}&offset=${
          (currentPage - 1) * tasksPerPage
        }&userId=${userInfo.user_id}&roll=${
          userInfo.roll_name
        }&date=${selectedDate}`
      );
      const data = await response.json();

      // Debugging: Log the raw API response
      console.log("API Response Data:", data);

      if (data?.data?.result) {
        setTasks(data.data.result); // Update tasks with the new data
        setTotalCount(data.data.totalCount); // Set the total count from the response
      } else {
        console.error("No tasks returned from the API");
      }
    } catch (error) {
      console.error("Error fetching tasks:", error);
    }
  };

  // Pagination logic
  const currentTasks = tasks;

  // Pagination controls
  const paginate = (pageNumber) => setCurrentPage(pageNumber);

  // Modal handlers
  const handleView = (task) => {
    setSelectedTask(task);
    setShowModal(true);
  };

  const handleCloseModal = () => setShowModal(false);

  // Handle status change for tasks
  const handleStatusChange = async (status) => {
    if (selectedTask) {
      try {
        // Send the status update to the server
        const response = await fetch(
          "http://localhost:5000/api/v1/task/status",
          {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
            },
            body: JSON.stringify({
              taskId: selectedTask.task_id,
              status,
            }),
          }
        );

        const result = await response.json();

        console.log(result, "rrrrrrrrrrrrrr");

        if (result.statusCode === 200) {
          // If the server responds with success, update the status in the tasks array
          const updatedTask = { ...selectedTask, status };

          setTasks((prevTasks) =>
            prevTasks.map((task) =>
              task.task_id === selectedTask.task_id ? updatedTask : task
            )
          );

          setSelectedTask(updatedTask);

          // Close the modal
          setShowModal(false);

          // Reload tasks to get updated data
          fetchTasks(); // Fetch the updated task list
        } else {
          console.error("Failed to update task status:", result.message);
        }
      } catch (error) {
        console.error("Error updating task status:", error);
      }
    }
  };

  // Get status icons for tasks
  const getStatusIcon = (status) => {
    switch (status) {
      case "Completed":
        return <FaCheck color="green" size={20} />;
      case "Progress":
        return <FaHourglassHalf color="orange" size={20} />;
      case "Pending":
        return <FaTimes color="red" size={20} />;
      default:
        return null;
    }
  };

  // Fetch tasks when page, selected date, or user info changes
  useEffect(() => {
    if (userInfo) {
      fetchTasks();
    }
  }, [selectedDate, currentPage, tasksPerPage, userInfo]);

  return (
    <div className="container" style={{ marginTop: "12%" }}>
      <style>
        {`
          .truncate {
            max-width: 60ch;
            white-space: nowrap;
            overflow: hidden;
            text-overflow: ellipsis;
          }
          .description-column {
            max-width: 50ch;
            white-space: nowrap;
            overflow: hidden;
            text-overflow: ellipsis;
          }
          th, td {
            padding: 8px;
          }
          .action-icons {
            cursor: pointer;
            color: black;
          }
        `}
      </style>

      {/* Date Picker */}
      <div className="d-flex justify-content-end mb-3">
        <Form inline>
          <Form.Group>
            <Form.Control
              type="date"
              value={selectedDate}
              onChange={(e) => setSelectedDate(e.target.value)}
            />
          </Form.Group>
        </Form>
      </div>

      {/* Task Table */}
      <Table striped bordered hover responsive>
        <thead>
          <tr>
            <th>S.NO</th>
            <th>View</th>
            <th>Task Name</th>
            <th>Staff Name</th>
            <th>Start Time</th>
            <th>End Time</th>
            <th>Description</th>
            <th>Status</th>
          </tr>
        </thead>
        <tbody>
          {currentTasks.map((task, index) => (
            <tr key={task.task_id}>
              <td>{index + 1}</td>
              <td>
                <FaEye
                  onClick={() => handleView(task)}
                  className="action-icons"
                  style={{ marginRight: "10px" }}
                />
              </td>
              <td title={task.task_name} className="truncate">
                {task.task_name.length > 50
                  ? task.task_name.substring(0, 50) + "..."
                  : task.task_name}
              </td>
              <td title={task.username} className="truncate">
                {task.username.length > 50
                  ? task.username.substring(0, 50) + "..."
                  : task.username}
              </td>
              <td>{moment(task.start).format("hh:mm A")}</td>
              <td>{moment(task.end).format("hh:mm A")}</td>
              <td className="description-column">
                {task.description.length > 150
                  ? task.description.substring(0, 150) + "..."
                  : task.description}
              </td>
              <td>
                {getStatusIcon(task.status)} {task.status}
              </td>
            </tr>
          ))}
        </tbody>
      </Table>

      {/* Pagination */}
      <Pagination>
        {[...Array(Math.ceil(totalCount / tasksPerPage))].map((_, index) => (
          <Pagination.Item
            key={index + 1}
            active={index + 1 === currentPage}
            onClick={() => paginate(index + 1)}
          >
            {index + 1}
          </Pagination.Item>
        ))}
      </Pagination>

      {/* Task Detail Modal */}
      <Modal show={showModal} onHide={handleCloseModal}>
        <Modal.Header closeButton>
          <Modal.Title>Task Details</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          {selectedTask && (
            <>
              <h5>Task Name: {selectedTask.task_name}</h5>
              <p>
                <strong>Staff Name:</strong> {selectedTask.username}
              </p>
              <p>
                <strong>Start Time:</strong>{" "}
                {moment(selectedTask.start).format("YYYY-MM-DD hh:mm A")}
              </p>
              <p>
                <strong>End Time:</strong>{" "}
                {moment(selectedTask.end).format("YYYY-MM-DD hh:mm A")}
              </p>
              <p>
                <strong>Description:</strong> {selectedTask.description}
              </p>
              <p>
                <strong>Status:</strong> {getStatusIcon(selectedTask.status)}{" "}
                {selectedTask.status}
              </p>

              {userInfo?.roll_name === "staff" &&
                selectedTask.status !== "Completed" && (
                  <Form.Group>
                    <Form.Label>Change Status</Form.Label>
                    <Form.Control
                      as="select"
                      onChange={(e) => handleStatusChange(e.target.value)}
                    >
                      <option value="Pending">Pending</option>
                      <option value="Progress">In Progress</option>
                      <option value="Completed">Completed</option>
                    </Form.Control>
                  </Form.Group>
                )}
            </>
          )}
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={handleCloseModal}>
            Close
          </Button>
        </Modal.Footer>
      </Modal>
    </div>
  );
};

export default ViewTask;
