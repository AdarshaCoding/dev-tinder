const express = require("express");
const User = require("../models/user");
const { userAuth } = require("../middlewares/auth");

const userRouter = express.Router();

userRouter.get("/feed", userAuth, async (req, res) => {
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

module.exports = userRouter;
