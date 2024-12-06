import React, { useState, useEffect, useCallback } from "react";
import axios from "axios";

const CourseSessionList = () => {
  const [courses, setCourses] = useState([]);
  const [searchTerm, setSearchTerm] = useState(""); // Suchbegriff für Kurse
  const [loading, setLoading] = useState(true);

  // Temporäre UserID, bis Authentifizierung implementiert ist
  const TEMP_USER_ID = 4;

  // Base URL aus der .env-Datei
  const API_BASE_URL = process.env.REACT_APP_API_URL;

  const getUpcomingSessions = useCallback(async () => {
    const token = localStorage.getItem("token"); // Token for authentication
    const response = await axios.get(`${API_BASE_URL}/enrollment/upcoming`, {
      headers: { Authorization: `Bearer ${token}` },
    });
    return response.data;
  }, [API_BASE_URL]);

  const getUserEnrollments = useCallback(async () => {
    const token = localStorage.getItem("token"); // Token for authentication
    const response = await axios.get(
      `${API_BASE_URL}/enrollment/my-enrollments`,
      {
        params: { userId: TEMP_USER_ID },
        headers: { Authorization: `Bearer ${token}` },
      }
    );
    return response.data;
  }, [API_BASE_URL]);

  const enrollInSession = async (sessionId) => {
    const token = localStorage.getItem("token"); // Token for authentication
    const response = await axios.post(`${API_BASE_URL}/enrollment/enroll`, {
      sessionId,
      userId: TEMP_USER_ID,
      headers: { Authorization: `Bearer ${token}` },
    });
    return response.data;
  };

  const withdrawFromSession = async (sessionId) => {
    const token = localStorage.getItem("token"); // Token for authentication
    const response = await axios.post(`${API_BASE_URL}/enrollment/withdraw`, {
      sessionId,
      userId: TEMP_USER_ID,
      headers: { Authorization: `Bearer ${token}` },
    });
    return response.data;
  };

  useEffect(() => {
    const fetchCoursesAndEnrollments = async () => {
      try {
        setLoading(true);
        const [upcomingCourses, userEnrollments] = await Promise.all([
          getUpcomingSessions(),
          getUserEnrollments(),
        ]);

        // Prüfen, ob der Benutzer zu jedem Kurs angemeldet ist
        const enrolledSessionIds = userEnrollments.map((e) => e.session_id);
        const coursesWithStatus = upcomingCourses.map((course) => ({
          ...course,
          isEnrolled: enrolledSessionIds.includes(course.session_id),
        }));

        // Kurse mit Status speichern
        setCourses(coursesWithStatus);
      } catch (error) {
        console.error("Error fetching courses or enrollments:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchCoursesAndEnrollments();
  }, [getUpcomingSessions, getUserEnrollments]);

  const handleEnroll = async (sessionId) => {
    try {
      await enrollInSession(sessionId);
      setCourses((prevCourses) =>
        prevCourses.map((course) =>
          course.session_id === sessionId
            ? { ...course, isEnrolled: true }
            : course
        )
      );
      alert("Erfolgreich angemeldet!");
    } catch (error) {
      const errorMessage =
        error.response?.data?.message || "Fehler bei der Anmeldung.";
      console.error("Error enrolling in session:", errorMessage);
      alert(errorMessage);
    }
  };

  const handleWithdraw = async (sessionId) => {
    try {
      await withdrawFromSession(sessionId);
      setCourses((prevCourses) =>
        prevCourses.map((course) =>
          course.session_id === sessionId
            ? { ...course, isEnrolled: false }
            : course
        )
      );
      alert("Erfolgreich abgemeldet!");
    } catch (error) {
      const errorMessage =
        error.response?.data?.message || "Fehler bei der Abmeldung.";
      console.error("Error withdrawing from session:", errorMessage);
      alert(errorMessage);
    }
  };

  // Filterkurse basierend auf dem Suchbegriff
  const filteredCourses = courses.filter((course) =>
    course.title.toLowerCase().includes(searchTerm.toLowerCase())
  );

  if (loading) {
    return <div className="alert alert-info text-center">Lade Daten...</div>;
  }

  return (
    <div className="container mt-4">
      <h1 className="text-primary mb-4">Verfügbare Kurse</h1>

      {/* Suchfeld */}
      <div className="row mb-3">
        <div className="col-3">
          <input
            type="text"
            className="form-control"
            placeholder="Kurs suchen"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
      </div>

      {/* Kursliste */}
      <div className="row">
        {filteredCourses.map((course) => (
          <div className="col-md-4 mb-4" key={course.session_id}>
            <div className="card h-100">
              <div className="card-body">
                <h5 className="card-title text-center text-primary">{course.title}</h5>
                <p className="card-text">{course.description}</p>
                <p className="card-text">
                  <strong>Start:</strong>{" "}
                  {new Date(course.start_date).toLocaleString()} <br />
                  <strong>Ende:</strong>{" "}
                  {new Date(course.end_date).toLocaleString()}
                </p>
              </div>
              <div className="card-footer text-center">
                <button
                  onClick={() => handleEnroll(course.session_id)}
                  className={`btn ${
                    course.isEnrolled ? "btn-secondary" : "btn-success"
                  } w-100 mb-2`}
                  disabled={course.isEnrolled}
                >
                  {course.isEnrolled ? "Bereits angemeldet" : "Anmelden"}
                </button>
                {course.isEnrolled && (
                  <button
                    onClick={() => handleWithdraw(course.session_id)}
                    className="btn btn-danger w-100"
                  >
                    Abmelden
                  </button>
                )}
              </div>
            </div>
          </div>
        ))}
        {filteredCourses.length === 0 && (
          <div className="col-12">
            <div className="alert alert-warning text-center">Keine Kurse gefunden.</div>
          </div>
        )}
      </div>
    </div>
  );
};

export default CourseSessionList;
