import React, { useEffect, useState, useCallback } from "react";
import { useNavigate, useParams } from "react-router-dom";
import axios from "axios";
import "../assets/admin_dashboard.css";
import moment from "moment";

const AddCalendarEvents = () => {
  const { id } = useParams(); // ID der Session aus der URL
  console.log(id);
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
    }));

    await createCalendarEvents(updatedEvents); // Funktion zum Senden der POST-Anfragen
    navigate(`/dozent`);
  };

  const createCalendarEvents = async (eventsData) => {
    const token = localStorage.getItem("token");
    const time_format = "YYYY-MM-DD HH:mm:ss";

    try {
      // Bereite die Events vor
      const formattedEvents = eventsData.map((event) => {
        const start_time = moment(event.start_time);
        const end_time = moment(event.end_time, "HH:mm").set({
          year: start_time.year(),
          month: start_time.month(),
          date: start_time.date(),
        });

        return {
          start_time: start_time.format(time_format), // Formatiere die start_time
          end_time: end_time.format(time_format), // Formatiere die end_time
          room_id: event.room_id,
        };
      });
      console.log("Sending POST request with data:", {
        sessionId: id,
        events: formattedEvents,
      });
      // Führe eine einzige POST-Anfrage aus
      await axios.post(
        `${API_URL}/teachercalendarevents/create`,
        {
          sessionId: id,
          events: formattedEvents,
        },
        {
          headers: { Authorization: `Bearer ${token}` },
        }
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
      <h1>Tage für Session {id} hinzufügen</h1>
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
                  updateEvent(index, { ...event, start_time: e.target.value })
                }
              />
            </div>
            <div className="mb-3">
              <label className="form-label">Endzeit:</label>
              <input
                type="time"
                className="form-control"
                value={event.end_time}
                onChange={(e) =>
                  updateEvent(index, { ...event, end_time: e.target.value })
                }
              />
            </div>
            <div className="mb-3">
              <label className="form-label">Raum auswählen:</label>
              <select
                className="form-select"
                value={event.room_id}
                onChange={(e) =>
                  updateEvent(index, { ...event, room_id: e.target.value })
                }
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
