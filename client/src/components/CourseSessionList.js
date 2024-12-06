import React, { useState, useEffect, useCallback } from "react";
import axios from "axios";

const CourseSessionList = () => {
  const [courses, setCourses] = useState([]);
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
    const response = await axios.post(`${API_BASE_URL}/enrollment/enroll`, {
      sessionId,
      userId: TEMP_USER_ID,
    });
    return response.data;
  };

  const withdrawFromSession = async (sessionId) => {
    const response = await axios.post(`${API_BASE_URL}/enrollment/withdraw`, {
      sessionId,
      userId: TEMP_USER_ID,
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

  if (loading) {
    return <p>Loading...</p>;
  }

  return (
    <div>
      <h1>Verfügbare Kurse</h1>
      <ul>
        {courses.map((course) => (
          <li key={course.session_id} style={{ marginBottom: "20px" }}>
            <h2>{course.title}</h2>
            <p>{course.description}</p>
            <p>
              Start: {new Date(course.start_date).toLocaleString()} - Ende:{" "}
              {new Date(course.end_date).toLocaleString()}
            </p>
            <div>
              <button
                onClick={() => handleEnroll(course.session_id)}
                disabled={course.isEnrolled}
                style={{
                  backgroundColor: course.isEnrolled ? "gray" : "#4CAF50",
                  color: "white",
                  padding: "10px 20px",
                  border: "none",
                  cursor: course.isEnrolled ? "not-allowed" : "pointer",
                  marginRight: "10px",
                }}
              >
                {course.isEnrolled ? "Bereits angemeldet" : "Anmelden"}
              </button>
              {course.isEnrolled && (
                <button
                  onClick={() => handleWithdraw(course.session_id)}
                  style={{
                    backgroundColor: "#f44336",
                    color: "white",
                    padding: "10px 20px",
                    border: "none",
                    cursor: "pointer",
                  }}
                >
                  Abmelden
                </button>
              )}
            </div>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default CourseSessionList;
