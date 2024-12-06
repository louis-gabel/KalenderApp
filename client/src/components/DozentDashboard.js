import React, { useEffect, useState, useCallback } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import "../assets/admin_dashboard.css"; // eigene CSS-Datei
import EditCourse from "./EditCourse";

const DozentDashboard = () => {
  const [events, setEvents] = useState([]);
  const [categories, setCategories] = useState([]);
  const [error, setError] = useState("");
  const [editingCourse, setEditingCourse] = useState(null);
  const [teachersCourses, setTeachersCourses] = useState([]);
  const [courseSessions, setCourseSessions] = useState([]);

  const navigate = useNavigate();

  const [newCourseSession, setNewCourseSession] = useState({
    course_id: "",
    teacher_id: "",
    start_date: "",
    end_date: "",
  });

  const API_URL = process.env.REACT_APP_API_URL;

  const logout = () => {
    localStorage.removeItem("token");
    navigate("/login");
  };

  const fetchCourseSessions = useCallback(async () => {
    try {
      const token = localStorage.getItem("token");
      const user_id = localStorage.getItem("id");

      if (!token || !user_id) {
        throw new Error("Token oder User ID nicht gefunden.");
      }

      const coursesresponse = await axios.get(
        `${API_URL}/coursesessions/${user_id}`,
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );
      setCourseSessions(coursesresponse.data);
    } catch (err) {
      setError(`Error loading coursesession entries`);
    }
  }, [API_URL]);

  const fetchCoursesForTeacher = useCallback(async () => {
    try {
      const token = localStorage.getItem("token");
      const user_id = localStorage.getItem("id");

      if (!token || !user_id) {
        throw new Error("Token oder User ID nicht gefunden.");
      }

      const coursesresponse = await axios.get(
        `${API_URL}/teachercourse/courses/${user_id}`,
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );
      setTeachersCourses(coursesresponse.data);
    } catch (err) {
      setError(`Error loading teachercourse entries.`);
    }
  }, [API_URL]);

  const fetchCourses = useCallback(async () => {
    try {
      const token = localStorage.getItem("token");
      const response = await axios.get(`${API_URL}/courses`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setEvents(response.data);
    } catch (err) {
      setError("Error loading events.");
    }
  }, [API_URL]);

  const fetchCategories = useCallback(async () => {
    try {
      const token = localStorage.getItem("token");
      const response = await axios.get(`${API_URL}/category`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setCategories(response.data);
    } catch (err) {
      setError("Error loading categories.");
    }
  }, [API_URL]);

  const createCourseSession = async (e) => {
    const user_id = localStorage.getItem("id");

    // Format start_date and end_date as YYYY-MM-DD
    const formattedStartDate = newCourseSession.start_date.split("T")[0];
    const formattedEndDate = newCourseSession.end_date.split("T")[0];

    const sessionDataNew = {
      ...newCourseSession,
      teacher_id: user_id,
      start_date: formattedStartDate,
      end_date: formattedEndDate,
    };

    e.preventDefault(); // Prevent default form submission behavior
    try {
      const token = localStorage.getItem("token");
      // Create course session
      const new_session = await axios.post(
        `${API_URL}/coursesessions`,
        sessionDataNew,
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );

      const courseId = new_session.data.session_id; // ID of the created course

      // Reload data after successful creation
      fetchCourseSessions();

      // Reset the newCourseSession state
      setNewCourseSession({
        course_id: "",
        teacher_id: "",
        start_date: "",
        end_date: "",
      });
      navigate(`/dozent/${courseId}`);
    } catch (err) {
      setError(`Error while creating course session.`);
    }
  };

  const deleteCourseSession = async (session_id) => {
    try {
      const token = localStorage.getItem("token");
      await axios.delete(`${API_URL}/coursesessions/${session_id}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setCourseSessions(
        courseSessions.filter((session) => session.session_id !== session_id)
      );
    } catch (err) {
      setError("Error deleting course session.");
    }
  };

  const confirmDelete = (id) => {
    if (window.confirm("Are you sure you want to delete this event?")) {
      deleteCourseSession(id);
    }
  };

  const stopEditing = () => {
    setEditingCourse(null);
    fetchCourses();
  };

  useEffect(() => {
    fetchCoursesForTeacher();
    fetchCourses();
    fetchCategories();
    fetchCourseSessions();
  }, [
    fetchCoursesForTeacher,
    fetchCourses,
    fetchCategories,
    fetchCourseSessions,
  ]);

  if (editingCourse) {
    return (
      <div className="container mt-4">
        <EditCourse course={editingCourse} onCancel={stopEditing} />
      </div>
    );
  }

  return (
    <div className="container mt-4" style={{ backgroundColor: "#034875" }}>
      <header className="d-flex justify-content-between align-items-center p-3 text-white">
        <h1>Dozenten-Dashboard</h1>
        <button className="btn btn-light" onClick={logout}>
          Abmelden
        </button>
      </header>

      {error && <p className="alert alert-danger mt-3">{error}</p>}

      <table className="table table-striped mt-4">
        <thead className="bg-primary text-white">
          <tr>
            <th>Kategorie</th>
            <th>Titel</th>
          </tr>
        </thead>
        <tbody>
          {events
            .filter((event) =>
              teachersCourses.some(
                (teacherCourse) => teacherCourse.course_id === event.course_id
              )
            )
            .map((event) => {
              const courseSessionsForEvent = courseSessions.filter(
                (session) => session.course_id === event.course_id
              );

              return (
                <tr key={event.course_id}>
                  <td>
                    {categories.find(
                      (cat) => cat.category_id === event.category_id
                    )?.category_name || "Unbekannt"}
                  </td>
                  <td>
                    {event.title}
                    <div className="text-muted small mt-1">
                      Beschreibung: {event.description}
                      <br />
                      Maximale Teilnehmer: {event.max_participants}
                      <br />
                      Dauer: {event.duration} Stunden
                    </div>
                    <div className="mt-3">
                      {courseSessionsForEvent.map((session) => (
                        <div
                          key={session.session_id}
                          className="border rounded p-2 mb-2"
                        >
                          <p className="mb-1">
                            <strong>Sitzung {session.session_id}</strong>
                          </p>
                          <p className="mb-1">
                            Start:{" "}
                            {new Date(session.start_date).toLocaleString()}
                            <br />
                            Ende: {new Date(session.end_date).toLocaleString()}
                          </p>
                          <button
                            className="btn btn-danger btn-sm"
                            onClick={() => confirmDelete(session.session_id)}
                          >
                            Sitzung löschen
                          </button>
                        </div>
                      ))}
                    </div>
                  </td>
                </tr>
              );
            })}
        </tbody>
      </table>

      <div className="bg-light p-4 rounded mt-4">
        <h2>Neue Kurssitzung hinzufügen</h2>
        <form onSubmit={createCourseSession}>
          <div className="mb-3">
            <label className="form-label">Kurs auswählen</label>
            <select
              className="form-select"
              value={newCourseSession.course_id}
              onChange={(e) =>
                setNewCourseSession({
                  ...newCourseSession,
                  course_id: e.target.value,
                })
              }
              required
            >
              <option value="">Kurs auswählen</option>
              {events
                .filter((event) =>
                  teachersCourses.some(
                    (teacherCourse) =>
                      teacherCourse.course_id === event.course_id
                  )
                )
                .map((event) => (
                  <option key={event.course_id} value={event.course_id}>
                    {event.title}
                  </option>
                ))}
            </select>
          </div>
          <div className="mb-3">
            <label className="form-label">Startdatum</label>
            <input
              type="datetime-local"
              className="form-control"
              value={newCourseSession.start_date}
              onChange={(e) =>
                setNewCourseSession({
                  ...newCourseSession,
                  start_date: e.target.value,
                })
              }
              required
            />
          </div>
          <div className="mb-3">
            <label className="form-label">Enddatum</label>
            <input
              type="datetime-local"
              className="form-control"
              value={newCourseSession.end_date}
              onChange={(e) =>
                setNewCourseSession({
                  ...newCourseSession,
                  end_date: e.target.value,
                })
              }
              required
            />
          </div>
          <button type="submit" className="btn btn-primary">
            Kurssitzung erstellen
          </button>
        </form>
      </div>
    </div>
  );
};

export default DozentDashboard;
