import React, { useState, useEffect, useCallback } from "react";
import axios from "axios";

const CourseList = ({ apiUrl }) => {
  const [courses, setCourses] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [categories, setCategories] = useState([]);
  const [selectedCategories, setSelectedCategories] = useState([]);

  const fetchCourses = useCallback(async () => {
    try {
      const token = localStorage.getItem("token");
      const courseResponse = await axios.get(`${apiUrl}/courses`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setCourses(courseResponse.data);
    } catch (err) {
      setError(err.response?.data?.message || "Error fetching courses.");
    } finally {
      setLoading(false);
    }
  }, [apiUrl]);

  const fetchCategories = useCallback(async () => {
    try {
      const token = localStorage.getItem("token");
      const response = await axios.get(`${apiUrl}/category`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setCategories(response.data);
    } catch (err) {
      setError("Error loading categories.");
    }
  }, [apiUrl]);

  useEffect(() => {
    fetchCourses();
    fetchCategories();
  }, [fetchCourses, fetchCategories]);

  const filteredCourses = courses.filter((course) => {
    const matchesSearch = course.title.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCategory =
      selectedCategories.length === 0 || selectedCategories.includes(course.category_id);
    return matchesSearch && matchesCategory;
  });

  const handleCheckboxChange = (categoryId) => {
    setSelectedCategories((prev) =>
      prev.includes(categoryId)
        ? prev.filter((id) => id !== categoryId)
        : [...prev, categoryId]
    );
  };

  return (
    <div className="container mt-4">
      <h1 className="text-primary mb-4">Kursübersicht</h1>

      {/* Suchfeld und Filter-Button */}
      <div className="row mb-3 align-items-center">
        {/* Suchfeld links */}
        <div className="col-3">
          <input
            type="text"
            className="form-control"
            placeholder="Kurs suchen"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>

        {/* Filter-Button rechts */}
        <div className="col-3 offset-6 text-end position-relative">
          <div className="dropdown">
            <button
              className="btn btn-secondary dropdown-toggle w-100"
              type="button"
              id="categoryDropdown"
              data-bs-toggle="dropdown"
              aria-expanded="false"
            >
              Filter nach Kategorien
            </button>
            <ul className="dropdown-menu dropdown-menu-end position-absolute" style={{ right: 0 }}>
              {categories.map((category) => (
                <li key={category.category_id} className="dropdown-item">
                  <input
                    type="checkbox"
                    id={`category-${category.category_id}`}
                    value={category.category_id}
                    checked={selectedCategories.includes(category.category_id)}
                    onChange={() => handleCheckboxChange(category.category_id)}
                    className="form-check-input me-2"
                  />
                  <label htmlFor={`category-${category.category_id}`} className="form-check-label">
                    {category.category_name}
                  </label>
                </li>
              ))}
            </ul>
          </div>
        </div>
      </div>

      {/* Kurse anzeigen */}
      {loading && <div className="alert alert-info">Lade Kurse...</div>}
      {error && <div className="alert alert-danger">{error}</div>}
      {!loading && !error && (
        <div className="row">
          {filteredCourses.length > 0 ? (
            filteredCourses.map((course) => (
              <div className="col-md-4 mb-4" key={course.course_id}>
                <div className="card h-100">
                  <div className="card-body">
                    <h5 className="card-title text-primary text-center">{course.title}</h5>
                    <p className="card-text">{course.description}</p>
                  </div>
                </div>
              </div>
            ))
          ) : (
            <div className="col-12">
              <div className="alert alert-warning">Keine Kurse gefunden.</div>
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default CourseList;
