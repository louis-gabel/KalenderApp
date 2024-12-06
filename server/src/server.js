require("dotenv").config();
const express = require("express");
const cors = require("cors");

// Import the Routes for handling requests to specific endpoints
const courseRoutes = require("./routes/courseRoutes");
const authRoutes = require("./routes/authRoutes");
const userRoutes = require("./routes/userRoutes");
const calendarViewRoutes = require("./routes/calendarViewRoutes");
const enrollmentRoutes = require("./routes/enrollmentRoutes");
const categoryRoutes = require("./routes/categoryRoutes");
const teachercourseRoutes = require("./routes/teachercourseRoutes");
const coursesessionRoutes = require("./routes/coursessionRoutes");
const roomRoutes = require("./routes/roomRoutes");
const teacherCalendarEventRoutes = require("./routes/teacherCalendareventRoutes");

const app = express();

// Enable Cross-Origin Resource Sharing (CORS) for requests coming from http://localhost:3000 (the client)
app.use(cors());

// Parse incoming JSON requests and put the parsed data in req.body
app.use(express.json());

// Use the Routes for handling requests to specific endpoints
app.use("/api/courses", courseRoutes);
app.use("/api/auth", authRoutes);
app.use("/api/user", userRoutes);
app.use("/api/calendar", calendarViewRoutes);
app.use("/api/enrollment", enrollmentRoutes);
app.use("/api/category", categoryRoutes);
app.use("/api/teachercourse", teachercourseRoutes);
app.use("/api/coursesessions", coursesessionRoutes);
app.use("/api/room", roomRoutes);
app.use("/api/teachercalendarevents", teacherCalendarEventRoutes);

// Define the port number from environment variables
const PORT = process.env.BACKEND_PORT;

// Start the server and listen on the defined port
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
