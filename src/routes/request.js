const express = require("express");
const { userAuth } = require("../middlewares/auth");
const ConnectionRequest = require("../models/connectionRequest");
const User = require("../models/user");

const requestRouter = express.Router();

requestRouter.post(
  "/request/send/:status/:userId",
  userAuth,
  async (req, res) => {
    try {
      const loggedInUser = req.user;
      const fromUserId = loggedInUser._id;
      const toUserId = req.params.userId;
      const status = req.params.status;

      const allowedStatus = ["interested", "ignored"];
      const isRequestValid = allowedStatus.includes(status);
      if (!isRequestValid) {
        throw new Error(`The ${status} is not a valid type`);
      }

      const toUser = await User.findById(toUserId);
      if (!toUser) {
        throw new Error("To-user not found");
      }

      const existingConnectionRequest = await ConnectionRequest.findOne({
        $or: [
          { fromUserId, toUserId },
          { fromUserId: toUserId, toUserId: fromUserId },
        ],
      });

      if (existingConnectionRequest) {
        return res
          .status(400)
          .json({ success: false, message: "Already connection is exists" });
      }

      const connectionRequest = new ConnectionRequest({
        fromUserId,
        toUserId,
        status,
      });

      const sendRequestData = await connectionRequest.save();

      res.json({
        success: true,
        message: `${loggedInUser.firstName} is ${status} in ${toUser.firstName}`,
        data: sendRequestData,
      });
    } catch (err) {
      res.status(400).json({ success: false, message: err.message });
    }
  }
);

module.exports = requestRouter;
