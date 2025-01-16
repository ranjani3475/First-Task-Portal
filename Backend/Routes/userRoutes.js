const express = require("express");
const userController = require("../Controllers/userController");
const router = express.Router();

router.post("/signin", userController.validateUser);
router.get("/hod/user", userController.getUserByHod);

module.exports = router;
