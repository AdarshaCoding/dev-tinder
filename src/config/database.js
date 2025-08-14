const mongoose = require("mongoose");

const CONNECTION_STRING =
  "mongodb+srv://adarsha-node_01:adarsha123@cluster-1.awqvyfp.mongodb.net/devTinder";

const connectDB = async () => {
  await mongoose.connect(CONNECTION_STRING);
};

module.exports = connectDB;
