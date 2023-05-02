const User = require("../models/user");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");

const checkToken = async (req, res) => {
  try {
    const { token } = req.body;
    if (!token) {
      return res.status(404).json({ message: "Provide Access Token" });
    }

    const decoded = jwt.verify(token, process.env.JWT_SECRET); // Decode token
    const userId = decoded._id; // Extract user ID from decoded token
    const user = await User.findById(userId);
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }
    return res.status(200).json({ user });
  } catch (err) {
    console.error(err);
    res.status(401).json({ message: "Unauthorized" });
  }
};

const getUser = async (req, res) => {
  try {
    const token = req.headers.authorization.split(" ")[1]; // Extract token from Authorization header
    if (!token) {
      return res.status(404).json({ message: "Provide Access Token" });
    }

    const decoded = jwt.verify(token, process.env.JWT_SECRET); // Decode token
    const userId = decoded._id; // Extract user ID from decoded token

    const user = await User.findById(userId);
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }
    res.json(user);
  } catch (err) {
    console.error(err);
    res.status(401).json({ message: "Unauthorized" });
  }
};

const register = async (req, res) => {
  console.log("Register Route Started");
  const { name, email, password, gender } = req.body;

  if (!name || !email || !password || !gender) {
    return res.status(400).json({ message: "All fields required" });
  }
  try {
    // Check if email is already in use
    const existingUser = await User.findOne({ email: req.body.email });
    if (existingUser) {
      return res.status(409).json({ message: "Email already in use" });
    }

    // Hash password
    const hashedPassword = bcrypt.hashSync(req.body.password, 10);

    // Create new user
    const user = new User({
      name: req.body.name,
      gender: req.body.gender,
      email: req.body.email,
      password: hashedPassword,
      organization: req.body.organization,
      group: req.body.group,
      role: "STUDENT",
    });

    // Save user to database
    const savedUser = await user.save();

    // Create JWT token
    const token = jwt.sign({ _id: savedUser._id }, process.env.JWT_SECRET, {
      expiresIn: "3d",
    });

    res.status(201).json({ token, user });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

const login = async (req, res) => {
  const { email, password } = req.body;

  if (!email || !password) {
    return res.status(400).json({ message: "All fields required" });
  }

  try {
    // Check if user exists
    const user = await User.findOne({ email });
    if (!user) {
      return res.status(401).json({ message: "Invalid email or password" });
    }

    // Check if password is correct
    const validPassword = await bcrypt.compare(password, user.password);
    if (!validPassword) {
      return res.status(401).json({ message: "Invalid email or password" });
    }

    // Create JWT token
    const token = jwt.sign({ _id: user._id }, process.env.JWT_SECRET, {
      expiresIn: "3d",
    });

    return res.status(200).json({ token, user });
  } catch (err) {
    return res.status(500).json({ message: err.message });
  }
};

const updateRole = async (req, res) => {
  const { role } = req.query;
  const validRoles = ["SUPERADMIN", "ADMIN", "TEACHER", "TA", "STUDENT"];

  if (!validRoles.includes(role)) {
    return res.status(400).json({ message: "Invalid role provided" });
  }

  try {
    const user =
      (await User.findOne({ email: req.params.id })) ||
      (await User.findById(req.params.id));

    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    if (user.role === role) {
      return res.status(400).json({ message: `User is already a ${role}` });
    }

    switch (role) {
      case "SUPERADMIN":
        user.makeSuperAdmin(); // this will save the user by default
        break;
      case "ADMIN":
        user.makeAdmin(); // this will save the user by default
        break;
      case "TEACHER":
        user.makeTeacher(); // this will save the user by default
        break;
      case "TA":
        user.makeTA(); // this will save the user by default
        break;
      case "STUDENT":
        user.makeStudent(); // this will save the user by default
        break;
    }

    return res.json({ message: `User role updated to ${role}` });
  } catch (err) {
    return res.status(500).json({ message: err.message });
  }
};

const searchUsers = async (req, res) => {
  const { email } = req.body;

  if (!email) {
    return res
      .status(400)
      .json({ message: "Email query parameter is required" });
  }

  try {
    const users = await User.find({
      email: { $regex: email, $options: "i" },
    });
    return res.status(200).json(users);
  } catch (err) {
    console.error(err);
    return res.status(500).json({ message: "Internal server error" });
  }
};

const updateDetails = async (req, res) => {
  const { name, email, gender } = req.body;

  try {
    const user =
      (await User.findOneAndUpdate(
        { email: req.params.id },
        { name, email, gender },
        { new: true }
      )) ||
      (await User.findByIdAndUpdate(
        req.params.id,
        { name, email, gender },
        {
          new: true,
        }
      ));
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }
    res.json(user);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Server error" });
  }
};

module.exports = {
  checkToken,
  getUser,
  login,
  register,
  updateRole,
  searchUsers,
  updateDetails,
};
