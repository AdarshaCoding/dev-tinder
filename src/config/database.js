const mongoose = require("mongoose");
require("dotenv").config();
const connectDB = async () => {
  await mongoose.connect(process.env.CONNECTION_STRING);
};

module.exports = connectDB;
