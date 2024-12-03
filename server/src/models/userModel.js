const db = require("../utils/db");

// Retrieve all users (with optional filters)
const getUsers = async (filters = {}) => {
  return db("user").where(filters).select("*");
};

// Retrieve dozent (with optional filters)
const getDozents = async () => {
  return db("user").where({ role_id: 2 }).select("*");
};

// Create a new user
const createUser = async (data) => {
  return db("user").insert(data);
};

// Update a user
const updateUser = async (id, data) => {
  return db("user").where({ user_id: id }).update(data);
};

// Delete a user
const deleteUser = async (id) => {
  return db("user").where({ user_id: id }).del();
};

module.exports = {
  getUsers,
  getDozents,
  createUser,
  updateUser,
  deleteUser,
};
