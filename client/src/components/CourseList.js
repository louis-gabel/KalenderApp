import React, { useState, useEffect, useCallback } from "react";
import axios from "axios";

const CourseList = ({ apiUrl }) => {
  const [courses, setCourses] = useState([]); // State für Kurse
  const [loading, setLoading] = useState(true); // Ladeanzeige
  const [error, setError] = useState(null); // Fehleranzeige
  const [selectedCourse, setSelectedCourse] = useState(null);
  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");
  const [role, setRole] = useState("");
  const [userId, setUserId] = useState(null);
  const [authorizedCourses, setAuthorizedCourses] = useState([]);

  // Funktion, um Kurse zu laden, mit useCallback umschlossen
  const fetchCourses = useCallback(async () => {
    if (!apiUrl) {
      setError("API URL is not provided.");
      setLoading(false);
      return;
    }

    try {
      const token = localStorage.getItem("token");
      const response = await axios.get(`${apiUrl}/courses`,
      {
        headers: { Authorization: `Bearer ${token}` },
      }); // Stammdaten der Kurse abrufen
      setCourses(response.data); // Kurse in den State speichern
      // const courseAuthorizations = await Promise.all(
      //   response.data.map(async (course) => {
      //     const authResponse = await axios.get(`${apiUrl}/courses/${course.course_id}/authorization`,
      //       {
      //         headers: { Authorization: `Bearer ${token}` },
      //       });
      //     return authResponse.data.authorized ? course.course_id : null;
      //   })
      // );
      // setAuthorizedCourses(courseAuthorizations.filter((id) => id !== null));
    } catch (err) {
      setError(err.response?.data?.message || "Error fetching courses."); // Detaillierte Fehlermeldung
    } finally {
      setLoading(false); // Ladeanzeige deaktivieren
    }
  }, [apiUrl]);

  const decodeJWT = (token) => {
    try {
      const payload = JSON.parse(atob(token.split('.')[1]));
      return { role: payload.role, userId: payload.id };
    } catch (e) {
      console.error("Invalid JWT token", e);
      return null;
    }
  };

  // useEffect, um die Daten beim Mounten der Komponente zu laden
  useEffect(() => {
    const token = localStorage.getItem("token");
    if (token) {
      const userData = decodeJWT(token);
      if (userData) {
        setRole(userData.role);
        setUserId(userData.userId);
      }
    }
    fetchCourses();
  }, [fetchCourses]);

  const createCourseSession = async (courseId) => {
    const token = localStorage.getItem("token");
    try {
      await axios.post(`${apiUrl}/courses/${courseId}/sessions`, {
        start_date: startDate,
        end_date: endDate,
        headers: { Authorization: `Bearer ${token}` },
      });
      alert("CourseSession erfolgreich erstellt!");
      setSelectedCourse(null);
    } catch (err) {
      alert("Fehler beim Erstellen der CourseSession.");
    }
  };

  return (
    <div>
      <h1>Courses</h1>
      {loading && <div>Loading...</div>} {/* Ladeanzeige */}
      {error && <div style={{ color: "red" }}>Error: {error}</div>} {/* Fehleranzeige */}
      {!loading && !error && (
        <ul>
          {courses.length > 0 ? (
            courses.map((course) => (
              <li key={course.course_id}>
                <h2>{course.title}</h2>
                <p>{course.description}</p>
                {role === 2 && (
                  <button onClick={() => setSelectedCourse(course.course_id)}>
                    Event erstellen
                  </button>
                )}
              </li>
            ))
          ) : (
            <p>No courses available.</p>
          )}
        </ul>
      )}

      {selectedCourse && (
        <div style={{
          position: "fixed", top: "50%", left: "50%",
          transform: "translate(-50%, -50%)", padding: "20px",
          backgroundColor: "white", border: "1px solid #ccc"
        }}>
          <h3>Neue Veranstaltung für Kurs {selectedCourse}</h3>
          <label>
            Startdatum:
            <input type="date" value={startDate} onChange={(e) => setStartDate(e.target.value)} />
          </label>
          <br />
          <label>
            Enddatum:
            <input type="date" value={endDate} onChange={(e) => setEndDate(e.target.value)} />
          </label>
          <br />
          <button onClick={() => createCourseSession(selectedCourse)}>Erstellen</button>
          <button onClick={() => setSelectedCourse(null)}>Abbrechen</button>
        </div>
      )}
    </div>
  );
};

export default CourseList;
