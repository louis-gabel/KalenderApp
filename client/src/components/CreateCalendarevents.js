import React, { useEffect, useState, useCallback } from "react";
import { useNavigate, useParams } from "react-router-dom";
import axios from "axios";
import "../assets/admin_dashboard.css";

const AddCalendarEvents = () => {
  const { sessionId } = useParams(); // ID der Session aus der URL
  const [eventsData, setEventsData] = useState([]);
  const [error, setError] = useState("");
  const navigate = useNavigate();
  const [rooms, setRooms] = useState([]); // list of events

  const API_URL = process.env.REACT_APP_API_URL;

  const fetchRooms = useCallback(async () => {
    try {
      const token = localStorage.getItem("token"); // Token for authentication
      const response = await axios.get(`${API_URL}/room`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setRooms(response.data); // Set loaded courses
    } catch (err) {
      setError("Fehler beim Laden der Räume.");
    }
  }, [API_URL]);

  // Hinzufügen eines neuen Events in die Liste
  const addNewEvent = () => {
    setEventsData([
      ...eventsData,
      {
        session_id: sessionId,
        user_id: "",
        start_time: "",
        end_time: "",
        room_id: "",
      },
    ]);
  };

  const updateEvent = (index, updatedEvent) => {
    setEventsData(
      eventsData.map((event, i) => (i === index ? updatedEvent : event))
    );
  };

  const removeEvent = (index) => {
    setEventsData(eventsData.filter((_, i) => i !== index));
  };
  const handleSubmit = async () => {
    if (
      !eventsData.every(
        (event) => event.start_time && event.end_time && event.room_id
      )
    ) {
      alert("Bitte füllen Sie alle Felder aus, bevor Sie absenden.");
      return;
    }

    // Set session_id for all events
    const updatedEvents = eventsData.map((event) => ({
      ...event,
      session_id: sessionId, // ID der Session, z. B. aus der URL oder einem Zustand
    }));

    await createCalendarEvents(updatedEvents); // Funktion zum Senden der POST-Anfragen
    navigate(`/dozent`);
  };

  const createCalendarEvents = async (eventsData) => {
    const token = localStorage.getItem("token");
    const userID = localStorage.getItem("id");
    try {
      // Map over eventsData and create all events
      await Promise.all(
        eventsData.map(async (event) => {
          await axios.post(
            `${API_URL}/calendarevents`,
            {
              session_id: sessionId,
              user_id: userID,
              start_time: event.start_time,
              end_time: event.end_time,
              room_id: event.room_id,
            },
            {
              headers: { Authorization: `Bearer ${token}` },
            }
          );
        })
      );

      alert("Alle Kalendereinträge wurden erfolgreich erstellt!");
    } catch (error) {
      console.error("Fehler beim Erstellen der Kalendereinträge:", error);
      alert("Beim Erstellen der Einträge ist ein Fehler aufgetreten.");
    }
  };

  // Load courses on the first render of the component
  useEffect(() => {
    fetchRooms(); // Load all rooms
  }, [fetchRooms]);

  return (
    <div
      className="container mt-4 edit-course-container add-events-container"
      style={{ backgroundColor: "#eee" }}
    >
      <h1>Tage für Session {sessionId} hinzufügen</h1>
      {error && <p className="error">{error}</p>}

      {/* Liste der zu erstellenden Events */}
      <div className="events-list">
        {eventsData.map((event, index) => (
          <div
            key={index}
            className="event-form mb-4 p-3"
            style={{
              border: "1px solid #ddd",
              borderRadius: "8px",
              backgroundColor: "#fff",
            }}
          >
            <h3 style={{ color: "#034875" }}>Session Tag {index + 1}</h3>
            <div className="mb-3">
              <label className="form-label">Datum & Startzeit:</label>
              <input
                type="datetime-local"
                className="form-control"
                value={event.start_time}
                onChange={(e) =>
                  updateEvent(index, "start_time", e.target.value)
                }
              />
            </div>
            <div className="mb-3">
              <label className="form-label">Endzeit:</label>
              <input
                type="time"
                className="form-control"
                value={event.end_time}
                onChange={(e) => updateEvent(index, "end_time", e.target.value)}
              />
            </div>
            <div className="mb-3">
              <label className="form-label">Raum auswählen:</label>
              <select
                className="form-select"
                value={event.room_id}
                onChange={(e) => updateEvent(index, "room_id", e.target.value)}
                required
              >
                <option value="">Raum auswählen</option>
                {rooms.map((room) => (
                  <option key={room.room_id} value={room.room_id}>
                    {room.room_name}
                  </option>
                ))}
              </select>
            </div>
            <button
              className="btn btn-danger w-100"
              onClick={() => removeEvent(index)}
            >
              Entfernen
            </button>
          </div>
        ))}
      </div>

      {/* Buttons */}
      <div className="actions d-flex justify-content-between mt-4">
        <button className="btn btn-secondary" onClick={addNewEvent}>
          Neuen Tag für Session hinzufügen
        </button>
      </div>
      <div className="actions d-flex justify-content-between mt-4">
        <button className="btn btn-primary" onClick={handleSubmit}>
          Alle Events absenden
        </button>
      </div>
    </div>
  );
};

export default AddCalendarEvents;
