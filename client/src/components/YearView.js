import React from "react";
import FullCalendar from "@fullcalendar/react";
import dayGridPlugin from "@fullcalendar/daygrid";
import "./YearView.css";

function YearView({ onMonthClick }) {
  const months = Array.from({ length: 12 }, (_, i) => {
    const monthStart = new Date(new Date().getFullYear(), i, 1);
    return monthStart; // Startdatum jedes Monats
  });

  return (
    <div className="year-grid">
      {months.map((monthStart, index) => (
        <div
          className="month-tile"
          key={index}
          onClick={() => onMonthClick(monthStart)} // Navigation auslösen
        >
          <h3>{monthStart.toLocaleString("default", { month: "long" })}</h3>
          <FullCalendar
            plugins={[dayGridPlugin]}
            initialView="dayGridMonth"
            initialDate={monthStart.toISOString().split("T")[0]}
            aspectRatio={1}
            headerToolbar={false} // Navigation in Kacheln deaktivieren
          />
        </div>
      ))}
    </div>
  );
}

export default YearView;
