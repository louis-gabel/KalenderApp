const express = require("express");
const router = express.Router();
const { getCalendarEvents } = require("../models/calendarViewModel");

// Endpunkt zum Abrufen der Kalendereinträge
router.get("/calendarevents", async (req, res) => {
  try {
    const events = await getCalendarEvents();
    res.status(200).json(events); // Kalendereinträge als JSON senden
  } catch (error) {
    res.status(500).json({ message: "Error fetching calendar events", error });
  }
});

module.exports = router;

