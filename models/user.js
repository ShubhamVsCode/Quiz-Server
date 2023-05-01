const mongoose = require("mongoose");

const userSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
  },
  gender: {
    type: String,
    enum: ["male", "female", "other"],
    required: true,
  },
  email: {
    type: String,
    required: true,
    unique: true,
  },
  password: {
    type: String,
    required: true,
  },
  organization: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Organization",
    },
  ],
  group: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Group",
    },
  ],
  subjects: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Subjects",
    },
  ],
  quiz: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Exam",
    },
  ],
  role: {
    type: String,
    enum: ["SUPERADMIN", "ADMIN", "TEACHER", "TA", "STUDENT"],
    required: true,
  },
});

// Method to update user role to SUPERADMIN
userSchema.methods.makeSuperAdmin = function () {
  this.role = "SUPERADMIN";
  return this.save();
};

// Method to update user role to ADMIN
userSchema.methods.makeAdmin = function () {
  this.role = "ADMIN";
  return this.save();
};

// Method to update user role to TEACHER
userSchema.methods.makeTeacher = function () {
  this.role = "TEACHER";
  return this.save();
};

// Method to update user role to TA
userSchema.methods.makeTA = function () {
  this.role = "TA";
  return this.save();
};

// Method to update user role to STUDENT
userSchema.methods.makeStudent = function () {
  this.role = "STUDENT";
  return this.save();
};

const User = mongoose.model("User", userSchema);

module.exports = User;
