const express = require("express");
const { adminAuth, userAuth } = require("./middlewares/auth");

const app = express();
app.use(express.json());

app.use("/admin", adminAuth);

app.get("/admin/getAllUsers", (req, res) => {
  //get all user details
  res.send("All user details!");
});

app.delete("/admin/deleteUser", (req, res) => {
  // make a call to DB and delete the user
  res.send("The user is deleted!");
});

app.get("/user", userAuth, (req, res) => {
  res.send("User details!");
});

app.listen("3000", () => {
  console.log("Sever successfully listening at Port#: 3000");
});
