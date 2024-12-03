const express = require("express");
const categoryController = require("../controllers/categoryController");
const authenticate = require("../middleware/authenticate");

const router = express.Router(); // Create a new router object

// GET /api/categories - Alle Kategorien abrufen
router.get("/", authenticate, categoryController.getAllCategories);

module.exports = router;
