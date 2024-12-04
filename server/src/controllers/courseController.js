const courseModel = require("../models/courseModel");

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
    const newCourse = await courseModel.createCourse(course);

    const newCourseId = newCourse[0];
    // Send a success response with status code 201 (Created)
    res
      .status(201)
      .json({ course_id: newCourseId, message: "Course created successfully" });
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

module.exports = {
  getCourses,
  createCourse,
  updateCourse,
  deleteCourse,
};
