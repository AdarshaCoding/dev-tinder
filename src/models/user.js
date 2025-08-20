const mongoose = require("mongoose");
const validator = require("validator");
const jwt = require("jsonwebtoken");
const bcrypt = require("bcrypt");

//schema
const userSchema = mongoose.Schema(
  {
    firstName: {
      type: String,
      required: true,
      minLength: 4,
      maxLength: 50,
    },
    lastName: {
      type: String,
      maxLength: 50,
    },
    emailId: {
      type: String,
      required: true,
      trim: true,
      unique: true,
      lowercase: true,
      match: [/^\S+@\S+\.\S+$/, "Please provide a valid email address"],
    },
    password: {
      type: String,
      required: true,
      validate(value) {
        if (!validator.isStrongPassword(value)) {
          throw new Error("Provide strong password");
        }
      },
    },
    age: {
      type: Number,
      min: 18,
    },
    gender: {
      type: String,
      enum: ["male", "female", "others"],
    },
    photoUrl: {
      type: String,
      default:
        "https://t3.ftcdn.net/jpg/07/24/59/76/360_F_724597608_pmo5BsVumFcFyHJKlASG2Y2KpkkfiYUU.jpg",
      validate(value) {
        if (!validator.isURL(value)) {
          throw new Error("Invalid Profile Image");
        }
      },
    },
    about: {
      type: String,
      default: "Hello! I'm new here.",
      maxLength: 200,
    },
    skills: {
      type: [String],
      validate: [(arr) => arr.length <= 25, "Maximum 25 skills allowed"],
      default: ["JavaScript"],
    },
  },
  { timestamps: true }
);

// schema methods
userSchema.methods.getJWT = async function () {
  let user = this;
  const token = await jwt.sign({ _id: user._id }, process.env.JWT_PRIVATE_KEY, {
    expiresIn: "1h",
  });
  return token;
};

userSchema.methods.verifyPassword = async function (passwordInputByUser) {
  let user = this;
  let passwordHash = user.password;
  let isValidPassword = await bcrypt.compare(passwordInputByUser, passwordHash);
  return isValidPassword;
};

//model - model name should start with capital letter
const User = mongoose.model("User", userSchema);

module.exports = User;
