import React, { useState } from "react";
import {
  BrowserRouter as Router,
  Routes,
  Route,
  Link,
  Navigate,
  useLocation,
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
import EditCourse from "./components/EditCourse";
import DozentDashboard from "./components/DozentDashboard";
import CreateCalendarevents from "./components/CreateCalendarevents";
import "./assets/App.css";
import "./bootstrap/css/bootstrap.min.css";
import "./bootstrap/js/bootstrap.bundle.min.js"; // Optional für interaktive Komponenten

const API = process.env.REACT_APP_API_URL;

// Funktion, um zu prüfen, ob ein Benutzer eingeloggt ist
const isAuthenticated = () => {
  return !!localStorage.getItem("token"); // Prüfe auf ein gespeichertes Token
};

const isDozent = () => {
  const role = localStorage.getItem("role");
  return role === "Dozent"; // Prüfe auf ein gespeichertes Token
};

const isAdmin = () => {
  const role = localStorage.getItem("role");
  return role === "Admin"; // Prüfe auf ein gespeichertes Token
};

const isStudent = () => {
  const role = localStorage.getItem("role");
  return role === "Student"; // Prüfe auf ein gespeichertes Token
};

const onlyDozent = ({ element }) => {
  if (!isAuthenticated() || !isDozent()) {
    return <Navigate to="/login" replace />;
  }

  // Wenn authentifiziert, wird die angeforderte Komponente angezeigt
  return element;
};

const onlyAdmin = ({ element }) => {
  if (!isAuthenticated() || !isAdmin()) {
    return <Navigate to="/login" replace />;
  }

  // Wenn authentifiziert, wird die angeforderte Komponente angezeigt
  return element;
};

const onlyStudent = ({ element }) => {
  if (!isAuthenticated() || !isStudent()) {
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

  const location = useLocation(); // Holt den aktuellen Pfad

  // Definiere, auf welchen URLs die Navigation ausgeblendet werden soll
  const hiddenNavPaths = ["/login", "/register", "/admin", "/dozent"];
  const hideNav =
    hiddenNavPaths.some((path) => location.pathname.startsWith(path)) ||
    location.pathname.startsWith("/admin") ||
    location.pathname.startsWith("/dozent");

  return (
    <div>
      {/* Navigation nur anzeigen, wenn der Pfad nicht versteckt ist */}
      {!hideNav && (
        <nav className="navbar">
          <button className="menu-button" onClick={toggleMenu}>
            ☰
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
      )}
      {/* Routen */}
      <Routes>
        {/* Allgemeine Routen, die keine Authentifizierung erfordern */}
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route path="/help" element={<HelpSite />} />

        {/* Geschützte Routen, die nur mit Authentifizierung zugänglich sind */}
        <Route
          path="/calendar"
          element={onlyStudent({ element: <Calendar /> })}
        />
        <Route
          path="/sessions"
          element={onlyStudent({ element: <CourseSessionList /> })}
        />
        <Route
          path="/courses"
          element={onlyStudent({ element: <CourseList apiUrl={API} /> })}
        />

        <Route
          path="/dozent"
          element={onlyDozent({ element: <DozentDashboard /> })}
        />
        <Route
          path="/dozent/:courseId"
          element={onlyDozent({ element: <CreateCalendarevents /> })}
        />
        <Route path="/list" element={onlyStudent({ element: <ListView /> })} />
        <Route
          path="/enroll/:sessionId"
          element={onlyStudent({ element: <EnrollPage /> })}
        />
        <Route
          path="/admin"
          element={onlyAdmin({ element: <AdminDashboard /> })}
        />
        <Route
          path="/admin/:courseId"
          element={onlyAdmin({ element: <EditCourse /> })}
        />
        {/* Default Route */}
        <Route path="/" element={<Navigate to="/calendar" replace />} />
        <Route path="*" element={<div>404 Not Found</div>} />
      </Routes>
    </div>
  );
}

export default function Root() {
  return (
    <Router>
      <App />
    </Router>
  );
}
