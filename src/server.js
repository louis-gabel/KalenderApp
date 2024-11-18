require("dotenv").config();
const express = require("express");
const cors = require("cors");

// Import the Routes for handling requests to specific endpoints
const courseRoutes = require("./routes/courseRoutes");
const authRoutes = require("./routes/authRoutes");

const app = express();

// Enable Cross-Origin Resource Sharing (CORS) for all routes (security feature)
app.use(cors());
// Parse incoming JSON requests and put the parsed data in req.body
app.use(express.json());

// Use the Routes for handling requests to specific endpoints
app.use("/api/events", courseRoutes);
app.use("/api/auth", authRoutes);

// Define the port number from environment variables
const PORT = process.env.DB_PORT;

// Start the server and listen on the defined port
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
