const db = require("../utils/db");

const createCoursesession = async (data) => {
  return db("coursesession").insert(data);
};

const deleteCoursesession = async (id) => {
  try {
    // start a transaction
    await db.transaction(async (trx) => {
      // delete all dependencies of the course in calendarevent
      await trx("calendarevent").where({ session_id: id }).del(); // Use `id` here consistently
      // delete all dependencies of the course in registration
      await trx("registration").where({ session_id: id }).del(); // Use `id` here consistently

      // delete the course itself
      await trx("coursesession").where({ session_id: id }).del();
    });

    return { success: true };
  } catch (error) {
    console.error(error); // Log the error for debugging
    return {
      success: false,
      error:
        "Failed to delete coursesession and related entries. " + error.message,
    };
  }
};

const getCoursesessions = async (filters = {}) => {
  return db("coursesession").where(filters).select("*");
};

const getSpecificCoursesession = async (id) => {
  return db("coursesession").where({ teacher_id: id }).select("*");
};

module.exports = {
  createCoursesession,
  deleteCoursesession,
  getCoursesessions,
  getSpecificCoursesession,
};
