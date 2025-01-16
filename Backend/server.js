const express = require("express");
const cors = require("cors");
const bodyParser = require("body-parser");
const routes = require("./Routes/index");

const app = express(); // Initialize the app

// Middleware setup
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(bodyParser.json({ limit: "50mb" }));
app.use(bodyParser.urlencoded({ limit: "50mb", extended: true }));

// Routes
app.use("/api/v1/", routes);

// Create the server
const http = require("http");
const PORT = 5000;

const server = http.createServer(app);

// Start the server
server.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});
