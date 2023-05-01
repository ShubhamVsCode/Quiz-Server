const express = require("express");
const { isLoggedIn, isTA } = require("../middleware/authentication");
const {
  register,
  login,
  updateRole,
  getUser,
  searchUsers,
  updateDetails,
} = require("../controllers/users");

const router = express.Router();

// Route to get the current user
router.get("/getUser", isLoggedIn, getUser);

// Register route
router.post("/register", register);

// Login route
router.post("/login", login);

// Route to update user role
router.put("/updateRole/:id", updateRole);

// Routes for searching user
router.post("/search", searchUsers);

// Update a user
router.put("/updateDetails/:id", isTA, updateDetails);

module.exports = router;
