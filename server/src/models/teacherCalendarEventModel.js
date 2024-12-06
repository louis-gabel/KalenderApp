const db = require("../utils/db"); // Importiere die Knex.js-Datenbankverbindung

// Funktion zum Erstellen von Kalendereinträgen für eine Kurs-Session
const createCalendarEvents = async (sessionId, events) => {
  try {
    // Abrufen der Kurs-Session, um die teacher_id zu erhalten
    const session = await db("coursesession")
      .select("teacher_id")
      .where("session_id", sessionId)
      .first();

    if (!session) {
      throw new Error("Kurs-Session nicht gefunden.");
    }

    const { teacher_id } = session;

    // Eintrag in der Registration-Tabelle mit teacher_id
    await db("registration").insert({
      user_id: teacher_id,
      session_id: sessionId,
      status: "angemeldet",
    });

    // Kalendereinträge erstellen und mit der teacher_id verknüpfen
    const eventsToInsert = events.map((event) => ({
      session_id: sessionId,
      user_id: teacher_id, // Teacher als User eintragen
      start_time: event.start_time,
      end_time: event.end_time,
      room_id: event.room_id,
    }));

    await db("calendarevent").insert(eventsToInsert);

    return { message: "Kalendereinträge erfolgreich erstellt." };
  } catch (error) {
    console.error("Error creating calendar events:", error);
    throw new Error("Fehler beim Erstellen von Kalendereinträgen.");
  }
};

// Funktion zum Abrufen aller Kalendereinträge für eine Kurs-Session
const getCalendarEventsBySession = async (sessionId) => {
    try {
      // Abrufen der Kalendereinträge, die zur angegebenen Session und zum Lehrer gehören
      const events = await db("calendarevent")
        .join("coursesession", "calendarevent.session_id", "coursesession.session_id") // Join zu coursesession
        .select(
          "calendarevent.event_id",
          "calendarevent.session_id",
          "calendarevent.start_time",
          "calendarevent.end_time",
          "calendarevent.room_id"
        )
        .where("calendarevent.session_id", sessionId)
        .andWhere("coursesession.teacher_id", db.ref("calendarevent.user_id")); // Nur Events des Lehrers
  
      return events;
    } catch (error) {
      console.error("Error fetching calendar events by session:", error);
      throw new Error("Fehler beim Abrufen der Kalendereinträge für die Session.");
    }
  };
  

module.exports = {
  createCalendarEvents,
  getCalendarEventsBySession,
  };
