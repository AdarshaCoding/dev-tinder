const express = require("express");
const cors = require("cors");
const connectDB = require("./config/database");
const User = require("./model/user");

const app = express();
app.use(express.json());
app.use(cors());

app.post("/signup", async (req, res) => {
  const { firstName, lastName, emailId, password, age, gender } = req.body;
  if (!firstName || !lastName || !emailId || !password || !age || !gender) {
    return res.status(400).json({
      success: false,
      message: "Please provide all user details.",
    });
  }
  try {
    //user instance
    const user = new User({
      firstName,
      lastName,
      emailId,
      password,
      age,
      gender,
    });
    const savedUser = await user.save();
    res.status(201).json({
      success: true,
      message: "User created successfully",
      data: savedUser,
    }); // created
  } catch (err) {
    console.error("Error creating user:", err);
    res.status(500).json({
      success: false,
      message: "Internal server error",
    });
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
