const db = require("../utils/db"); // Importiere die Knex.js-Datenbankverbindung

// Funktion zum Abrufen von zukünftigen Kurs-Sessions
const getUpcomingSessions = async () => {
  try {
    const sessions = await db("coursesession")
      .join("course", "coursesession.course_id", "course.course_id")
      .select(
        "coursesession.session_id",
        "course.title",
        "course.description",
        "course.max_participants",
        "coursesession.start_date",
        "coursesession.end_date"
      )
      .where("coursesession.start_date", ">", db.fn.now());
    return sessions;
  } catch (error) {
    console.error("Error fetching upcoming sessions:", error);
    throw new Error("Fehler beim Abrufen der Kurs-Sessions.");
  }
};

// Funktion zur Anmeldung zu einem Kurs
const enrollInSession = async (sessionId, userId) => {
  try {
    // Überprüfung der maximalen Teilnehmerzahl
    const participantCount = await db("registration")
      .where("session_id", sessionId)
      .count("* as count")
      .first();
    const session = await db("coursesession")
      .join("course", "coursesession.course_id", "course.course_id")
      .select("course.max_participants", "coursesession.teacher_id") // teacher_id holen
      .where("coursesession.session_id", sessionId)
      .first();

    if (participantCount.count >= session.max_participants) {
      throw new Error("Maximale Teilnehmerzahl erreicht.");
    }

    // Überprüfung von Terminkollisionen
    const userEvents = await db("calendarevent").where("user_id", userId);
    const sessionEvents = await db("calendarevent").where("session_id", sessionId);

    const hasConflict = sessionEvents.some((sessionEvent) =>
      userEvents.some(
        (userEvent) =>
          sessionEvent.start_time < userEvent.end_time &&
          sessionEvent.end_time > userEvent.start_time
      )
    );

    if (hasConflict) {
      throw new Error("Terminkollision mit bestehenden Kalenderereignissen.");
    }

    // Anmeldung in der Registration-Tabelle
    await db("registration").insert({
      user_id: userId,
      session_id: sessionId,
      status: "angemeldet",
    });

    // Übertragen der Kalendereinträge des Dozenten, ohne event_id
    const eventsToCopy = await db("calendarevent")
      .where("session_id", sessionId)
      .andWhere("user_id", session.teacher_id)  // Nur die Events des Dozenten kopieren
      .select("session_id", "start_time", "end_time", "room_id");

    const newEvents = eventsToCopy.map((event) => ({
      ...event,
      user_id: userId, // Füge die user_id für den Teilnehmer hinzu
    }));

    await db("calendarevent").insert(newEvents);

    return { message: "Erfolgreich zum Kurs angemeldet." };
  } catch (error) {
    console.error("Error enrolling in session:", error.message);
    throw new Error(error.message || "Fehler bei der Kursanmeldung.");
  }
};


// Funktion zum Abrufen von Kursen, zu denen der Benutzer angemeldet ist
const getUserEnrollments = async (userId) => {
  try {
    const enrollments = await db("registration")
      .join("coursesession", "registration.session_id", "coursesession.session_id")
      .join("course", "coursesession.course_id", "course.course_id")
      .select(
        "registration.registration_id",
        "coursesession.session_id",
        "course.title",
        "coursesession.start_date",
        "coursesession.end_date",
        "registration.status"
      )
      .where("registration.user_id", userId);
    return enrollments;
  } catch (error) {
    console.error("Error fetching user enrollments:", error);
    throw new Error("Fehler beim Abrufen der Anmeldungen.");
  }
};

// Funktion zum Abmelden von einem Kurs
const withdrawFromSession = async (sessionId, userId) => {
  try {
    await db("calendarevent")
      .where("user_id", userId)
      .andWhere("session_id", sessionId)
      .del();

    
    await db("registration")
      .where("user_id", userId)
      .andWhere("session_id", sessionId)
      .del();

        return { message: "Erfolgreich vom Kurs abgemeldet." };
  } catch (error) {
    console.error("Error withdrawing from session:", error);
    throw new Error("Fehler beim Abmelden vom Kurs.");
  }
};

module.exports = {
  getUpcomingSessions,
  enrollInSession,
  getUserEnrollments,
  withdrawFromSession,
};
