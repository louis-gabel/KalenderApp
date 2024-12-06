import React, { useEffect, useState, useCallback } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import "../assets/admin_dashboard.css"; // own CSS file

const AdminDashboard = () => {
  const [events, setEvents] = useState([]);
  const [categories, setCategories] = useState([]);
  const [error, setError] = useState("");
  const [selectedTeachers, setSelectedTeachers] = useState([""]);
  const [teachers, setTeachers] = useState([]);

  const navigate = useNavigate();

  const [newCourse, setNewCourse] = useState({
    title: "",
    description: "",
    category_id: "",
    max_participants: "",
    duration: "",
  });

  const API_URL = process.env.REACT_APP_API_URL;

  const logout = () => {
    localStorage.removeItem("token");
    window.location.href = "/login";
  };

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

  const fetchTeacher = useCallback(async () => {
    try {
      const token = localStorage.getItem("token");
      const response = await axios.get(`${API_URL}/user/dozent`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setTeachers(response.data);
    } catch (err) {
      setError("Error loading teachers.");
    }
  }, [API_URL]);

  const createCourse = async () => {
    try {
      const token = localStorage.getItem("token");
      const courseResponse = await axios.post(`${API_URL}/courses`, newCourse, {
        headers: { Authorization: `Bearer ${token}` },
      });

      const courseId = courseResponse.data.course_id;

      await Promise.all(
        selectedTeachers.map((id) =>
          axios.post(
            `${API_URL}/teachercourse/create`,
            { user_id: id, course_id: courseId },
            {
              headers: { Authorization: `Bearer ${token}` },
            }
          )
        )
      );

      fetchCourses();
      setNewCourse({
        title: "",
        description: "",
        category_id: "",
        max_participants: "",
        duration: "",
      });
      setSelectedTeachers([""]);
    } catch (err) {
      setError("Error while creating course.");
    }
  };

  const deleteEvent = async (course_id) => {
    try {
      const token = localStorage.getItem("token");
      await axios.delete(`${API_URL}/courses/${course_id}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setEvents(events.filter((event) => event.course_id !== course_id));
    } catch (err) {
      setError("Error deleting event.");
    }
  };

  const confirmDelete = (eventId) => {
    if (window.confirm("Are you sure you want to delete this event?")) {
      deleteEvent(eventId);
    }
  };

  const addTeacherField = () => {
    setSelectedTeachers([...selectedTeachers, ""]);
  };

  const updateTeacher = (index, value) => {
    const updatedTeachers = [...selectedTeachers];
    updatedTeachers[index] = value;
    setSelectedTeachers(updatedTeachers);
  };

  useEffect(() => {
    fetchCourses();
    fetchCategories();
    fetchTeacher();
  }, [fetchCourses, fetchCategories, fetchTeacher]);

  return (
    <div className="container my-4">
      <h1 className="text-center mb-4" style={{ color: "#034875" }}>
        Admin Dashboard
      </h1>
      {error && <div className="alert alert-danger">{error}</div>}
      <button className="btn btn-danger mb-3" onClick={logout}>
        Logout
      </button>
      <div className="table-responsive">
        <table className="table table-striped">
          <thead className="table-dark">
            <tr>
              <th>ID</th>
              <th>Category</th>
              <th>Title</th>
              <th>Options</th>
            </tr>
          </thead>
          <tbody>
            {events.map((event) => (
              <tr key={event.course_id}>
                <td>{event.course_id}</td>
                <td>
                  {categories.find(
                    (cat) => cat.category_id === event.category_id
                  )?.category_name || "Unknown"}
                </td>
                <td>
                  {event.title}
                  <br />
                  <small className="text-muted">
                    {"Description: " + event.description}
                    <br />
                    {"Max Participants: " + event.max_participants}
                    <br />
                    {"Duration: " + event.duration + " hours"}
                  </small>
                </td>
                <td>
                  <button
                    className="btn btn-primary btn-sm me-2"
                    onClick={() => navigate(`/admin/${event.course_id}`)}
                  >
                    Edit
                  </button>
                  <button
                    className="btn btn-danger btn-sm"
                    onClick={() => confirmDelete(event.course_id)}
                  >
                    Delete
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      <div className="card mt-5">
        <div className="card-body">
          <h2 className="card-title" style={{ color: "#034875" }}>
            Add New Course
          </h2>
          <form onSubmit={createCourse}>
            <div className="mb-3">
              <input
                type="text"
                className="form-control"
                placeholder="Title"
                value={newCourse.title}
                onChange={(e) =>
                  setNewCourse({ ...newCourse, title: e.target.value })
                }
                required
              />
            </div>
            <div className="mb-3">
              <textarea
                className="form-control"
                placeholder="Description"
                value={newCourse.description}
                onChange={(e) =>
                  setNewCourse({ ...newCourse, description: e.target.value })
                }
                required
              />
            </div>
            <div className="mb-3">
              <input
                type="number"
                className="form-control"
                placeholder="Max Participants"
                value={newCourse.max_participants}
                onChange={(e) =>
                  setNewCourse({
                    ...newCourse,
                    max_participants: e.target.value,
                  })
                }
                required
              />
            </div>
            <div className="mb-3">
              <input
                type="number"
                className="form-control"
                placeholder="Duration (in hours)"
                value={newCourse.duration}
                onChange={(e) =>
                  setNewCourse({ ...newCourse, duration: e.target.value })
                }
                required
              />
            </div>
            <div className="mb-3">
              <select
                className="form-select"
                value={newCourse.category_id}
                onChange={(e) =>
                  setNewCourse({ ...newCourse, category_id: e.target.value })
                }
                required
              >
                <option value="">Select Category</option>
                {categories.map((category) => (
                  <option
                    key={category.category_id}
                    value={category.category_id}
                  >
                    {category.category_name}
                  </option>
                ))}
              </select>
            </div>
            {selectedTeachers.map((teacher, index) => (
              <div className="mb-3" key={index}>
                <select
                  className="form-select"
                  value={teacher}
                  onChange={(e) => updateTeacher(index, e.target.value)}
                  required
                >
                  <option value="">Select course teacher</option>
                  {teachers.map((dozent) => (
                    <option key={dozent.user_id} value={dozent.user_id}>
                      {dozent.prename + " " + dozent.surname}
                    </option>
                  ))}
                </select>
              </div>
            ))}
            <button
              type="button"
              className="btn btn-secondary btn-sm mb-3"
              onClick={addTeacherField}
            >
              Add further teacher
            </button>
            <button className="btn btn-success w-100">Create Course</button>
          </form>
        </div>
      </div>
    </div>
  );
};

export default AdminDashboard;
