const enrollmentModel = require("../models/enrollmentModel");

// Abrufen aller zukünftigen Sessions
const getUpcomingSessions = async (req, res) => {
  try {
    const sessions = await enrollmentModel.getUpcomingSessions();
    res.status(200).json(sessions);
  } catch (error) {
    console.error("Error fetching upcoming sessions:", error);
    res.status(500).json({ message: "Fehler beim Abrufen der Sessions." });
  }
};

// Anmeldung zu einem Kurs
const enrollInSession = async (req, res) => {
  const { sessionId } = req.body; // Erwartet sessionId im Request-Body
  // const userId = localStorage.getItem("id");
  const userId = 12;
  try {
    const result = await enrollmentModel.enrollInSession(sessionId, userId);
    res.status(200).json(result);
  } catch (error) {
    console.error("Error enrolling in session:", error);
    res.status(400).json({ message: error.message }); // Fehler als Antwort senden
  }
};

// Abrufen aller Registrierungen eines Benutzers
const getUserEnrollments = async (req, res) => {
  // const userId = localStorage.getItem("id");
  const userId = 12;
  try {
    const enrollments = await enrollmentModel.getUserEnrollments(userId);
    res.status(200).json(enrollments);
  } catch (error) {
    console.error("Error fetching user enrollments:", error);
    res.status(500).json({ message: "Fehler beim Abrufen der Registrierungen." });
  }
};

// Abmeldung von einem Kurs
const withdrawFromSession = async (req, res) => {
  const { sessionId } = req.body; // Erwartet sessionId im Request-Body
  // const userId = localStorage.getItem("id");
  const userId = 12;
  try {
    const result = await enrollmentModel.withdrawFromSession(sessionId, userId);
    res.status(200).json(result);
  } catch (error) {
    console.error("Error withdrawing from session:", error);
    res.status(500).json({ message: "Fehler beim Abmelden vom Kurs." });
  }
};

module.exports = {
  getUpcomingSessions,
  enrollInSession,
  getUserEnrollments,
  withdrawFromSession,
};
