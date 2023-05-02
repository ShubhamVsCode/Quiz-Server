const express = require("express");
const { isLoggedIn, isTA } = require("../middleware/authentication");
const { createQuiz } = require("../controllers/quiz");

const router = express.Router();

router.post("/create", isLoggedIn, isTA, createQuiz);
module.exports = router;
