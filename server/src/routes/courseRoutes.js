const express = require("express");
const courseController = require("../controllers/courseController");
const authenticate = require("../middleware/authenticate");
const checkRole = require("../middleware/checkRole");
const router = express.Router(); // Create a new router object
const { createCourseSession } = require('../controllers/courseController');

router.get("/", authenticate, courseController.getCourses); // only authenticated users can see the courses

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

router.post(
  '/courses/:course_id/sessions',
  authenticate, // Sicherstellen, dass der Benutzer eingeloggt ist
  checkRole([2]), // Prüfen, ob der Benutzer die Rolle "Dozent" hat
  createCourseSession
);

// Authorisierung für Kurserstellung
router.get(
  '/courses/:course_id/authorization',
  authenticate, // JWT prüfen
  checkRole([2]), // Nur Dozenten dürfen prüfen
  async (req, res) => {
    const { course_id } = req.params;
    const { teacher_id } = req.user_id; // Benutzer-ID aus dem JWT

    try {
      const isAuthorized = await db('teachercourse')
        .where({ course_id: course_id, teacher_id: teacher_id })
        .first();

      if (isAuthorized) {
        return res.json({ authorized: true });
      } else {
        return res.json({ authorized: false });
      }
    } catch (error) {
      console.error('Fehler beim Überprüfen der Berechtigung:', error);
      return res.status(500).json({ message: 'Interner Serverfehler.' });
    }
  }
);

module.exports = router;
