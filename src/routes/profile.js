const express = require("express");
const { userAuth } = require("../middlewares/auth");
const {
  validateProfileEditData,
  validatePassword,
} = require("../utils/validation");
const bcrypt = require("bcrypt");

const profileRouter = express.Router();

profileRouter.get("/profile/view", userAuth, async (req, res) => {
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

profileRouter.patch("/profile/edit", userAuth, async (req, res) => {
  try {
    if (!validateProfileEditData(req)) {
      throw new Error("Edit is not allowed");
    }
    const loggedInUser = req.user;
    Object.keys(req.body).forEach((key) => (loggedInUser[key] = req.body[key]));
    await loggedInUser.save();
    res.json({
      success: true,
      message: "User data updated successfully",
      data: loggedInUser,
    });
  } catch (err) {
    res.status(400).json({ success: false, message: err.message });
  }
});

profileRouter.patch("/profile/password", userAuth, async (req, res) => {
  try {
    const { currentPassword, newPassword } = req.body;
    const loggedInUser = req.user;
    const isCurrentPassowrdValid = await loggedInUser.verifyPassword(
      currentPassword
    );
    if (!isCurrentPassowrdValid) {
      throw new Error("Current Password is wrong");
    }

    validatePassword(newPassword);
    const newPasswordHash = await bcrypt.hash(newPassword, 10);

    loggedInUser.password = newPasswordHash;
    await loggedInUser.save();
    res.json({ success: true, message: "Password updated successfully" });
  } catch (err) {
    res.status(400).json({ success: false, message: err.message });
  }
});

module.exports = profileRouter;
