import React, { useState, useEffect } from "react";
import FullCalendar from "@fullcalendar/react";
import dayGridPlugin from "@fullcalendar/daygrid";
import timeGridPlugin from "@fullcalendar/timegrid";
import interactionPlugin from "@fullcalendar/interaction";
import axios from "axios";

function Calendar({ view, initialDate }) {
  const [events, setEvents] = useState([]);

  useEffect(() => {
    // Daten von der API laden
    axios.get("http://localhost:3000/events")
      .then((response) => {
        const loadedEvents = response.data.map((event) => ({
          title: event.title,
          start: event.event_date,
        }));
        setEvents(loadedEvents);
      })
      .catch((error) => console.error("Fehler beim Laden der Events:", error));
  }, []);

  return (
    <FullCalendar
      plugins={[dayGridPlugin, timeGridPlugin, interactionPlugin]}
      initialView={view} // Ansicht wird dynamisch durch den `view`-Prop geändert
      initialDate={initialDate}
      firstDay={1}
      aspectRatio={2.7}
      contentHeight= "auto"
      events={events} // Ereignisse anzeigen
      // customButtons={{
      //   yearButton: {
      //     text: "year", // Text des Buttons
      //     click: () => setView("year"), // Wechsel zu YearView
      //   },
      // }}
      headerToolbar={{
        start: "prev,next today",
        center: "title",
        end: "dayGridMonth,timeGridWeek,dayGridYear",
      }}
    />
  );
}

export default Calendar;
