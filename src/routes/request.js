const express = require("express");
const { userAuth } = require("../middlewares/auth");

const requestRouter = express.Router();

requestRouter.post("/request/send/:status/:userId", userAuth, (req, res) => {
  const user = req.user;
  res.json({
    success: true,
    message: `${user.firstName} sent connection request`,
  });
});

module.exports = requestRouter;
