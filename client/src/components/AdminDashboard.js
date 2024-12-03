import React, { useEffect, useState, useCallback } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import "../assets/admin_dashboard.css"; // own CSS file

const AdminDashboard = () => {
  const [events, setEvents] = useState([]); // list of events
  const [categories, setCategories] = useState([]); // Liste der Kategorien
  const [error, setError] = useState(""); // error message
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

  // Fetch-Kurse Funktion in useCallback umhüllen, um unnötige Neurender zu verhindern
  const fetchCourses = useCallback(async () => {
    try {
      const token = localStorage.getItem("token"); // Token für Authentifizierung
      const response = await axios.get(`${API_URL}/courses`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setEvents(response.data); // Geladene Kurse setzen
    } catch (err) {
      setError("Fehler beim Laden der Veranstaltungen.");
    }
  }, [API_URL]);

  const fetchCategories = useCallback(async () => {
    try {
      const token = localStorage.getItem("token"); // Token für Authentifizierung
      const response = await axios.get(`${API_URL}/category`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setCategories(response.data); // Geladene Kategorien setzen
    } catch (err) {
      setError("Fehler beim Laden der Kategorien.");
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

  // Bestätigung vor dem Löschen eines Kurses
  const confirmDelete = (eventId) => {
    if (window.confirm("Möchten Sie diese Veranstaltung wirklich löschen?")) {
      deleteEvent(eventId);
    }
  };

  // Lädt Kurse bei der ersten Rendern des Components
  useEffect(() => {
    fetchCourses();
    fetchCategories(); // Kategorien beim Rendern laden
  }, [fetchCourses, fetchCategories]);

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
                  ?.category_name || "Unbekannt"}
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

      {/* Formular für das Hinzufügen eines neuen Kurses */}
      <div className="create-course-form">
        <h2>Neuen Kurs hinzufügen</h2>
        <form onSubmit={createCourse}>
          <input
            type="text"
            placeholder="Titel"
            value={newCourse.title}
            onChange={(e) =>
              setNewCourse({ ...newCourse, title: e.target.value })
            }
            required
          />
          <textarea
            placeholder="Beschreibung"
            value={newCourse.description}
            onChange={(e) =>
              setNewCourse({ ...newCourse, description: e.target.value })
            }
            required
          />
          <input
            type="number"
            placeholder="Maximale Teilnehmerzahl"
            value={newCourse.max_participants}
            onChange={(e) =>
              setNewCourse({ ...newCourse, max_participants: e.target.value })
            }
            required
          />
          <input
            type="number"
            placeholder="Dauer (in Stunden)"
            value={newCourse.duration}
            onChange={(e) =>
              setNewCourse({ ...newCourse, duration: e.target.value })
            }
            required
          />
          {/* Dropdown für Kategorien */}
          <select
            value={newCourse.category_id}
            onChange={(e) =>
              setNewCourse({ ...newCourse, category_id: e.target.value })
            }
            required
          >
            <option value="">Kategorie auswählen</option>
            {categories.map((category) => (
              <option key={category.category_id} value={category.category_id}>
                {category.category_name}
              </option>
            ))}
          </select>
          <button onClick={createCourse}>Kurs erstellen</button>
        </form>
      </div>
    </div>
  );
};

export default AdminDashboard;
