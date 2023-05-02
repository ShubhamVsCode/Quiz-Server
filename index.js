const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
const morgan = require("morgan");
const dotenv = require("dotenv");
dotenv.config();

const app = express();
const port = process.env.PORT || 5000;

// Connect to MongoDB
mongoose
  .connect(process.env.MONGODB_URI, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  })
  .then(() => {
    console.log("Connected to MongoDB");
  })
  .catch((err) => {
    console.error(err);
  });

// Middleware
app.use(express.json());
app.use(
  cors({
    origin: "https://quiz-shubham.netlify.app",
  })
);
app.use(morgan("tiny"));

// Routes
const usersRouter = require("./routes/users");
const quizRouter = require("./routes/quiz");

function logBody(req, res, next) {
  console.log(req?.body);
  next();
}

app.get("/", (req, res) => {
  res.json({
    message: "Welcome to Quiz API",
  });
});
app.use("/user", usersRouter);
app.use("/quiz", quizRouter);

// Start server
app.listen(port, () => {
  console.log(`Server started on port ${port}`);
});
