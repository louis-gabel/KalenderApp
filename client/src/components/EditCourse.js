import React, { useEffect, useState, useCallback } from "react";
import { useNavigate, useParams } from "react-router-dom";
import axios from "axios";

const EditCourse = () => {
  const { courseId } = useParams(); // Course ID from the URL
  const navigate = useNavigate();
  const [course, setCourse] = useState(null); // Course details
  const [categories, setCategories] = useState([]); // All categories
  const [teachers, setTeachers] = useState([]); // All teachers
  const [oldTeachercourses, setOlddTeachercourses] = useState([]); // Teachers for the course
  const [selectedTeachers, setSelectedTeachers] = useState([]); // Teachers for the course
  const [error, setError] = useState(""); // Error message

  const API_URL = process.env.REACT_APP_API_URL;

  const fetchCourse = useCallback(async () => {
    try {
      const token = localStorage.getItem("token");
      const response = await axios.get(`${API_URL}/courses/${courseId}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setCourse(response.data);
    } catch (err) {
      setError("Fehler beim Laden der Kursdetails.");
    }
  }, [API_URL, courseId]);

  const fetchSelectedTeachers = useCallback(async () => {
    try {
      const token = localStorage.getItem("token");
      const response = await axios.get(
        `${API_URL}/teachercourse/teacher/${courseId}`,
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );
      setSelectedTeachers(response.data.map((teacher) => teacher.user_id));
      setOlddTeachercourses(
        response.data.map((teacher) => teacher.teacher_course_id)
      );
    } catch (err) {
      setError("Fehler beim Laden der Lehrerdetails.");
    }
  }, [API_URL, courseId]);

  const fetchCategories = useCallback(async () => {
    try {
      const token = localStorage.getItem("token");
      const response = await axios.get(`${API_URL}/category`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setCategories(response.data);
    } catch (err) {
      setError("Fehler beim Laden der Kategorien.");
    }
  }, [API_URL]);

  const fetchTeachers = useCallback(async () => {
    try {
      const token = localStorage.getItem("token");
      const response = await axios.get(`${API_URL}/user/dozent`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setTeachers(response.data);
    } catch (err) {
      setError("Fehler beim Laden der Lehrer.");
    }
  }, [API_URL]);

  const updateCourse = async () => {
    try {
      const token = localStorage.getItem("token");

      // Delete all existing teacher course relationships first
      if (oldTeachercourses.length > 0) {
        for (let teacher_course_id of oldTeachercourses) {
          await axios.delete(
            `${API_URL}/teachercourse/delete/${teacher_course_id}`,
            {
              headers: { Authorization: `Bearer ${token}` },
            }
          );
        }
      }
      // create new teacher relationships
      for (let user_id of selectedTeachers) {
        await axios.post(
          `${API_URL}/teachercourse/create`,
          { course_id: courseId, user_id: user_id },
          {
            headers: { Authorization: `Bearer ${token}` },
          }
        );
      }

      // Update course details
      await axios.put(
        `${API_URL}/courses/${courseId}`,
        {
          title: course.title,
          description: course.description,
          max_participants: course.max_participants,
          duration: course.duration,
          category_id: course.category_id,
        },
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );

      // Successfully updated
      navigate("/admin");
    } catch (err) {
      setError("Fehler beim Aktualisieren des Kurses.");
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
    fetchCourse();
    fetchCategories();
    fetchTeachers();
    fetchSelectedTeachers();
  }, [fetchCourse, fetchCategories, fetchTeachers, fetchSelectedTeachers]);

  if (!course) return <p>Laden...</p>;

  return (
    <div
      className="container mt-4 edit-course-container"
      style={{ backgroundColor: "#eee" }}
    >
      <h1>Kurs bearbeiten</h1>
      {error && <p className="error">{error}</p>}
      <button onClick={() => navigate("/admin")}>Abbrechen</button>

      <form onSubmit={(e) => e.preventDefault()}>
        <input
          type="text"
          placeholder="Titel"
          value={course.title}
          onChange={(e) => setCourse({ ...course, title: e.target.value })}
          required
        />
        <textarea
          placeholder="Beschreibung"
          value={course.description}
          onChange={(e) =>
            setCourse({ ...course, description: e.target.value })
          }
          required
        />
        <input
          type="number"
          placeholder="Maximale Teilnehmer"
          value={course.max_participants}
          onChange={(e) =>
            setCourse({ ...course, max_participants: e.target.value })
          }
          required
        />
        <input
          type="number"
          placeholder="Dauer (in Stunden)"
          value={course.duration}
          onChange={(e) => setCourse({ ...course, duration: e.target.value })}
          required
        />
        <select
          value={course.category_id}
          onChange={(e) =>
            setCourse({ ...course, category_id: e.target.value })
          }
          required
        >
          <option value="">Kategorie auswählen</option>
          {categories.map((category) => (
            <option key={category.category_id} value={category.category_id}>
              {category.category_name}
            </option>
          ))}
        </select>
        {selectedTeachers.map((teacher, index) => (
          <select
            key={index}
            value={teacher}
            onChange={(e) => updateTeacher(index, e.target.value)}
            required
          >
            <option value="">Kurslehrer auswählen</option>
            {teachers.map((dozent) => (
              <option key={dozent.user_id} value={dozent.user_id}>
                {dozent.prename + " " + dozent.surname}
              </option>
            ))}
          </select>
        ))}
        <button type="button" onClick={addTeacherField}>
          Weiteren Lehrer hinzufügen
        </button>

        <button onClick={updateCourse}>Kurs aktualisieren</button>
      </form>
    </div>
  );
};

export default EditCourse;
