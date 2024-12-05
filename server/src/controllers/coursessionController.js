const coursesessionModel = require("../models/coursesessionModel");

const createCourseSession = async (req, res) => {
  try {
    // Extract course data from the request body
    const session = req.body;
    await coursesessionModel.createCoursesession(session);
    res.status(200).json({ message: "Session created successfully" });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const deleteCourseSession = async (req, res) => {
  try {
    // Extract course data from the request body
    const { id } = req.params;
    await coursesessionModel.deleteCoursesession(id);
    res.status(200).json({ message: "Session deleted successfully" });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const getCourseSessions = async (req, res) => {
  try {
    const sessioncourses = await coursesessionModel.getCoursesessions(
      req.query
    );
    res.status(200).json(sessioncourses);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const getSpecificCourseSessions = async (req, res) => {
  try {
    const { id } = req.params;
    const sessioncourses = await coursesessionModel.getSpecificCoursesession(
      id
    );
    res.status(200).json(sessioncourses);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

module.exports = {
  createCourseSession,
  deleteCourseSession,
  getCourseSessions,
  getSpecificCourseSessions,
};
