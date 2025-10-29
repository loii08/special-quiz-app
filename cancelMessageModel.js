const mongoose = require('mongoose');

const cancelMessageSchema = new mongoose.Schema({
  msg: { type: String, required: true },
  emoji: { type: String, required: true },
});

const CancelMessage = mongoose.model('CancelMessage', cancelMessageSchema);

module.exports = CancelMessage;