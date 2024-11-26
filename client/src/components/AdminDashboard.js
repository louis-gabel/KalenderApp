import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import "../assets/admin_dashboard.css"; // own CSS file

const AdminDashboard = () => {
  const [events, setEvents] = useState([]); // Liste der Veranstaltungen
  const [error, setError] = useState(""); // Fehlernachrichten
  const navigate = useNavigate();

  // load events from the server
  const fetchCourses = async () => {
    try {
      const token = localStorage.getItem("token"); // Token for authentication
      const response = await axios.get(
        `${process.env.REACT_APP_API_URL}/events`,
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );
      setEvents(response.data); // Sets the loaded events
    } catch (err) {
      setError("Error loading events.");
    }
  };

  // delte an event from the server
  const deleteEvent = async (course_id) => {
    try {
      const token = localStorage.getItem("token");
      await axios.delete(
        `${process.env.REACT_APP_API_URL}/events/${course_id}`,
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );
      setEvents(events.filter((event) => event.course_id !== course_id)); // Entfernt die gelöschte Veranstaltung
    } catch (err) {
      setError("Fehler beim Löschen der Veranstaltung.");
    }
  };

  // load events when the component is rendered
  useEffect(() => {
    fetchCourses();
  }, []);

  const confirmDelete = (eventId) => {
    if (window.confirm("Möchten Sie diese Veranstaltung wirklich löschen?")) {
      deleteEvent(eventId);
    }
  };

  return (
    <div className="admin-container">
      <h1>Admin-Dashboard</h1>
      {error && <p className="error">{error}</p>}
      <table className="events-table">
        <thead>
          <tr>
            <th>ID</th>
            <th>Category</th>
            <th>Titel</th>
            <th>Optionen</th>
          </tr>
        </thead>
        <tbody>
          {events.map((event) => (
            <tr key={event.course_id}>
              <td>{event.course_id}</td>
              <td>{event.category_id}</td>
              <td>
                {event.title}
                <br />
                <span className="event-category">
                  {"Beschreibung: " + event.description}
                  <br />
                  {"Maximale Studentenanzahl: " + event.max_participants}
                  <br />
                  {"Dauer: " + event.duration + " Stunden"}
                </span>
              </td>
              <td>
                <button onClick={() => navigate(`/events/${event.course_id}`)}>
                  Bearbeiten
                </button>
                <button onClick={() => confirmDelete(event.course_id)}>
                  Löschen
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
