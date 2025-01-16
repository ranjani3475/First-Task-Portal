const express = require("express");
const taskController = require("../Controllers/taskController");
const router = express.Router();

router.post("/create", taskController.createTask);
router.get("/list", taskController.taskList);
router.post("/status", taskController.taskStatus);

module.exports = router;
