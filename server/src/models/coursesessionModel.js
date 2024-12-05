const db = require("../utils/db");

const createCoursesession = async (data) => {
  return db("coursesession").insert(data);
};

const deleteCoursesession = async (id) => {
  try {
    // start a transaction
    await db.transaction(async (trx) => {
      // get all dependencies of the course
      const calendareventEntries = await trx("calendarevent")
        .where({ session_id: id }) // Use `id` here consistently
        .select("event_id");

      // delete all dependencies of the course

      if (calendareventEntries.length > 0) {
        for (let entry of courseSessionEntries) {
          // Delete related calendar events
          await trx("calendarevent")
            .where({ session_id: entry.session_id })
            .del();
        }

        for (let entry of calendareventEntries) {
          // Delete related registrations
          await trx("registration")
            .where({ session_id: entry.session_id })
            .del();
        }
      }
      // delete the course itself
      await trx("coursesession").where({ session_id: id }).del();
    });
    return { success: true };
  } catch (error) {
    console.error(error); // Log the error for debugging
    return {
      success: false,
      error: "Failed to delete session and related entries. " + error.message,
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
