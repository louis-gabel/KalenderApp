import React, { useEffect, useState, useCallback } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import "../assets/admin_dashboard.css"; // own CSS file
import EditCourse from "./EditCourse";

const DozentDashboard = () => {
  const [events, setEvents] = useState([]); // list of events
  const [categories, setCategories] = useState([]); // list of categories
  const [error, setError] = useState(""); // error message
  const [editingCourse, setEditingCourse] = useState(null); // Course being edited
  const [teachersCourses, setTeachersCourses] = useState([]); // All courses teacher can edit
  const [courseSessions, setCourseSessions] = useState([]); // All sessions of a course

  const navigate = useNavigate();

  const [newCourseSession, setNewCourseSession] = useState({
    course_id: "",
    teacher_id: "",
    start_date: "",
    end_date: "",
  }); // new course data

  // API URL
  const API_URL = process.env.REACT_APP_API_URL;

  // Logout function
  const logout = () => {
    localStorage.removeItem("token"); // Remove the token
    navigate("/login"); // Redirect to login page
  };

  const fetchCourseSessions = useCallback(async () => {
    try {
      const token = localStorage.getItem("token"); // Token for authentication
      const user_id = localStorage.getItem("id"); // User ID for authentication

      if (!token || !user_id) {
        throw new Error("Token oder User ID nicht gefunden.");
      }

      // get all coursesessions of the dozent
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
      const token = localStorage.getItem("token"); // Token for authentication
      const user_id = localStorage.getItem("id"); // User ID for authentication

      if (!token || !user_id) {
        throw new Error("Token oder User ID nicht gefunden.");
      }

      // get all courses of the dozent
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
      const token = localStorage.getItem("token"); // Token for authentication
      const response = await axios.get(`${API_URL}/courses`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setEvents(response.data); // Set loaded courses
    } catch (err) {
      setError("Error loading events.");
    }
  }, [API_URL]);

  const fetchCategories = useCallback(async () => {
    try {
      const token = localStorage.getItem("token"); // Token for authentication
      const response = await axios.get(`${API_URL}/category`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setCategories(response.data); // Set loaded categories
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
      ); // Entferne die gelöschte Session aus dem Zustand
    } catch (err) {
      setError("Error deleting course session.");
    }
  };

  // Confirmation before deleting a course
  const confirmDelete = (id) => {
    if (window.confirm("Are you sure you want to delete this event?")) {
      deleteCourseSession(id);
    }
  };

  // Stop editing and return to dashboard view
  const stopEditing = () => {
    setEditingCourse(null); // Reset editing state
    fetchCourses(); // Refresh courses after editing
  };

  // Load courses on the first render of the component
  useEffect(() => {
    fetchCoursesForTeacher(); // Load all courses dozent can teach
    fetchCourses();
    fetchCategories(); // Load categories on render
    fetchCourseSessions(); // Load coursesessions on render
  }, [
    fetchCoursesForTeacher,
    fetchCourses,
    fetchCategories,
    fetchCourseSessions,
  ]);

  if (editingCourse) {
    // Render EditCourse when editing
    return (
      <div className="admin-container">
        <EditCourse
          course={editingCourse} // Pass the course to EditCourse
          onCancel={stopEditing} // Callback to stop editing
        />
      </div>
    );
  }

  // render Dashboard view
  return (
    <div className="admin-container">
      {/* Header with Logout Button */}
      <header className="admin-header">
        <h1>Teacher Dashboard</h1>
        <button className="logout-button" onClick={logout}>
          Logout
        </button>
      </header>

      {error && <p className="error">{error}</p>}

      <table className="events-table">
        <thead>
          <tr>
            <th>Category</th>
            <th>Title</th>
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
              // Filter the course sessions that belong to this event
              const courseSessionsForEvent = courseSessions.filter(
                (session) => session.course_id === event.course_id
              );

              return (
                <tr key={event.course_id}>
                  <td>
                    {categories.find(
                      (cat) => cat.category_id === event.category_id
                    )?.category_name || "Unknown"}
                  </td>
                  <td>
                    {event.title}
                    <br />
                    <span className="event-category">
                      {"Description: " + event.description}
                      <br />
                      {"Max Participants: " + event.max_participants}
                      <br />
                      {"Duration: " + event.duration + " hours"}
                    </span>

                    {/* Nested Sessions under the event */}
                    <div className="sessions-list">
                      {courseSessionsForEvent.length > 0 ? (
                        <ul>
                          {courseSessionsForEvent.map((session) => (
                            <li key={session.session_id}>
                              <strong>Session {session.session_id}</strong>
                              <br />
                              Start:{" "}
                              {new Date(session.start_date).toLocaleString()}
                              <br />
                              End: {new Date(session.end_date).toLocaleString()}
                              <br />
                              {/* Button zum Löschen der Session */}
                              <button
                                onClick={() =>
                                  confirmDelete(session.session_id)
                                }
                                className="delete-button"
                              >
                                Delete Session
                              </button>
                            </li>
                          ))}
                        </ul>
                      ) : (
                        <p>No sessions available for this course.</p>
                      )}
                    </div>
                  </td>
                </tr>
              );
            })}
        </tbody>
      </table>

      {/* Form for adding a new course session */}
      <div className="create-course-form">
        <h2>Add New Course Session</h2>
        <form onSubmit={createCourseSession}>
          {/* Dropdown for courses */}
          <select
            value={newCourseSession.course_id}
            onChange={(e) =>
              setNewCourseSession({
                ...newCourseSession,
                course_id: e.target.value,
              })
            }
            required
          >
            <option value="">Select Course</option>

            {events
              .filter((event) =>
                teachersCourses.some(
                  (teacherCourse) => teacherCourse.course_id === event.course_id
                )
              )
              .map((event) => {
                // Filter the course sessions that belong to this event
                return (
                  <option key={event.course_id} value={event.course_id}>
                    {event.title}
                  </option>
                );
              })}
          </select>

          {/* Start and End Date for Course Session */}
          <label>
            Start Date:
            <input
              type="datetime-local"
              value={newCourseSession.start_date}
              onChange={(e) =>
                setNewCourseSession({
                  ...newCourseSession,
                  start_date: e.target.value,
                })
              }
              required
            />
          </label>

          <label>
            End Date:
            <input
              type="datetime-local"
              value={newCourseSession.end_date}
              onChange={(e) =>
                setNewCourseSession({
                  ...newCourseSession,
                  end_date: e.target.value,
                })
              }
              required
            />
          </label>

          <button type="submit">Create Course Session</button>
        </form>
      </div>
    </div>
  );
};

export default DozentDashboard;
