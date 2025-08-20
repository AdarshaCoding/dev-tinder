const jwt = require("jsonwebtoken");
const User = require("../models/user");
const userAuth = async (req, res, next) => {
  try {
    // read the token from cookies
    const { token } = req.cookies;
    if (!token) {
      throw new Error("The token is not valid");
    }
    // validate the token
    const decodedObj = await jwt.verify(token, process.env.JWT_PRIVATE_KEY);
    const { _id } = decodedObj;
    // find the user and attach to req object before passing to request handler
    const user = await User.findById(_id);
    if (!user) {
      throw new Error("User not found");
    }
    req.user = user;
    next();
  } catch (err) {
    res.status(400).json({ success: false, message: err.message });
  }
};

module.exports = { userAuth };
