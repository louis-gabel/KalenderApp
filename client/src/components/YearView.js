import React from "react";
import FullCalendar from "@fullcalendar/react";
import dayGridPlugin from "@fullcalendar/daygrid";
import "../assets/YearView.css";

function YearView({ events, onMonthClick }) {
  // Berechnet die Monate im Jahr und teilt Events nach Monaten auf
  const months = Array.from({ length: 12 }, (_, i) => {
    // Korrekte Erstellung des Monatsstarts
    const now = new Date();
    const monthStart = new Date(now.getFullYear(), i + 1, 0); // Monat korrekt 0-basiert
    return monthStart; // Startdatum jedes Monats
  });

  // Events nach Monat filtern, nur Monat und Jahr werden berücksichtigt
  const eventsByMonth = months.map((monthStart) => {
    const monthEvents = events.filter((event) => {
      const eventDate = new Date(event.start); // Das Startdatum des Events
      // Vergleich nur von Monat und Jahr (ignoriere die Uhrzeit)
      return (
        eventDate.getMonth() === monthStart.getMonth() &&
        eventDate.getFullYear() === monthStart.getFullYear()
      );
    });
    return { monthStart, events: monthEvents };
  });

  return (
    <div className="year-grid">
      {eventsByMonth.map((monthData, index) => (
        <div
          className="month-tile"
          key={index}
          //onClick={() => onMonthClick(monthData.monthStart)} // Monat anklicken, um die Monatsansicht zu sehen
        >
          {/* Anzeige des Monats mit Jahr */}
          <h3>
            {monthData.monthStart.toLocaleString("default", { month: "long" })}{" "}
            {monthData.monthStart.getFullYear()}
          </h3>
          {/* FullCalendar für jeden Monat */}
          <FullCalendar
            plugins={[dayGridPlugin]}
            initialView="dayGridMonth"
            initialDate={monthData.monthStart.toISOString().split("T")[0]}
            aspectRatio={1}
            height={"auto"}
            locale={"en"}
            contentHeight={1}
            dayMaxEventRows={2}
            moreLinkClick={"popover"}
            headerToolbar={false} // Keine Header-Navigation in der Jahresansicht
            events={monthData.events} // Ereignisse für diesen Monat
            firstDay={1} // Wochen beginnen mit Montag
            fixedWeekCount={false}
            //showNonCurrentDates={false} // Nur Tage des aktuellen Monats anzeigen
            dayCellClassNames={(arg) => {
              const cellDate = new Date(arg.date); // Konvertiere arg.date in ein echtes Date-Objekt
              const today = new Date();
              // Prüfung, ob das Datum "heute" ist
              return cellDate.getDate() === today.getDate() &&
                cellDate.getMonth() === today.getMonth() &&
                cellDate.getFullYear() === today.getFullYear()
                ? "today-highlight" // CSS-Klasse für "heute"
                : "";
            }}
          />
        </div>
      ))}
    </div>
  );
}

export default YearView;
