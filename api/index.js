const express = require("express");
const bodyParser = require("body-parser");
const mongoose = require("mongoose");
const crypto = require("crypto");
const nodemailer = require("nodemailer");
const jwt = require("jsonwebtoken");
const cors = require("cors");
const User = require("./models/user");
const Book = require("./models/book");
const Store = require("./models/store");

//const Order = require("./models/order");

const app = express();
const port = 8000;

app.use(cors({origin: true, credentials: true}));
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());

app.listen(port, () => {
  console.log("Server is running on port 8000");
});

//Connection to mongoDB
mongoose
  .connect("mongodb+srv://SadiaAfrin:12345Tarin@cluster0.3lchog8.mongodb.net/oldBook")
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

//endpoint to login the user!
app.post("/login", async (req, res) => {
  try {
    const { email, password } = req.body;
    const user = await User.findOne({ email });
    if (!user) {
      return res.status(401).json({ message: "Invalid email or password" });
    }

    if (user.password !== password) {
      return res.status(401).json({ message: "Invalid password" });
    }

    const token = jwt.sign({ userId: user._id }, crypto.randomBytes(32).toString("hex"));
    res.status(200).json({ token });
  } catch (error) {
    res.status(500).json({ message: "Login Failed" });
  }
});

//Create a new store
app.post('/createstore', async (req, res) => {
  try {
      const { name, owner, location,books } = req.body;

      // Create a new store
      const newStore = new Store({ name, owner, location,books });
      await newStore.save();

      return res.status(201).json({ message: 'New store created successfully', store: newStore });
  } catch (err) {
      console.error(err);
      return res.status(500).json({ error: 'Internal server error' });
  }
});

app.post("/createbook", async (req, res) => {
  try {
    const { name, authors, publisher, publishingyear, category, callnumber, stores, image } = req.body;

    // Check if the book already exists
    let existingBook = await Book.findOne({ name });

    if (existingBook) {
      // Book already exists, update stores array if necessary
      for (const storeInfo of stores) {
        const storeId = storeInfo.store;
        const existingStoreInfo = existingBook.stores.find(store => store.store.equals(storeId));
        if (!existingStoreInfo) {
          existingBook.stores.push(storeInfo);
          await existingBook.save();
        }else{
          return res.status(500).json({ message: "This book is already stored in this store" });
        }
      }      
    } else {
      // Book doesn't exist, create a new one
      const newBook = new Book({ 
        name, 
        authors, 
        publisher, 
        publishingyear, 
        category, 
        callnumber, 
        image,
        stores: stores.map(storeInfo => ({ store: storeInfo.store, price: storeInfo.price, quantity: storeInfo.quantity }))
      });
      await newBook.save();
      existingBook = newBook;
    }

    // Update stores with book information
    for (const storeInfo of stores) {
      const storeId = storeInfo.store;
      const store = await Store.findById(storeId);
      store.books.push({ book: existingBook._id });
      await store.save();
    }
    return res.status(201).json({ message: "New book created successfully" });
  } catch (error) {
    console.error('Error adding new book or store information:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
});
