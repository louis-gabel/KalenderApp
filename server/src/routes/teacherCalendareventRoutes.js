const express = require("express");
const router = express.Router();
const teacherCalendarEventController = require("../controllers/teacherCalendarEventController");
const authenticate = require("../middleware/authenticate");

// Route: Erstellen von Kalendereinträgen für eine Kurs-Session
router.post("/create", 
    authenticate,
    teacherCalendarEventController.createCalendarEvents);

// Route: Abrufen aller Kalendereinträge für eine Kurs-Session
router.get("/:sessionId", 
    authenticate, 
    teacherCalendarEventController.getCalendarEventsBySession);

module.exports = router;
