const express = require("express");
const bodyParser = require("body-parser");
const mongoose = require("mongoose");
const crypto = require("crypto");
const nodemailer = require("nodemailer");
const jwt = require("jsonwebtoken");
const cors = require("cors");
const User = require("./models/user");
const Order = require("./models/order");

const app = express();
const port = 8000;

app.use(cors());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());

app.listen(port, () => {
  console.log("Server is running on port 8000");
});

//Connection to mongoDB
mongoose
  .connect("mongodb+srv://SadiaAfrin:12345Tarin@cluster0.3lchog8.mongodb.net/", {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  })
  .then(() => {
    console.log("Connected to MongoDB");
  })
  .catch((err) => {
    console.log("Error connecting to MongoDB", err);
  });

// Register a new user
app.post("/register", async (req, res) => {
  try {
    const { name, email, password } = req.body;
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      console.log("Email already registered:", email); 
      return res.status(400).json({ message: "Email already registered" });
    }
    const newUser = new User({ name, email, password });
    //newUser.verificationToken = crypto.randomBytes(20).toString("hex");
    await newUser.save();
    console.log("New User Registered:", newUser);
    res.status(201).json({
      message:
        "Registration successful",
    });
  } catch (error) {
    console.log("Error during registration:", error);
    res.status(500).json({ message: "Registration failed" });
  }
});