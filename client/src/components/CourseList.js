import React, { useState, useEffect, useCallback } from "react";
import axios from "axios";

const CourseList = ({ apiUrl }) => {
  const [courses, setCourses] = useState([]); // State für Kurse
  const [searchTerm, setSearchTerm] = useState(""); // Suchbegriff
  const [loading, setLoading] = useState(true); // Ladeanzeige
  const [error, setError] = useState(null); // Fehleranzeige
  const [categories, setCategories] = useState([]); // list of categories
  const [selectedCategories, setSelectedCategories] = useState([]);

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

  const fetchCategories = useCallback(async () => {
    try {
      const token = localStorage.getItem("token"); // Token for authentication
      const response = await axios.get(`${apiUrl}/category`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setCategories(response.data); // Set loaded categories
    } catch (err) {
      setError("Error loading categories.");
    }
  }, [apiUrl]);

  // useEffect, um die Daten beim Mounten der Komponente zu laden
  useEffect(() => {
    fetchCourses();
    fetchCategories();
  }, [fetchCourses, fetchCategories]);

  // Gefilterte Liste basierend auf dem Suchbegriff und den ausgewählten Kategorien
  const filteredCourses = courses.filter((course) => {
    const matchesSearch = course.title.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCategory =
      // Alle auswählen falls keine Kategorien selected.
      selectedCategories.length === 0 || selectedCategories.includes(course.category_id);
    return matchesSearch && matchesCategory;
  });

  // Event-Handler für Checkbox-Änderung
  const handleCheckboxChange = (categoryId) => {
    setSelectedCategories((prev) =>
      prev.includes(categoryId)
        ? prev.filter((id) => id !== categoryId) // Entfernen, wenn bereits ausgewählt
        : [...prev, categoryId] // Hinzufügen, wenn nicht ausgewählt
    );
  };

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

      {/* Dropdown-Menü mit Checkboxen für Kategorien */}
      <div style={{ marginBottom: "20px" }}>
        <button
          onClick={() => {
            const dropdown = document.getElementById("categoryDropdown");
            dropdown.style.display = dropdown.style.display === "none" ? "block" : "none";
          }}
          style={{
            padding: "10px",
            fontSize: "16px",
            cursor: "pointer",
            width: "100%",
          }}
        >
          Filter ein/ausblenden
        </button>
        <div
          id="categoryDropdown"
          style={{
            display: "inline",
            border: "1px solid #ccc",
            padding: "10px",
            backgroundColor: "white",
            position: "absolute",
            zIndex: 1,
            right: 0,
          }}
        >
          {categories.map((categories) => (
            <div key={categories.category_id}>
              <input
                type="checkbox"
                id={`category-${categories.category_id}`}
                value={categories.category_id}
                checked={selectedCategories.includes(categories.category_id)}
                onChange={() => handleCheckboxChange(categories.category_id)} // Checkbox ändern
              />
              <label>{categories.category_name}</label>
            </div>
          ))}
        </div>
      </div>

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
