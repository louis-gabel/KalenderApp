const express = require("express");
const teachercourseController = require("../controllers/teachercourseController");
const authenticate = require("../middleware/authenticate");
const checkRole = require("../middleware/checkRole");
const router = express.Router();

router.get("/", authenticate, teachercourseController.getAllTeachersCourses);

router.get(
  "/teacher/:id",
  authenticate,
  teachercourseController.getAllTeachersOfCourse
);

router.get(
  "/courses/:id",
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
  "/update/:id",
  authenticate,
  checkRole([1]),
  teachercourseController.updateTeacherCourse
);

router.delete(
  "/delete/:id",
  authenticate,
  checkRole([1]),
  teachercourseController.deleteTeacherCourse
);

module.exports = router;
