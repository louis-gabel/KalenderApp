const express = require("express");
const coursessionController = require("../controllers/coursessionController");
const authenticate = require("../middleware/authenticate");
const checkRole = require("../middleware/checkRole");
const router = express.Router(); // Create a new router object

router.post("/", authenticate, coursessionController.createCourseSession); // only authenticated users can see the courses

router.delete("/:id", authenticate, coursessionController.deleteCourseSession); // only authenticated users can see the courses

router.get("/", authenticate, coursessionController.getCourseSessions); // only authenticated users can see the courses

router.get(
  "/:id",
  authenticate,
  coursessionController.getSpecificCourseSessions
); // only authenticated users can see the courses

module.exports = router;
