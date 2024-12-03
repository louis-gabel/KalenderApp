import React, { useEffect, useState, useCallback } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import "../assets/admin_dashboard.css"; // own CSS file

const AdminDashboard = () => {
  const [events, setEvents] = useState([]); // list of events
  const [categories, setCategories] = useState([]); // list of categories
  const [error, setError] = useState(""); // error message
  const [dozents, setDozents] = useState([]); // list of dozents

  const navigate = useNavigate();

  const [newCourse, setNewCourse] = useState({
    title: "",
    description: "",
    category_id: "",
    max_participants: "",
    duration: "",
  }); // new course data

  // API URL
  const API_URL = process.env.REACT_APP_API_URL;

  // Wrap fetchCourses function in useCallback to prevent unnecessary re-renders
  const fetchCourses = useCallback(async () => {
    try {
      const token = localStorage.getItem("token"); // Token for authentication
      const response = await axios.get(`${API_URL}/courses`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setEvents(response.data); // Set loaded courses
    } catch (err) {
      setError("Error loading events.");
    }
  }, [API_URL]);

  const fetchCategories = useCallback(async () => {
    try {
      const token = localStorage.getItem("token"); // Token for authentication
      const response = await axios.get(`${API_URL}/category`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setCategories(response.data); // Set loaded categories
    } catch (err) {
      setError("Error loading categories.");
    }
  }, [API_URL]);

  // load dozents
  const fetchDozents = useCallback(async () => {
    try {
      const token = localStorage.getItem("token"); // Token for authentication
      const response = await axios.get(`${API_URL}/user/dozent`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setDozents(response.data); // Set loaded dozents
    } catch (err) {
      setError("Error loading dozents.");
    }
  }, [API_URL]);

  const createCourse = async () => {
    try {
      const token = localStorage.getItem("token");
      await axios.post(
        `${API_URL}/courses`,
        newCourse, // course data
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );
      // Successfully created: reload course list
      fetchCourses();
      setNewCourse({
        title: "",
        description: "",
        category_id: "",
        max_participants: "",
        duration: "",
      }); // reset form
    } catch (err) {
      setError("Error creating course.");
    }
  };

  // delete an event from the server
  const deleteEvent = async (course_id) => {
    try {
      const token = localStorage.getItem("token");
      await axios.delete(`${API_URL}/courses/${course_id}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setEvents(events.filter((event) => event.course_id !== course_id)); // Removes the deleted event
    } catch (err) {
      setError("Error deleting event.");
    }
  };

  // Confirmation before deleting a course
  const confirmDelete = (eventId) => {
    if (window.confirm("Are you sure you want to delete this event?")) {
      deleteEvent(eventId);
    }
  };

  // Load courses on the first render of the component
  useEffect(() => {
    fetchCourses();
    fetchCategories(); // Load categories on render
    fetchDozents(); // Load dozents on render
  }, [fetchCourses, fetchCategories, fetchDozents]);

  return (
    <div className="admin-container">
      <h1>Admin Dashboard</h1>
      {error && <p className="error">{error}</p>}

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

      {/* Form for adding a new course */}
      <div className="create-course-form">
        <h2>Add New Course</h2>
        <form onSubmit={createCourse}>
          <input
            type="text"
            placeholder="Title"
            value={newCourse.title}
            onChange={(e) =>
              setNewCourse({ ...newCourse, title: e.target.value })
            }
            required
          />
          <textarea
            placeholder="Description"
            value={newCourse.description}
            onChange={(e) =>
              setNewCourse({ ...newCourse, description: e.target.value })
            }
            required
          />
          <input
            type="number"
            placeholder="Max Participants"
            value={newCourse.max_participants}
            onChange={(e) =>
              setNewCourse({ ...newCourse, max_participants: e.target.value })
            }
            required
          />
          <input
            type="number"
            placeholder="Duration (in hours)"
            value={newCourse.duration}
            onChange={(e) =>
              setNewCourse({ ...newCourse, duration: e.target.value })
            }
            required
          />
          {/* Dropdown for categories */}
          <select
            value={newCourse.category_id}
            onChange={(e) =>
              setNewCourse({ ...newCourse, category_id: e.target.value })
            }
            required
          >
            <option value="">Select Category</option>
            {categories.map((category) => (
              <option key={category.category_id} value={category.category_id}>
                {category.category_name}
              </option>
            ))}
          </select>
          {/* Dropdown for dozents */}
          <select
            value={newCourse.user_id}
            onChange={(e) =>
              setNewCourse({ ...newCourse, user_id: e.target.value })
            }
            required
          >
            <option value="">Select dozent who teaches this course</option>
            {dozents.map((user) => (
              <option key={user.user_id} value={user.user_id}>
                {user.prename + " " + user.surname}
              </option>
            ))}
          </select>
          <button onClick={createCourse}>Create Course</button>
        </form>
      </div>
    </div>
  );
};

export default AdminDashboard;
