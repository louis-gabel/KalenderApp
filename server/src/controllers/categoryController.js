const categoryModel = require("../models/categoryModel");

const getAllCategories = async (req, res) => {
  try {
    const category = await categoryModel.getCategories(); // Ruft alle Kategorien ab
    res.status(200).json(category); // Erfolgreiche Antwort
  } catch (error) {
    console.error("Error fetching categories:", error);
    res.status(500).json({ error: "Error fetching categories" });
  }
};

module.exports = {
  getAllCategories,
};
