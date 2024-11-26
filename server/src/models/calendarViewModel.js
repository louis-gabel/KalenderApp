const db = require("../utils/db"); // Importiere die Knex.js-Datenbankverbindung

// Funktion zum Abrufen von Kalendereinträgen
const getCalendarEvents = async () => {
  try {
    const events = await db("calendarevent") // Tabellenname
      .select("event_id", "start_time", "end_time", "room_id"); // Spalten auswählen
    return events;
  } catch (error) {
    console.error("Error fetching calendar events:", error);
    throw error; // Fehler weitergeben
  }
};

module.exports = {
  getCalendarEvents,
};
