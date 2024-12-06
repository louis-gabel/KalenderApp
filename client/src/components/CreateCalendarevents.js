import React, { useEffect, useState, useCallback } from "react";
import { useNavigate, useParams } from "react-router-dom";
import axios from "axios";

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
      setError("Error loading events.");
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
      alert("Please fill out all fields before submitting.");
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

      alert("All calendar events created successfully!");
    } catch (error) {
      console.error("Error creating calendar events:", error);
      alert("An error occurred while creating events.");
    }
  };

  // Load courses on the first render of the component
  useEffect(() => {
    fetchRooms(); // Load all rooms
  }, [fetchRooms]);

  return (
    <div className="add-events-container">
      <h1>Add Days for Session {sessionId}</h1>
      {error && <p className="error">{error}</p>}

      {/* Liste der zu erstellenden Events */}
      <div className="events-list">
        {eventsData.map((event, index) => (
          <div key={index} className="event-form">
            <h3>Session Day {index + 1}</h3>
            <label>
              Date & Start Time:
              <input
                type="date"
                value={event.start_time}
                onChange={(e) =>
                  updateEvent(index, "start_time", e.target.value)
                }
              />
            </label>
            <label>
              End Time:
              <input
                type="time"
                value={event.end_time}
                onChange={(e) => updateEvent(index, "end_time", e.target.value)}
              />
            </label>

            {/* Dropdown for rooms */}
            <select
              value={rooms.room_id}
              onChange={(e) => updateEvent(index, "room_id", e.target.value)}
              required
            >
              <option value="">Select Room</option>

              {rooms.map((room) => {
                // Filter the course sessions that belong to this event
                return (
                  <option key={room.room_id} value={room.room_id}>
                    {room.room_name}
                  </option>
                );
              })}
            </select>
            <button onClick={() => removeEvent(index)}>Remove</button>
          </div>
        ))}
      </div>

      {/* Buttons */}
      <div className="actions">
        <div>
          <button onClick={addNewEvent}>Add new day for session</button>
          <button onClick={handleSubmit}>Submit All Events</button>
        </div>
      </div>
    </div>
  );
};

export default AddCalendarEvents;
