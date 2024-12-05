const db = require("../utils/db");

const getCourses = async (filters = {}) => {
  return db("course").where(filters).select("*");
};

const getSpecificCourse = async (id) => {
  return db("course").where({ course_id: id }).select("*");
};

const createCourse = async (data) => {
  return db("course").insert(data);
};

const updateCourse = async (id, data) => {
  return db("course").where({ course_id: id }).update(data);
};

const deleteCourse = async (id) => {
  return db("course").where({ course_id: id }).del();
};

module.exports = {
  getCourses,
  getSpecificCourse,
  createCourse,
  updateCourse,
  deleteCourse,
};
