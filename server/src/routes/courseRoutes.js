const express = require("express");
const courseController = require("../controllers/courseController");
const authenticate = require("../middleware/authenticate");
const checkRole = require("../middleware/checkRole");
const router = express.Router(); // Create a new router object

router.get("/", courseController.getCourses); // only authenticated users can see the courses
router.post(
  "/",
  authenticate,
  checkRole([2, 1]),
  courseController.createCourse
); // only admin/dozent can create a course
router.put(
  "/:id",
  authenticate,
  checkRole([2, 1]),
  courseController.updateCourse
); // only admin/dozent can update a course
router.delete(
  "/:id",
  authenticate,
  checkRole([2, 1]),
  courseController.deleteCourse
); // only admin/dozent can delete a course

module.exports = router;
