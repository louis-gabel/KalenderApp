const { getCalendarEvents } = require("../models/calendarViewModel");

// Controller für das Abrufen der Kalendereinträge
const fetchCalendarEvents = async (req, res) => {
  try {
    // Angemeldete Benutzer-ID aus der Anfrage (z. B. aus einem JWT-Token oder Header)
    const userId = 4; //req.user?.id; // Falls JWT verwendet wird, passe die Quelle an

    if (!userId) {
      return res.status(400).json({ error: "User ID is required" });
    }

    // Daten vom Model abrufen und Benutzer-ID übergeben
    const [events] = await getCalendarEvents(userId);
    res.status(200).json(events); // Erfolgreich zurückgeben
  } catch (err) {
    console.error("Error in fetchCalendarEvents:", err);
    res.status(500).json({ error: "Failed to fetch calendar events" });
  }
};

module.exports = {
  fetchCalendarEvents,
};

