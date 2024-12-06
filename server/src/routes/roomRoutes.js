const express = require("express");
const roomController = require("../controllers/roomController");
const authenticate = require("../middleware/authenticate");
const router = express.Router(); // Create a new router object

router.get("/", authenticate, roomController.getRooms);

module.exports = router;
