const db = require("../utils/db");

// Retrieve all rooms
const getRooms = async (filters = {}) => {
  return db("room").where(filters).select("*");
};

module.exports = {
  getRooms,
};
