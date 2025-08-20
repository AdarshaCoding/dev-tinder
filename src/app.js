const express = require("express");
const cors = require("cors");
const connectDB = require("./config/database");
const User = require("./models/user");
const cookieParser = require("cookie-parser");
const { userAuth } = require("./middlewares/auth");
const authRouter = require("./routes/auth");

const app = express();
app.use(express.json());
app.use(cors());
app.use(cookieParser());

app.use("/", authRouter);

app.get("/profile", userAuth, async (req, res) => {
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
    res.status(400).json({ success: false, message: err.message });
  }
});

app.post("/sendConnectionRequest", userAuth, (req, res) => {
  const user = req.user;
  res.json({
    success: true,
    message: `${user.firstName} sent connection request`,
  });
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
