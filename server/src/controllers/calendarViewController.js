const { getCalendarEvents } = require("../models/calendarViewModel");

// Controller für das Abrufen der Kalendereinträge
const fetchCalendarEvents = async (req, res) => {
  try {
    const [events] = await getCalendarEvents(); // Daten vom Model abrufen
    res.status(200).json(events); // Erfolgreich zurückgeben
  } catch (err) {
    console.error("Error in fetchCalendarEvents:", err);
    res.status(500).json({ error: "Failed to fetch calendar events" });
  }
};

module.exports = {
  fetchCalendarEvents,
};
