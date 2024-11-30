const express = require("express");
const router = express.Router();
const enrollmentController = require("../controllers/enrollmentController");
const authMiddleware = require("../middleware/authenticate"); // Middleware für Authentifizierung

// Route: Abrufen aller zukünftigen Sessions
//router.get("/upcoming", authMiddleware, enrollmentController.getUpcomingSessions);
router.get("/upcoming", enrollmentController.getUpcomingSessions);

// Route: Anmeldung zu einer Session
//router.post("/enroll", authMiddleware, enrollmentController.enrollInSession);
router.post("/enroll", enrollmentController.enrollInSession);

// Route: Abrufen aller Registrierungen eines Benutzers
//router.get("/my-enrollments", authMiddleware, enrollmentController.getUserEnrollments);
router.get("/my-enrollments", enrollmentController.getUserEnrollments);


// Route: Abmeldung von einer Session
//router.post("/withdraw", authMiddleware, enrollmentController.withdrawFromSession);
router.post("/withdraw", enrollmentController.withdrawFromSession);

module.exports = router;
