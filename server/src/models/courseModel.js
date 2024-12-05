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
  try {
    // start a transaction
    await db.transaction(async (trx) => {
      // get all dependencies of the course
      const courseSessionEntries = await trx("coursesession")
        .where({ course_id: id }) // Use `id` here consistently
        .select("session_id");

      // delete all dependencies of the course

      // delete teachercourses first
      const teacherCourseEntries = await trx("teachercourse")
        .where({ course_id: id })
        .del();

      if (courseSessionEntries.length > 0) {
        for (let entry of courseSessionEntries) {
          // Delete related calendar events
          await trx("calendarevent")
            .where({ session_id: entry.session_id })
            .del();
        }

        for (let entry of courseSessionEntries) {
          // Delete related registrations
          await trx("registration")
            .where({ session_id: entry.session_id })
            .del();
        }

        // Delete course sessions last
        await trx("coursesession")
          .whereIn(
            "session_id",
            courseSessionEntries.map((entry) => entry.session_id)
          )
          .del();
      }

      // delete the course itself
      await trx("course").where({ course_id: id }).del();
    });

    return { success: true };
  } catch (error) {
    console.error(error); // Log the error for debugging
    return {
      success: false,
      error: "Failed to delete course and related entries. " + error.message,
    };
  }
};

module.exports = {
  getCourses,
  getSpecificCourse,
  createCourse,
  updateCourse,
  deleteCourse,
};
