const roomModel = require("../models/roomModel");

const getRooms = async (req, res) => {
  try {
    const rooms = await roomModel.getRooms(req.query);
    res.status(200).json(rooms);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

module.exports = {
  getRooms,
};
