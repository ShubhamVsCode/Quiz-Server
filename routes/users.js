const express = require("express");
const { isLoggedIn, isTA } = require("../middleware/authentication");
const {
  register,
  login,
  updateRole,
  getUser,
  searchUsers,
  updateDetails,
  checkToken,
} = require("../controllers/users");

const router = express.Router();

router.post("/checkToken", checkToken); // Route to get the current user
router.get("/getUser", isLoggedIn, getUser); // Route to get the current user
router.post("/register", register); // Register route
router.post("/login", login); // Login route
router.put("/updateRole/:id", updateRole); // Route to update user role
router.post("/search", searchUsers); // Routes for searching user
router.put("/updateDetails/:id", isTA, updateDetails); // Update a user

module.exports = router;
