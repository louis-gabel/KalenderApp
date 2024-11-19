const express = require("express");
const authController = require("../controllers/authController");

const router = express.Router(); // Create a new router object

router.post("/register", authController.register); // Define a POST route for user registration
router.post("/login", authController.login); // Define a POST route for user login

module.exports = router;
