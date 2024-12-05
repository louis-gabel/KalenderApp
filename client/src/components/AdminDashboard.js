import React, { useEffect, useState, useCallback } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import "../assets/admin_dashboard.css"; // own CSS file

const AdminDashboard = () => {
  const [events, setEvents] = useState([]); // List of events
  const [categories, setCategories] = useState([]); // List of categories
  const [error, setError] = useState(""); // Error message

  const navigate = useNavigate();

  const API_URL = process.env.REACT_APP_API_URL;

  // Load courses
  const fetchCourses = useCallback(async () => {
    try {
      const token = localStorage.getItem("token");
      const response = await axios.get(`${API_URL}/courses`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setEvents(response.data);
    } catch (err) {
      setError("Error loading events.");
    }
  }, [API_URL]);

  // Load categories
  const fetchCategories = useCallback(async () => {
    try {
      const token = localStorage.getItem("token");
      const response = await axios.get(`${API_URL}/category`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setCategories(response.data);
    } catch (err) {
      setError("Error loading categories.");
    }
  }, [API_URL]);

  // Delete event
  const deleteEvent = async (course_id) => {
    try {
      const token = localStorage.getItem("token");
      await axios.delete(`${API_URL}/courses/${course_id}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setEvents(events.filter((event) => event.course_id !== course_id));
    } catch (err) {
      setError("Error deleting event.");
    }
  };

  // Confirmation dialog for deleting an event
  const confirmDelete = (eventId) => {
    if (window.confirm("Are you sure you want to delete this event?")) {
      deleteEvent(eventId);
    }
  };

  // Fetch courses and categories when the dashboard loads
  useEffect(() => {
    fetchCourses();
    fetchCategories();
  }, [fetchCourses, fetchCategories]);

  return (
    <div className="admin-container">
      <h1>Admin Dashboard</h1>
      {error && <p className="error">{error}</p>}

      <button
        className="create-course-button"
        onClick={() => navigate("/courses/new")}
      >
        Create New Course
      </button>

      <table className="events-table">
        <thead>
          <tr>
            <th>ID</th>
            <th>Category</th>
            <th>Title</th>
            <th>Options</th>
          </tr>
        </thead>
        <tbody>
          {events.map((event) => (
            <tr key={event.course_id}>
              <td>{event.course_id}</td>
              <td>
                {categories.find((cat) => cat.category_id === event.category_id)
                  ?.category_name || "Unknown"}
              </td>
              <td>
                {event.title}
                <br />
                <span className="event-category">
                  {"Description: " + event.description}
                  <br />
                  {"Max Participants: " + event.max_participants}
                  <br />
                  {"Duration: " + event.duration + " hours"}
                </span>
              </td>
              <td>
                <button onClick={() => navigate(`/courses/${event.course_id}`)}>
                  Edit
                </button>
                <button onClick={() => confirmDelete(event.course_id)}>
                  Delete
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default AdminDashboard;
