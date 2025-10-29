const mongoose = require('mongoose');

const quizSchema = new mongoose.Schema({
  quizId: {
    type: String,
    unique: true,
    index: true,
    required: true,
  },
  title: {
    type: String,
    trim: true,
    default: "A Special Quiz",
  },
  scoreGoal: {
    type: Number,
    required: true,
    min: 1,
  },
  anniversaryDate: {
    type: Date,
    required: true,
  },
  congratulationsMessage: {
    type: String,
    default: "Congratulations! You did it! 🎉",
  },
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true,
  },
  reward: {
    content: {
      imageUrl: { type: String, trim: true },
      messageTitle: { type: String, trim: true },
      messageBody: { type: String, trim: true },
    }
  },
  questions: [
    {
      question: { type: String, required: true, trim: true },
      answer: { type: String, required: true, trim: true },
    },
  ],
  createdAt: {
    type: Date,
    default: Date.now,
    expires: "30d",
  },
});

module.exports = mongoose.model("Quiz", quizSchema);