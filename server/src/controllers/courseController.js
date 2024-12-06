const courseModel = require("../models/courseModel");
const db = require('../utils/db');

const getCourses = async (req, res) => {
  try {
    const courses = await courseModel.getCourses(req.query);
    res.status(200).json(courses);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Function to create a new course
const createCourse = async (req, res) => {
  try {
    // Extract course data from the request body
    const course = req.body;
    // Call the model function to create a new course in the database
    await courseModel.createCourse(course);
    // Send a success response with status code 201 (Created)
    res.status(201).json({ message: "Course created successfully" });
  } catch (error) {
    // Send an error response with status code 500 (Internal Server Error)
    res.status(500).json({ message: error.message });
  }
};

// Function to update an existing course
const updateCourse = async (req, res) => {
  try {
    // Extract course ID from the request parameters
    const { id } = req.params;
    // Extract updated course data from the request body
    const course = req.body;
    // Call the model function to update the course in the database
    await courseModel.updateCourse(id, course);
    // Send a success response with status code 200 (OK)
    res.status(200).json({ message: "Course updated successfully" });
  } catch (error) {
    // Send an error response with status code 500 (Internal Server Error)
    res.status(500).json({ message: error.message });
  }
};

const deleteCourse = async (req, res) => {
  try {
    const { id } = req.params;
    await courseModel.deleteCourse(id);
    res.status(200).json({ message: "Course deleted successfully" });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

async function createCourseSession(req, res) {
  const { course_id } = req.params; // Kurs-ID aus der URL
  const { start_date, end_date } = req.body; // Start- und Enddatum aus dem Request-Body
  const teacher_id = req.user.id; // Benutzer-ID des Dozenten aus dem authentifizierten Request

  try {
    // Prüfen, ob der Dozent mit dem Kurs verknüpft ist
    const isAuthorized = await db('teachercourse')
      .where({ course_id, teacher_id })
      .first();

    if (!isAuthorized) {
      return res.status(403).json({ message: 'Nicht berechtigt, für diesen Kurs ein Event zu erstellen.' });
    }

    // CourseSession erstellen
    await db('coursesession').insert({
      course_id,
      teacher_id,
      start_date,
      end_date,
    });

    return res.status(201).json({ message: 'CourseSession erfolgreich erstellt.' });
  } catch (error) {
    console.error('Fehler beim Erstellen der CourseSession:', error);
    return res.status(500).json({ message: 'Interner Serverfehler.' });
  }
}


module.exports = {
  getCourses,
  createCourse,
  updateCourse,
  deleteCourse,
  createCourseSession
};
