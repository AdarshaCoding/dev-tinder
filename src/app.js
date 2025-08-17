const express = require("express");
const cors = require("cors");
const connectDB = require("./config/database");
const User = require("./model/user");
const { validateSignUpData, validateLoginData } = require("./utils/validation");
const bcrypt = require("bcrypt");
const app = express();
app.use(express.json());
app.use(cors());

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
      res.json({ success: true, message: "Login Successful!" });
    }
  } catch (err) {
    res.status(400).json({ success: false, message: err.message });
  }
});

app.get("/user", async (req, res) => {
  const { emailId } = req.query;
  if (!emailId) {
    return res
      .status(400)
      .json({ success: false, message: "Email ID is required" });
  }
  try {
    const user = await User.findOne({ emailId: emailId });
    if (!user) {
      return res
        .status(404)
        .json({ success: false, message: "User not found", data: {} });
    }
    res.json({
      success: true,
      message: "User fetched successfully",
      data: user,
    });
  } catch (err) {
    res
      .status(500)
      .json({ success: false, message: "Internal server error", data: {} });
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
    console.log("Error fetching users:", err);
    res.status(500).json({
      success: false,
      message: "Internal server error",
      data: [],
    });
  }
});

app.delete("/user/:id", async (req, res) => {
  const { id } = req.params;
  try {
    const user = await User.findById(id);
    if (!user) {
      return res
        .status(404)
        .json({ success: false, message: "User id not found" });
    }
    await User.deleteOne({ _id: id });
    res.json({
      success: true,
      message: "User deleted successfully",
      data: { user }, // check if client doesn't need full details else send only deleted id
    });
  } catch (err) {
    console.error("Error deleting user:", err);
    res.status(500).json({ success: false, message: "Internal server error" });
  }
});

app.patch("/user/:id", async (req, res) => {
  const { id } = req.params;
  const data = req.body;

  const ALLOWED_UPDATES = [
    "about",
    "skills",
    "age",
    "gender",
    "photoUrl",
    "password",
    "firstName",
    "lastName",
  ];

  try {
    const isUpdateAllowed = Object.keys(data).every((key) =>
      ALLOWED_UPDATES.includes(key)
    );

    if (!isUpdateAllowed) {
      return res.status(400).json({
        success: false,
        message: "Update request cannot be processed",
      });
    }

    const user = await User.findById(id);
    if (!user) {
      return res
        .status(404)
        .json({ success: false, message: "User not found" });
    }
    Object.assign(user, req.body);
    const updatedUser = await user.save();
    res.json({
      success: true,
      message: "User updated successfully",
      data: updatedUser,
    });
  } catch (err) {
    console.error("Erro updating user:", err);
    res.status(500).json({
      success: false,
      message: err.message,
    });
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
