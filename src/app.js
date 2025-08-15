const express = require("express");
const connectDB = require("./config/database");
const User = require("./model/user");

const app = express();
app.use(express.json());

app.post("/signup", async (req, res) => {
  const userObj = {
    firstName: "Adarsha",
    lastName: "PC",
    emailId: "adarsha@gmail.com",
    password: "123",
    age: 32,
    gender: "male",
  };
  try {
    const userInstance = new User(userObj);
    const savedUser = await userInstance.save();
    res.status(200).send(savedUser);
  } catch (err) {
    res.status(500).send("Something went wrong: " + err.message);
  }
});

connectDB()
  .then(() => {
    console.log("Database connected successfully!!");
    app.listen("3000", () => {
      console.log("Sever successfully listening at Port#: 3000");
    });
  })
  .catch((err) => {
    console.log("Error while connecting DB", err);
  });
