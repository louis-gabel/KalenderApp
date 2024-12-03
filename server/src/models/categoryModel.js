const db = require("../utils/db");

const getCategories = async (filters = {}) => {
  return db("category").where(filters).select("*");
};

module.exports = { getCategories };
