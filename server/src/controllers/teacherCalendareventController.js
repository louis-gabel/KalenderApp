const teacherCalendarEventModel = require("../models/teacherCalendarEventModel");

// Erstellen von Kalendereinträgen für eine Kurs-Session
const createCalendarEvents = async (req, res) => {
  const { sessionId, events } = req.body; // Erwartet sessionId und events im Request-Body

  try {
    const result = await teacherCalendarEventModel.createCalendarEvents(sessionId, events);
    res.status(201).json(result); // Erfolgreiches Erstellen der Kalendereinträge
  } catch (error) {
    console.error("Error creating calendar events:", error);
    res.status(500).json({ message: error.message || "Fehler beim Erstellen der Kalendereinträge." });
  }
};

// Abrufen aller Kalendereinträge für eine Kurs-Session
const getCalendarEventsBySession = async (req, res) => {
  const { sessionId } = req.params; // Erwartet sessionId als URL-Parameter

  try {
    const events = await teacherCalendarEventModel.getCalendarEventsBySession(sessionId);
    res.status(200).json(events); // Rückgabe der Kalendereinträge
  } catch (error) {
    console.error("Error fetching calendar events:", error);
    res.status(500).json({ message: "Fehler beim Abrufen der Kalendereinträge." });
  }
};

module.exports = {
  createCalendarEvents,
  getCalendarEventsBySession,
};
