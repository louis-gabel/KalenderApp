const express = require("express");
const teachercourseController = require("../controllers/teachercourseController");
const authenticate = require("../middleware/authenticate");
const checkRole = require("../middleware/checkRole");
const router = express.Router();

router.get("/", authenticate, teachercourseController.getAllTeachersCourses);

router.get(
  "/teacher",
  authenticate,
  teachercourseController.getAllTeachersOfCourse
);

router.get(
  "/courses",
  authenticate,
  teachercourseController.getAllCoursesOfTeacher
);

router.post(
  "/create",
  authenticate,
  checkRole([1]),
  teachercourseController.createTeacherCourse
);

router.put(
  "/update",
  authenticate,
  checkRole([1]),
  teachercourseController.updateTeacherCourse
);

router.delete(
  "/delete",
  authenticate,
  checkRole([1]),
  teachercourseController.deleteTeacherCourse
);

module.exports = router;
