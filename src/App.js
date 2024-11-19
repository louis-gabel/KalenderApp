import React, { useState } from "react";
import YearView from "./components/YearView";
import Calendar from "./components/Calendar";
import "./components/YearView.css";

function App() {
  const [view, setView] = useState("year"); // Standardansicht: Jahr
  const [selectedDate, setSelectedDate] = useState(new Date());

  return (
    <div className="App">
      <header>
        <h1>Kalender App</h1>
        <nav>
          <button onClick={() => setView("year")}>Jahresansicht</button>
          <button onClick={() => setView("month")}>Monatsansicht</button>
          <button onClick={() => setView("week")}>Wochenansicht</button>
        </nav>
      </header>
      {view === "year" && (
        <YearView
          onMonthClick={(date) => {
            setSelectedDate(date); // Ausgewähltes Datum setzen
            setView("month"); // Zur Monatsansicht wechseln
          }}
        />
      )}
      {view === "month" && <Calendar initialDate={selectedDate} />}
      {view === "week" && <Calendar view="timeGridWeek" />}
    </div>
  );
}

export default App;
