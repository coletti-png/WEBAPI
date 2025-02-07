const express = require("express");
const mongoose = require("mongoose");
const bodyParser = require("body-parser");
const path = require("path");
const session = require("express-session");
const bcrypt = require("bcryptjs");
const FavoriteThings = require("./models/FavoriteThings");
const User = require("./models/User");

const app = express();
const port = process.env.PORT || 3000;

// MongoDB connection setup
const mongoURI = "mongodb://localhost:27017/crudapp";
mongoose.connect(mongoURI, { useNewUrlParser: true, useUnifiedTopology: true });

const db = mongoose.connection;
db.on("error", console.error.bind(console, "MongoDB connection error"));
db.once("open", () => {
  console.log("Connected to MongoDB Database");
});

// Middleware to serve static files
app.use(express.static(path.join(__dirname, "public")));

// Middleware to parse JSON requests
app.use(bodyParser.json());
app.use(express.urlencoded({ extended: true }));

// Session setup
app.use(
  session({
    secret: "12345",
    resave: false,
    saveUninitialized: false,
    cookie: { secure: false }, // Set to true if using HTTPS
  })
);

// Authentication middleware
function isAuthenticated(req, res, next) {
  if (req.session.user) {
    return next();
  }
  return res.redirect("/login");
}



// Serve registration page
app.get("/register", (req, res) => {
  res.sendFile(path.join(__dirname, "public", "register.html"));
});

// Handle registration
app.post("/register", async (req, res) => {
  try {
    const { username, password, email } = req.body;
    const existingUser = await User.findOne({ username });

    if (existingUser) {
      return res.send("Error: Username already taken");
    }

    const hashedPassword = bcrypt.hashSync(password, 10);
    const newUser = new User({ username, password: hashedPassword, email });
    await newUser.save();

    res.redirect("/login");
  } catch (err) {
    res.status(500).send("Error registering new user");
  }
});

app.get("/",(req,res)=>{
  res.sendFile("index.html");
});

// Serve users page (protected)
app.get("/users", isAuthenticated, (req, res) => {
  res.sendFile(path.join(__dirname, "public", "users.html"));
});

app.get("/login", (req,res)=>{
  res.sendFile(path.join(__dirname  + "/public/login.html"));
});


// Handle login
app.post("/login", async (req,res)=>{
  const {username, password} = req.body;
  console.log(req.body);

  const user = await User.findOne({username});

  if(user && bcrypt.compareSync(password, user.password)){
      req.session.user = username;
      return res.redirect("/users");
  }
  req.session.error = "Invalid User";
  return res.redirect("/login")
});
// Handle logout
app.get("/logout", (req, res) => {
  req.session.destroy(() => {
    res.redirect("/login");
  });
});

// API Routes

// Get all favorite things
app.get("/favoritethings", async (req, res) => {
  try {
    const favoritethings = await FavoriteThings.find();
    res.json(favoritethings);
  } catch (err) {
    res.status(500).json({ error: "Failed to get favorite things." });
  }
});

// Get a specific favorite thing by ID
app.get("/favoritethings/:id", async (req, res) => {
  try {
    const favthing = await FavoriteThings.findById(req.params.id);
    if (!favthing) {
      return res.status(404).json({ error: "Favorite thing not found." });
    }
    res.json(favthing);
  } catch (err) {
    res.status(500).json({ error: "Failed to get favorite thing." });
  }
});

// Add a new favorite thing
app.post("/addfavoritething", async (req, res) => {
  try {
    const newThing = new FavoriteThings(req.body);
    await newThing.save();
    res.redirect("/users.html");
  } catch (error) {
    res.status(500).json({ error: "Failed to add new favorite thing." });
  }
});

// Update a favorite thing by ID
app.put("/updatefavoritething/:id", async (req, res) => {
  try {
    const updatedItem = await FavoriteThings.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true, runValidators: true }
    );
    res.json(updatedItem);
  } catch (err) {
    res.status(500).json({ error: "Failed to update favorite thing." });
  }
});

// Delete a favorite thing by ID
app.delete("/deletefavoritething/:id", async (req, res) => {
  try {
    await FavoriteThings.findByIdAndDelete(req.params.id);
    res.json({ message: "Favorite thing deleted successfully" });
  } catch (err) {
    res.status(500).json({ error: "Failed to delete favorite thing." });
  }
});

// Start the server
app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});
