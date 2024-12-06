// src/components/ListView.js
import React, { useState, useEffect } from "react";
import axios from "axios";
import { Link } from "react-router-dom";
import "../assets/ListView.css"; // Optional, wenn eigene Styles benötigt werden

function ListView() {
  const [events, setEvents] = useState([]);
  const API_URL = process.env.REACT_APP_API_URL;

  useEffect(() => {
    // Daten von der API laden
    const token = localStorage.getItem("token"); // Token for authentication
    const user_id = localStorage.getItem("id"); // User_ID for identification

    axios
      .get(`${API_URL}/calendar/calendarevents`, {
        headers: { Authorization: `Bearer ${token}` },
        params: { user_id }, // Query-Parameter für die User-ID
      })
      .then((response) => {
        const loadedEvents = response.data.map((event) => ({
          title: ` ${event.course_title}`,
          teacher: ` ${event.teacher_title} ${event.teacher_prename} ${event.teacher_surname}`,
          start: new Date(event.start_time).toLocaleString("de-DE", {
            day: "2-digit",
            month: "2-digit",
            year: "numeric",
            hour: "2-digit",
            minute: "2-digit",
            hour12: false,
          }),
          end: new Date(event.end_time).toLocaleString("de-DE", {
            day: "2-digit",
            month: "2-digit",
            year: "numeric",
            hour: "2-digit",
            minute: "2-digit",
            hour12: false,
          }),
        }));
        setEvents(loadedEvents);
      })
      .catch((error) => console.error("Fehler beim Laden der Events:", error));
  }, [API_URL]);

  return (
    <div className="container mt-4">
      {/* Button to switch to Year View */}
      <button className="btn btn-secondary mb-3">
        <Link to="/calendar" className="text-white text-decoration-none">
          Zurück zur Kalenderansicht
        </Link>
      </button>

      <h2>Eventliste</h2>

      {/* Check if there are no events */}
      {events.length === 0 ? (
        <p>Keine Events verfügbar.</p>
      ) : (
        <ul className="list-group">
          {/* Mapping events into a list */}
          {events.map((event, index) => (
            <li key={index} className="list-group-item mb-3">
              <h5 className="mb-2">{event.title}</h5>
              <p className="mb-1">
                <strong>Dozent:</strong> {event.teacher}
              </p>
              <p className="mb-1">
                <strong>Start:</strong> {event.start}
              </p>
              <p className="mb-1">
                <strong>Ende:</strong> {event.end}
              </p>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}

export default ListView;
