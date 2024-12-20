const express = require("express");
const router = express.Router();
const { fetchCalendarEvents } = require("../controllers/calendarViewController");
const authenticate = require("../middleware/authenticate");

// Endpunkt zum Abrufen der Kalendereinträge
router.get("/calendarevents", authenticate, fetchCalendarEvents);

module.exports = router;


