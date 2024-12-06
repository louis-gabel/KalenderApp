// src/components/ListView.js
import React, { useState, useEffect } from "react";
import axios from "axios";
import "../assets/ListView.css";

function ListView() {
  const [events, setEvents] = useState([]);
  const API_URL = process.env.REACT_APP_API_URL;

  useEffect(() => {
    const token = localStorage.getItem("token");
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
    <div className="list-view">
      <h2>Event List</h2>
      {events.length === 0 ? (
        <p>No events available.</p>
      ) : (
        <ul>
          {events.map((event, index) => (
            <li key={index}>
              <strong>{event.title}</strong>
              <br />
              <span>Teacher: {event.teacher}</span>
              <br />
              <span>Start: {event.start}</span>
              <br />
              <span>End: {event.end}</span>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}

export default ListView;
