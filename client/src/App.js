import React, { useState } from "react";
import { BrowserRouter as Router, Routes, Route, Link, Navigate } from "react-router-dom";
import Calendar from "./components/Calendar";
import ListView from "./components/ListView";
import CourseSessionList from "./components/CourseSessionList";
import EnrollPage from "./components/EnrollPage";
import HelpSite from "./components/HelpSite";
import CourseList from "./components/CourseList";
import './App.css';

const API = process.env.REACT_APP_API_URL;

function App() {
  const [menuOpen, setMenuOpen] = useState(false); // Zustand für das Menü

  const toggleMenu = () => setMenuOpen(!menuOpen); // Menü öffnen/schließen

  return (
    <Router>
      <div>
        {/* Navigation */}
        <nav className="navbar">
          <button className="menu-button" onClick={toggleMenu}>
            ☰ {/* Menü-Icon */}
          </button>
          <ul className={`nav-links ${menuOpen ? "open" : ""}`}>
            <li>
              <Link to="/calendar" onClick={toggleMenu}>Calendar View</Link>
            </li>
            <li>
              <Link to="/sessions" onClick={toggleMenu}>Course Sessions</Link>
            </li>
            <li>
              <Link to="/courses" onClick={toggleMenu}>Courses</Link>
            </li>
             <li>
              <Link to="/help" onClick={toggleMenu}>Help</Link>
            </li>
          </ul>
        </nav>

        <Routes>
          <Route path="/" element={<Navigate to="/calendar" />} />
          <Route path="/courses" element={<CourseList apiUrl={API} />} />
          <Route path="/sessions" element={<CourseSessionList />} />
          <Route path="/calendar" element={<Calendar />} />
          <Route path="/list" element={<ListView />} />
          <Route path="/enroll/:sessionId" element={<EnrollPage />} />
          <Route path="/help" element={<HelpSite />} />
          <Route path="*" element={<div>404 Not Found</div>} />
        </Routes>
      </div>
    </Router>
  );
}

export default App;
