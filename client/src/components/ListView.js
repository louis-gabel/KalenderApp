// src/components/ListView.js
import React, { useState, useEffect } from "react";
import axios from "axios";
import "../assets/ListView.css";

function ListView() {
  const [events, setEvents] = useState([]);

  useEffect(() => {
    // Daten von der API laden
    axios
      .get("http://localhost:5000/api/calendar/calendarevents")
      .then((response) => {
        const loadedEvents = response.data.map((event) => ({
          title: `Room ${event.room_id}`,
          start: new Date(event.start_time).toLocaleString(),
          end: new Date(event.end_time).toLocaleString(),
        }));
        setEvents(loadedEvents);
      })
      .catch((error) => console.error("Fehler beim Laden der Events:", error));
  }, []);

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
