import React, { useState } from "react";
import {
  BrowserRouter as Router,
  Routes,
  Route,
  Navigate,
} from "react-router-dom";
import Calendar from "./components/Calendar";

import Login from "./components/Login"; // Login-Seite importieren
import Register from "./components/Register";
import AdminDashboard from "./components/AdminDashboard";

import "./components/YearView.css";

// Funktion, um zu prüfen, ob ein Benutzer eingeloggt ist
const isAuthenticated = () => {
  return !!localStorage.getItem("token"); // Prüfe auf ein gespeichertes Token
};

function App() {
  return (
    <Router>
      <Routes>
        {/* Define Routes to sites */}
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route path="/admin" element={<AdminDashboard />} />
        {/* Define Route to calenadar site: Kalender-Seite: Nur zugänglich, wenn authentifiziert */}
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
