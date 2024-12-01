import React, { useState } from "react";
import {
  BrowserRouter as Router,
  Routes,
  Route,
  Link,
  Navigate,
} from "react-router-dom";
import Calendar from "./components/Calendar";
import ListView from "./components/ListView";
import CourseSessionList from "./components/CourseSessionList";
import EnrollPage from "./components/EnrollPage";
import HelpSite from "./components/HelpSite";
import CourseList from "./components/CourseList";
import Login from "./components/Login";
import Register from "./components/Register";
import AdminDashboard from "./components/AdminDashboard";
import "./assets/App.css";

const API = process.env.REACT_APP_API_URL;

// Funktion, um zu prüfen, ob ein Benutzer eingeloggt ist
const isAuthenticated = () => {
  return !!localStorage.getItem("token"); // Prüfe auf ein gespeichertes Token
};

const ProtectedRoute = ({ element }) => {
  // Wenn der Benutzer nicht authentifiziert ist, wird er zur Login-Seite weitergeleitet
  if (!isAuthenticated()) {
    return <Navigate to="/login" replace />;
  }

  // Wenn authentifiziert, wird die angeforderte Komponente angezeigt
  return element;
};

const logout = () => {
  // Entfernen des Tokens aus dem localStorage
  localStorage.removeItem("token");
};

function App() {
  const [menuOpen, setMenuOpen] = useState(false); // Zustand für das Menü

  const toggleMenu = () => setMenuOpen(!menuOpen); // Menü öffnen/schließen

  return (
    <Router>
      <div>
        {/* Navigation nur anzeigen, wenn der Benutzer eingeloggt ist */}
        <nav className="navbar">
          <button className="menu-button" onClick={toggleMenu}>
            ☰ {/* Menü-Icon */}
          </button>
          <ul className={`nav-links ${menuOpen ? "open" : ""}`}>
            <li>
              <Link to="/calendar" onClick={toggleMenu}>
                Calendar View
              </Link>
            </li>
            <li>
              <Link to="/sessions" onClick={toggleMenu}>
                Course Sessions
              </Link>
            </li>
            <li>
              <Link to="/courses" onClick={toggleMenu}>
                Courses
              </Link>
            </li>
            <li>
              <Link to="/help" onClick={toggleMenu}>
                Help
              </Link>
            </li>
            <li>
              <Link
                to="/login"
                onClick={() => {
                  toggleMenu();
                  logout();
                }}
              >
                Logout
              </Link>
            </li>
          </ul>
        </nav>
        {/* Routen */}
        <Routes>
          {/* Allgemeine Routen, die keine Authentifizierung erfordern */}
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
          <Route path="/help" element={<HelpSite />} />

          {/* Geschützte Routen, die nur mit Authentifizierung zugänglich sind */}
          <Route
            path="/calendar"
            element={<ProtectedRoute element={<Calendar />} />}
          />
          <Route
            path="/sessions"
            element={<ProtectedRoute element={<CourseSessionList />} />}
          />
          <Route
            path="/courses"
            element={<ProtectedRoute element={<CourseList apiUrl={API} />} />}
          />
          <Route
            path="/admin"
            element={<ProtectedRoute element={<AdminDashboard />} />}
          />
          <Route
            path="/list"
            element={<ProtectedRoute element={<ListView />} />}
          />
          <Route
            path="/enroll/:sessionId"
            element={<ProtectedRoute element={<EnrollPage />} />}
          />

          {/* Default Route */}
          <Route path="/" element={<Navigate to="/calendar" replace />} />
          <Route path="*" element={<div>404 Not Found</div>} />
        </Routes>
      </div>
    </Router>
  );
}

export default App;
