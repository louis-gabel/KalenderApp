import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom"; // Importiere useNavigate
import FullCalendar from "@fullcalendar/react";
import dayGridPlugin from "@fullcalendar/daygrid";
import timeGridPlugin from "@fullcalendar/timegrid";
import interactionPlugin from "@fullcalendar/interaction";
import axios from "axios";
import YearView from "./YearView";

function Calendar() {
  const [view, setView] = useState("year"); // Aktive Ansicht
  const [events, setEvents] = useState([]);
  const navigate = useNavigate();
  const API_URL = process.env.REACT_APP_API_URL;

  useEffect(() => {
    const token = localStorage.getItem("token"); // Token for authentication
    const user_id = localStorage.getItem("id"); // User_ID for identification

    // Daten von der API laden
    axios
      .get(`${API_URL}/calendar/calendarevents`, {
        headers: { Authorization: `Bearer ${token}` },
        params: { user_id }, // Query-Parameter für die User-ID
      })
      .then((response) => {
        const loadedEvents = response.data.map((event) => ({
          title: `${event.course_title}`,
          start: event.start_time,
          end: event.end_time,
          roomName: event.room_name,
        }));
        setEvents(loadedEvents); // Events im State speichern
      })
      .catch((error) => console.error("Fehler beim Laden der Events:", error));
  }, [API_URL]);

  // Ansicht basierend auf dem Zustand rendern
  const renderView = () => {
    if (view === "year") {
      return (
        <YearView
          events={events} // Event-Daten aus dem Backend
          onMonthClick={(monthStart) => setView("month", monthStart)} // Ansicht ändern
        />
      );
    } else {
      return (
        <FullCalendar
          plugins={[dayGridPlugin, timeGridPlugin, interactionPlugin]}
          initialView={
            view === "day"
              ? "timeGridDay"
              : view === "week"
              ? "timeGridWeek"
              : view === "month"
              ? "dayGridMonth"
              : "listWeek"
          } // Ansicht je nach Status
          key={view} // Neu-Rendern bei Ansichtwechsel erzwingen
          firstDay={1} // Woche startet am Montag
          aspectRatio={2.7}
          slotMinTime={"06:00:00"}
          slotMaxTime={"20:00:00"}
          //eventTimeFormat={}
          slotLabelFormat={{
            hour: "2-digit",
            minute: "2-digit",
            hour12: false, // 24-Stunden-Format
          }}
          dayHeaderFormat={{
            weekday: "short", // Kurzer Wochentag (z.B. Mon, Tue)
            day: "2-digit", // Zweistelliges Datum
            month: "2-digit", // Zweistelliger Monat
          }}
          contentHeight="auto"
          dayMaxEventRows={3}
          allDaySlot={false}
          navLinks={true}
          nowIndicator={true}
          events={events} // Events hinzufügen
        />
      );
    }
  };

  return (
    <div className="container mt-4">
      {/* Buttons für Ansicht */}
      <div className="d-flex justify-content-center mb-4">
        <button
          className="btn btn-secondary mx-2"
          onClick={() => navigate("/list")}
        >
          List
        </button>
        <button
          className="btn btn-secondary mx-2"
          onClick={() => setView("day")}
        >
          Day
        </button>
        <button
          className="btn btn-secondary mx-2"
          onClick={() => setView("week")}
        >
          Week
        </button>
        <button
          className="btn btn-secondary mx-2"
          onClick={() => setView("month")}
        >
          Month
        </button>
        <button
          className="btn btn-secondary mx-2"
          onClick={() => setView("year")}
        >
          Year
        </button>
      </div>

      {/* Kalenderansicht */}
      <div className="calendar-container">{renderView()}</div>
    </div>
  );
}

export default Calendar;
