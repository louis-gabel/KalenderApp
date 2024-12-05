import React, { useState, useEffect, useCallback } from "react";
import axios from "axios";

const CourseList = ({ apiUrl }) => {
  const [courses, setCourses] = useState([]); // State für Kurse
  const [loading, setLoading] = useState(true); // Ladeanzeige
  const [error, setError] = useState(null); // Fehleranzeige
  const [selectedCourse, setSelectedCourse] = useState(null); // Für das ausgewählte Kurs-Event
  const [startDate, setStartDate] = useState(""); // Startdatum
  const [endDate, setEndDate] = useState(""); // Enddatum
  const [role, setRole] = useState(""); // Benutzerrolle

  // Funktion, um Kurse zu laden, mit useCallback umschlossen
  const fetchCourses = useCallback(async () => {
    if (!apiUrl) {
      setError("API URL is not provided.");
      setLoading(false);
      return;
    }

    try {
      const response = await axios.get(`${apiUrl}/courses`); // Stammdaten der Kurse abrufen
      setCourses(response.data); // Kurse in den State speichern
    } catch (err) {
      setError(err.response?.data?.message || "Error fetching courses."); // Detaillierte Fehlermeldung
    } finally {
      setLoading(false); // Ladeanzeige deaktivieren
    }
  }, [apiUrl]);

  // useEffect, um die Daten beim Mounten der Komponente zu laden
  useEffect(() => {
    fetchCourses();
  }, [fetchCourses]);

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
              </li>
            ))
          ) : (
            <p>No courses available.</p>
          )}
        </ul>
      )}
    </div>
  );
};

export default CourseList;
