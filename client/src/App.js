import React, { useState } from "react";
import {
  BrowserRouter as Router,
  Routes,
  Route,
  Navigate,
} from "react-router-dom";
import YearView from "./components/YearView";
import Calendar from "./components/Calendar";

import Login from "./components/Login"; // Login-Seite importieren
import Register from "./components/Register";

import "./components/YearView.css";

function CalendarApp() {
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

// Funktion, um zu prüfen, ob ein Benutzer eingeloggt ist
const isAuthenticated = () => {
  return !!localStorage.getItem("token"); // Prüfe auf ein gespeichertes Token
};

function App() {
  return (
    <Router>
      <Routes>
        {/* Login-Seite */}
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        {/* Kalender-Seite: Nur zugänglich, wenn authentifiziert */}
        <Route
          path="/calendar"
          element={
            isAuthenticated() ? (
              <Calendar />
            ) : (
              <Navigate to="/login" replace /> // Weiterleitung zur Login-Seite
            )
          }
        />

        {/* Standard-Route */}
        <Route path="*" element={<Navigate to="/login" replace />} />
      </Routes>
    </Router>
  );
}

export default App;
