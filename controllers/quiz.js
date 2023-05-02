const Quiz = require("../models/quiz");

const createQuiz = async (req, res) => {
  try {
    const {
      name,
      questions,
      isLive,
      quizDate,
      duration,
      level,
      thumbnail,
      published,
    } = req.body;

    const creator = req.user._id;

    // Check if mandatory fields are present
    if (
      !name ||
      questions?.length === 0 ||
      typeof isLive != "boolean" ||
      duration < 0
    ) {
      return res.status(400).json({ error: "Missing mandatory fields" });
    }

    // Create a new Quiz object
    const newQuiz = new Quiz({
      name,
      questions,
      isLive,
      quizDate,
      duration,
      level,
      thumbnail,
      published,
      creator,
      modifier: creator,
    });

    // Save the quiz to the database
    const savedQuiz = await newQuiz.save();

    res.status(201).json({
      message: "Quiz created successfully",
      quiz: savedQuiz,
    });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

module.exports = {
  createQuiz,
};
