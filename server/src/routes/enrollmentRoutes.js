const express = require("express");
const router = express.Router();
const enrollmentController = require("../controllers/enrollmentController");
const authenticate = require("../middleware/authenticate");


// Route: Abrufen aller zukünftigen Sessions
router.get("/upcoming", 
    authenticate,
    enrollmentController.getUpcomingSessions);

// Route: Anmeldung zu einer Session
router.post("/enroll", 
    authenticate, 
    enrollmentController.enrollInSession);

// Route: Abrufen aller Registrierungen eines Benutzers
router.get("/my-enrollments", 
    authenticate,
    enrollmentController.getUserEnrollments);


// Route: Abmeldung von einer Session
router.post("/withdraw", 
    authenticate,
    enrollmentController.withdrawFromSession);

module.exports = router;
