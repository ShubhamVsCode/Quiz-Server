const express = require("express");
const { isLoggedIn, isTA } = require("../middleware/authentication");
const { createQuiz, getAllQuiz, getAQuiz } = require("../controllers/quiz");

const router = express.Router();

router.post("/create", isLoggedIn, isTA, createQuiz);
router.get("/all", getAllQuiz);
router.get("/:quizId", getAQuiz);
module.exports = router;
