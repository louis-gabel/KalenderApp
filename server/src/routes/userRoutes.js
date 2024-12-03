const express = require("express");
const userController = require("../controllers/userController");
const authenticate = require("../middleware/authenticate");
const router = express.Router();

router.get("/", authenticate, userController.getUsers);

router.get("/dozent", authenticate, userController.getDozents);

module.exports = router;
