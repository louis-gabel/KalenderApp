const db = require("../utils/db"); // Importiere die Knex.js-Datenbankverbindung

// Funktion zum Abrufen von Kalendereinträgen mit erweiterten Feldern
const getCalendarEvents = async (userId) => {
  try {
    const events = await db("calendarevent")
      .join("coursesession", "calendarevent.session_id", "=", "coursesession.session_id")
      .join("user", "coursesession.teacher_id", "=", "user.user_id") // Join über teacher_id
      .join("room", "calendarevent.room_id", "=", "room.room_id") // Join über room_id
      .join("course", "coursesession.course_id", "=", "course.course_id") // Join über course_id
      .select(
        "calendarevent.event_id",
        "calendarevent.start_time",
        "calendarevent.end_time",
        "user.surname as teacher_surname", // Lehrer-Nachname
        "room.room_name", // Raumname
        "course.title as course_title", // Kursname
        "course.description as course_description" // Kursbeschreibung
      )
      .where("calendarevent.user_id", userId); // Nur Events des spezifischen Benutzers abrufen

    return events;
  } catch (error) {
    console.error("Error fetching calendar events:", error);
    throw error; // Fehler weitergeben
  }
};

module.exports = {
  getCalendarEvents,
};
