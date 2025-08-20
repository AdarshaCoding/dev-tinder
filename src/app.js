const express = require("express");
const cors = require("cors");
const connectDB = require("./config/database");
const User = require("./model/user");
const { validateSignUpData, validateLoginData } = require("./utils/validation");
const bcrypt = require("bcrypt");
const cookieParser = require("cookie-parser");
const jwt = require("jsonwebtoken");
const { userAuth } = require("./middlewares/auth");

const app = express();
app.use(express.json());
app.use(cors());
app.use(cookieParser());

app.post("/signup", async (req, res) => {
  const { firstName, lastName, emailId, password } = req.body;
  try {
    // validate all inputs
    validateSignUpData(req);

    //password hasing
    const passwordHash = await bcrypt.hash(password, 10);
    const user = new User({
      firstName,
      lastName,
      emailId,
      password: passwordHash,
    });
    const savedUser = await user.save();
    res.status(201).json({
      success: true,
      message: "User created successfully",
      data: savedUser,
    }); // created
  } catch (err) {
    console.error("Error creating user:", err);
    if (err?.code === 11000 && err?.keyValue?.emailId) {
      return res.status(400).json({
        success: false,
        message: `Email ${err.keyValue.emailId} is already registered.`,
      });
    }
    // Handle Mongoose validation errors
    if (err.name === "ValidationError") {
      // Get the first validation error message
      const errors = Object.values(err.errors).map((e) => e.message);
      return res.status(400).json({
        success: false,
        message: errors.join(", "),
      });
    }
    return res.status(400).json({
      success: false,
      message: err.message,
    });
  }
});

app.post("/login", async (req, res) => {
  const { emailId, password } = req.body;

  try {
    validateLoginData(emailId);
    const user = await User.findOne({ emailId });
    if (!user) {
      return res
        .status(404)
        .json({ success: false, message: "Invalid credentials" });
    }
    const isValidCredentials = await bcrypt.compare(password, user?.password);

    if (!isValidCredentials) {
      return res
        .status(400)
        .json({ success: false, message: "Invalid credentials" });
    } else {
      let token = await jwt.sign(
        { _id: user._id },
        process.env.JWT_PRIVATE_KEY
      );
      res.cookie("token", token);
      res.json({
        success: true,
        message: `${user.firstName} - Login Successful!`,
      });
    }
  } catch (err) {
    res.status(400).json({ success: false, message: err.message });
  }
});

app.get("/profile", userAuth, async (req, res) => {
  try {
    const user = req.user;
    res.json({
      success: true,
      message: "User details fetched successfully",
      data: user,
    });
  } catch (err) {
    res.status(400).json({ success: false, message: err.message });
  }
});

app.get("/feed", async (req, res) => {
  try {
    const users = await User.find({}).lean();
    if (users.length === 0) {
      return res.status(404).json({
        success: false,
        message: "Users not found",
        data: [],
      });
    } else {
      res.json({
        success: true,
        message: "Users fetched successfully",
        data: users,
      });
    }
  } catch (err) {
    res.status(400).json({ success: false, message: err.message });
  }
});

const PORT = process.env.PORT || 3000;
connectDB()
  .then(() => {
    console.log("Database connected successfully!!");
    app.listen(PORT, () => {
      console.log("Sever successfully listening at Port#:", PORT);
    });
  })
  .catch((err) => {
    console.log("Error while connecting DB", err);
  });
