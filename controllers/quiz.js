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

const getAllQuiz = async (req, res) => {
  const allQuizzes = await Quiz.find();
  res.status(200).json(allQuizzes);
};

const getAQuiz = async (req, res) => {
  try {
    const quiz = await Quiz.findById(req.params.quizId);
    return res.status(200).json(quiz);
  } catch (error) {
    return res.status(500).json({
      message:
        "Server Error on Finding Quiz by this id" + ", Error: " + error.message,
    });
  }
};

module.exports = {
  createQuiz,
  getAllQuiz,
  getAQuiz,
};
