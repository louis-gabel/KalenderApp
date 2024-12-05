const db = require("../utils/db");

const getAllTeachersCourse = async (filters = {}) => {
  return db("teachercourse").where(filters).select("*");
};

const getAllTeachersOfCourse = async (course_id) => {
  return db("teachercourse").where({ course_id: course_id }).select("*");
};

const getAllCoursesOfTeacher = async (user_id) => {
  return db("teachercourse").where({ user_id: user_id }).select("*");
};

const createTeacherCourse = async (data) => {
  return db("teachercourse").insert(data);
};

const updateTeacherCourse = async (id, data) => {
  return db("teachercourse").where({ teacher_course_id: id }).update(data);
};

const deleteTeacherCourse = async (id) => {
  return db("teachercourse").where({ teacher_course_id: id }).del();
};

module.exports = {
  getAllTeachersCourse,
  getAllTeachersOfCourse,
  getAllCoursesOfTeacher,
  createTeacherCourse,
  updateTeacherCourse,
  deleteTeacherCourse,
};
