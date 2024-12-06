import React, { useState, useEffect, useCallback } from "react";
import axios from "axios";

const CourseList = ({ apiUrl }) => {
  const [courses, setCourses] = useState([]); // State für Kurse
  const [searchTerm, setSearchTerm] = useState(""); // Suchbegriff
  const [loading, setLoading] = useState(true); // Ladeanzeige
  const [error, setError] = useState(null); // Fehleranzeige

  // Funktion, um Kurse zu laden, mit useCallback umschlossen
  const fetchCourses = useCallback(async () => {
    if (!apiUrl) {
      setError("API URL is not provided.");
      setLoading(false);
      return;
    }

    try {
      const token = localStorage.getItem("token");
      // Create course
      const courseResponse = await axios.get(`${apiUrl}/courses`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setCourses(courseResponse.data); // Set loaded courses
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

  // Gefilterte Liste basierend auf dem Suchbegriff
  const filteredCourses = courses.filter((course) =>
    course.title.toLowerCase().includes(searchTerm.toLowerCase()) // Suche ignoriert Groß-/Kleinschreibung
  );

  return (
    <div>
      <h1>Courses</h1>
      {loading && <div>Loading...</div>} {/* Ladeanzeige */}
      {error && <div style={{ color: "red" }}>Error: {error}</div>}{" "} {/* Fehleranzeige */}
      {/* Suchfeld */}
      <input
        type="text"
        placeholder="Kurs suchen"
        value={searchTerm}
        onChange={(e) => setSearchTerm(e.target.value)} // Suchbegriff aktualisieren
        style={{
          marginBottom: "20px",
          padding: "10px",
          fontSize: "16px",
          width: "100%",
          borderColor: "#034875",
        }}
      />
      {!loading && !error && (
        <ul>
          {filteredCourses.length > 0 ? (
            filteredCourses.map((course) => (
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
