const express = require("express");
const WrongMessage = require("../models/wrongMessageModel.js");
const CancelMessage = require("../models/cancelMessageModel.js");

const router = express.Router();

// GET /api/messages/wrong - Fetch all wrong messages
router.get("/wrong", async (req, res) => {
  try {
    const messages = await WrongMessage.find().lean();
    res.json(messages);
  } catch (error) {
    res.status(500).json({ message: "Failed to fetch wrong messages" });
  }
});

// GET /api/messages/cancel - Fetch all cancel messages
router.get("/cancel", async (req, res) => {
  try {
    const messages = await CancelMessage.find().lean();
    res.json(messages);
  } catch (error) {
    res.status(500).json({ message: "Failed to fetch cancel messages" });
  }
});

module.exports = router;