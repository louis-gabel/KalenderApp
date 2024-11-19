import React, { useState, useEffect } from "react";
import axios from "axios";

const API = process.env.REACT_APP_API_URL;

function App() {
  const [courses, setCourses] = useState([]); // State für Kurse
  const [loading, setLoading] = useState(true); // State für Ladeanzeige
  const [error, setError] = useState(null); // State für Fehleranzeige

  // Funktion, um Kurse zu laden
  const fetchCourses = async () => {
    try {
      const response = await axios.get(`${API}/events`);
      setCourses(response.data); // Kurse in den State speichern
      setLoading(false); // Ladeanzeige deaktivieren
    } catch (err) {
      setError(err.message); // Fehler im State speichern
      setLoading(false); // Ladeanzeige deaktivieren
    }
  };

  // useEffect, um die Daten beim Mounten der Komponente zu laden
  useEffect(() => {
    fetchCourses();
  }, []);

  // Ladeanzeige
  if (loading) return <div>Loading...</div>;

  // Fehleranzeige
  if (error) return <div>Error: {error}</div>;

  return (
    <div>
      <h1>Courses</h1>
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
    </div>
  );
}

export default App;
