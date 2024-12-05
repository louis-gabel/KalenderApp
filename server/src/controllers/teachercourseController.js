const teachercourseModel = require("../models/teachercourseModel");

const getAllTeachersCourses = async (req, res) => {
  try {
    const teachercourses = await teachercourseModel.getAllTeachersCourse(
      req.query
    );
    res.status(200).json(teachercourses);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const getAllTeachersOfCourse = async (req, res) => {
  try {
    const { id } = req.params;
    const teachers = await teachercourseModel.getAllTeachersOfCourse(id);
    res.status(200).json(teachers);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const getAllCoursesOfTeacher = async (req, res) => {
  try {
    const courses = await teachercourseModel.getAllCoursesOfTeacher(req.query);
    res.status(200).json(courses);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Function to create a new course
const createTeacherCourse = async (req, res) => {
  try {
    // Extract course data from the request body
    const teachercourse = req.body;
    // Call the model function to create a new teachercourse in the database
    await teachercourseModel.createTeacherCourse(teachercourse);
    // Send a success response with status code 201 (Created)
    res.status(201).json({ message: "Teachercourse created successfully" });
  } catch (error) {
    // Send an error response with status code 500 (Internal Server Error)
    res.status(500).json({ message: error.message });
  }
};

// Function to update an existing course
const updateTeacherCourse = async (req, res) => {
  try {
    // Extract course ID from the request parameters
    const { id } = req.params;
    // Extract updated course data from the request body
    const course = req.body;
    // Call the model function to update the course in the database
    await teachercourseModel.updateTeacherCourse(id, course);
    // Send a success response with status code 200 (OK)
    res.status(200).json({ message: "TeacherCourse updated successfully" });
  } catch (error) {
    // Send an error response with status code 500 (Internal Server Error)
    res.status(500).json({ message: error.message });
  }
};

const deleteTeacherCourse = async (req, res) => {
  try {
    const { id } = req.params;
    await teachercourseModel.deleteTeacherCourse(id);
    res.status(200).json({ message: "Course deleted successfully" });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

module.exports = {
  getAllTeachersCourses,
  getAllTeachersOfCourse,
  getAllCoursesOfTeacher,
  createTeacherCourse,
  updateTeacherCourse,
  deleteTeacherCourse,
};
