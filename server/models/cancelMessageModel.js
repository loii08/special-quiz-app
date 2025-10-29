const mongoose = require('mongoose');

const cancelMessageSchema = new mongoose.Schema({
  msg: { type: String, required: true },
  emoji: { type: String, required: true },
});

module.exports = mongoose.model('CancelMessage', cancelMessageSchema);