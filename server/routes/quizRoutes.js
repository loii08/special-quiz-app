const express = require("express");
const { nanoid } = require("nanoid");
const { body, validationResult } = require("express-validator");
const Quiz = require("../models/quizModel.js");
const auth = require('../middleware/auth.js');

const router = express.Router();

router.get('/my-quizzes', auth, async (req, res) => {
  try {
    const quizzes = await Quiz.find({ user: req.user.id }).sort({ createdAt: -1 });
    res.json({ quizzes, quizCount: quizzes.length });
  } catch (error) {
    console.error(error.message);
    res.status(500).send('Server Error');
  }
});

router.get('/edit/:id', auth, async (req, res) => {
  try {
    const quiz = await Quiz.findById(req.params.id);
    if (!quiz || quiz.user.toString() !== req.user.id) {
      return res.status(404).json({ msg: 'Quiz not found or you are not authorized' });
    }
    res.json(quiz);
  } catch (error) {
    res.status(500).send('Server Error');
  }
});

router.post(
  "/",
  auth,
  [
    body("title").notEmpty().trim(),
    body("scoreGoal").isNumeric({ min: 1 }),
    body("anniversaryDate").isISO8601().toDate(),
    body("questions").isArray({ min: 1 }),
    body("questions.*.question").notEmpty().trim(),
    body("questions.*.answer").notEmpty().trim(),
  ],
  async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    try {
      const quizCount = await Quiz.countDocuments({ user: req.user.id });
      if (quizCount >= 3) {
        return res.status(403).json({ message: "You have reached the maximum limit of 3 quizzes." });
      }

      const quizId = nanoid(8);
      const newQuiz = await Quiz.create({
        ...req.body,
        quizId,
        user: req.user.id,
      });
      res.status(201).json({ quizId });
    } catch (error) {
      console.error("Quiz creation failed:", error);
      res.status(500).json({ message: "Failed to create quiz" });
    }
  }
);

router.put('/:id', auth, async (req, res) => {
  try {
    const quiz = await Quiz.findById(req.params.id);

    if (!quiz) {
      return res.status(404).json({ msg: 'Quiz not found' });
    }

    if (quiz.user.toString() !== req.user.id) {
      return res.status(401).json({ msg: 'Not authorized' });
    }

    const updatedQuiz = await Quiz.findByIdAndUpdate(req.params.id, { $set: req.body }, { new: true });

    res.json(updatedQuiz);
  } catch (error) {
    console.error(error.message);
    res.status(500).send('Server Error');
  }
});

router.delete('/:id', auth, async (req, res) => {
  try {
    const quiz = await Quiz.findById(req.params.id);
    if (!quiz) return res.status(404).json({ msg: 'Quiz not found' });

    if (quiz.user.toString() !== req.user.id) return res.status(401).json({ msg: 'Not authorized' });

    await Quiz.findByIdAndDelete(req.params.id);
    res.json({ msg: 'Quiz removed' });
  } catch (error) {
    console.error(error.message);
    res.status(500).send('Server Error');
  }
});

router.get("/:quizId", async (req, res) => {
  try {
    const quiz = await Quiz.findOne({ quizId: req.params.quizId }).lean();
    if (!quiz) {
      return res.status(404).json({ message: "Quiz not found" });
    }
    res.json(quiz);
  } catch (error) {
    res.status(500).json({ message: "Failed to fetch quiz" });
  }
});

module.exports = router;