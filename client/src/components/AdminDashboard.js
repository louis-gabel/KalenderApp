import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import "../assets/admin_dashboard.css"; // own CSS file

const AdminDashboard = () => {
  const [events, setEvents] = useState([]); // Liste der Veranstaltungen
  const [error, setError] = useState(""); // Fehlernachrichten
  const navigate = useNavigate();

  // load events from the server
  const fetchEvents = async () => {
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
  const deleteEvent = async (eventId) => {
    try {
      const token = localStorage.getItem("token");
      await axios.delete(`${process.env.REACT_APP_API_URL}/events/${eventId}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setEvents(events.filter((event) => event.id !== eventId)); // Entfernt die gelöschte Veranstaltung
    } catch (err) {
      setError("Fehler beim Löschen der Veranstaltung.");
    }
  };

  // load events when the component is rendered
  useEffect(() => {
    fetchEvents();
  }, []);

  return (
    <div className="admin-container">
      <h1>Admin-Dashboard</h1>
      {error && <p className="error">{error}</p>}
      <table className="events-table">
        <thead>
          <tr>
            <th>ID</th>
            <th>Titel</th>
            <th>Datum</th>
            <th>Optionen</th>
          </tr>
        </thead>
        <tbody>
          {events.map((event) => (
            <tr key={event.id}>
              <td>{event.id}</td>
              <td>{event.title}</td>
              <td>{new Date(event.date).toLocaleDateString()}</td>
              <td>
                <button onClick={() => navigate(`/events/${event.id}`)}>
                  Details
                </button>
                <button onClick={() => deleteEvent(event.id)}>Löschen</button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default AdminDashboard;
