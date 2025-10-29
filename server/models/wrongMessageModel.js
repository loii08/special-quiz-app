const mongoose = require('mongoose');

const wrongMessageSchema = new mongoose.Schema({
  msg: { type: String, required: true },
  emoji: { type: String, required: true },
});

module.exports = mongoose.model('WrongMessage', wrongMessageSchema);