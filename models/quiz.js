const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const optionSchema = new Schema({
  optionText: { type: String, required: true },
  isCorrect: { type: Boolean, required: true },
  optionImage: { type: String },
});

const questionSchema = new Schema({
  questionText: { type: String, required: true },
  questionImage: { type: String },
  questionAudio: { type: String },
  questionVideo: { type: String },
  questionType: {
    type: String,
    enum: [
      "SINGLE_CORRECT",
      "MULTI_CORRECT",
      "NUMERIC",
      "SHORT_ANSWER",
      "TRUE_FALSE",
    ],
    required: true,
  },
  options: { type: [optionSchema], required: true },
  explanation: { type: String },
  marks: { type: Number, required: true },
  negativeMarks: { type: Number, default: 0 },
  duration: { type: Number },
  tags: { type: [String] },
});

const quizSchema = new Schema(
  {
    name: {
      type: String,
      required: true,
    },
    questions: {
      type: [questionSchema],
      required: true,
    },
    isLive: {
      type: Boolean,
      required: true,
    },
    quizDate: {
      type: Date,
    }, // if isLive then date is mandatory
    duration: {
      type: Number,
      required: true,
    },
    level: {
      type: String,
      enum: ["EASY", "MEDIUM", "HARD"],
      default: "MEDIUM",
    },
    thumbnail: {
      type: String,
    },
    published: {
      type: Boolean,
      default: false,
    },
    creator: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
    },
    modifier: {
      type: [mongoose.Schema.Types.ObjectId],
      ref: "User",
    },
  },
  {
    timestamps: true,
  }
);

const Quiz = mongoose.model("Quiz", quizSchema);

module.exports = Quiz;
