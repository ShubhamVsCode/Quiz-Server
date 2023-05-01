const jwt = require("jsonwebtoken");

// Middleware to check if user is logged in
const isLoggedIn = (req, res, next) => {
  const authHeader =
    req.headers["authorization"] || req.headers["Authorization"];
  const token = authHeader && authHeader.split(" ")[1];

  if (!token) {
    return res.status(401).json({ message: "Unauthorized" });
  }

  jwt.verify(token, process.env.JWT_SECRET, (err, user) => {
    if (err) {
      return res.status(403).json({ message: "Forbidden" });
    }
    req.user = user;
    next();
  });
};

// Middleware to check if user is a super admin
const isSuperAdmin = (req, res, next) => {
  if (req.user.role !== "SUPERADMIN") {
    return res.status(403).json({ message: "Forbidden" });
  }
  next();
};

// Middleware to check if user is an admin
const isAdmin = (req, res, next) => {
  if (req.user.role !== "ADMIN" && req.user.role !== "SUPERADMIN") {
    return res.status(403).json({ message: "Forbidden" });
  }
  next();
};

// Middleware to check if user is a teacher
const isTeacher = (req, res, next) => {
  if (
    req.user.role !== "TEACHER" &&
    req.user.role !== "ADMIN" &&
    req.user.role !== "SUPERADMIN"
  ) {
    return res.status(403).json({ message: "Forbidden" });
  }
  next();
};

// Middleware to check if user is a TA
const isTA = (req, res, next) => {
  if (
    req.user.role !== "TA" &&
    req.user.role !== "TEACHER" &&
    req.user.role !== "ADMIN" &&
    req.user.role !== "SUPERADMIN"
  ) {
    return res.status(403).json({ message: "Forbidden" });
  }
  next();
};

module.exports = {
  isLoggedIn,
  isSuperAdmin,
  isAdmin,
  isTeacher,
  isTA,
};
