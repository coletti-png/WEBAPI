const express = require("express");
const mongoose = require("mongoose");
const bodyParser = require("body-parser");
const path = require("path");
const session = require("express-session");
const bcrypt = require("bcryptjs");
const Item = require("./models/Item");
const { register } = require("module");
const app = express();
const port = process.env.port||3000;
//Create public folder as static
app.use(express.static(path.join(__dirname,"public")));
//Set up middleware to parse json requests
app.use(bodyParser.json());
app.use(express.urlencoded({extended:true}));

//sets up the session variable
app.use(session({
    secret:"12345",
    resave:false,
    saveUninitialized:false,
    cookie:{secure:false}// Set to true is using https
}));


function isAuthenticated(req,res, next){
    if(req.session.item)return next();
    return res.redirect("/Index.html");
}



//MongoDB connection setup
const mongoURI = "mongodb://localhost:27017/crudapp";
mongoose.connect(mongoURI);

const db = mongoose.connection;

db.on("error", console.error.bind(console, "MongoDB connection error"));
db.once("open", ()=>{
    console.log("Connected to MongoDB Database");
});


  






//Read routes
app.get("/ItemData", async (req, res)=>{
    try{
        const item = await Item.find();
        res.json(item);
        console.log(item);
    }catch(err){
        res.status(500).json({error:"Failed to get item."});
    }
});

app.get("/ItemData/:id", async (req,res)=>{
    try{
        console.log(req.params.id);
        const item = await Item.findById(req.params.id);
        if(!item){
            return res.status(404).json({error:"{Item not found}"});
        }
        res.json(item);

    }catch(err){
        res.status(500).json({error:"Failed to get item."});
    }
});

//Create routes
app.post("/additem", async (req, res)=>{
    try{
        const newItem = new Item(req.body);
        const saveItem = await newItem.save();
        //res.status(201).json(saveItem);
        res.redirect("/index.html");
        console.log(saveItem);
    }catch(err){
        res.status(501).json({error:"Failed to add new item."});
    }
});



//Update Route
app.delete("/deleteitem/:id", async (req, res) => {
  try {
    const itemId = req.params.id;
    await Item.findByIdAndDelete(itemId);
    res.json({ message: "Item deleted successfully" });
  } catch (err) {
    res.status(500).json({ error: "Failed to delete item" });
  }
});

// Update route
app.put("/updateitem/:id", async (req, res) => {
  try {
    const itemId = req.params.id;
    const updatedData = req.body;
    const updatedItem = await Item.findByIdAndUpdate(itemId, updatedData, {
      new: true,
      runValidators: true,
    });
    res.json(updatedItem);
  } catch (err) {
    res.status(500).json({ error: "Failed to update item" });
  }
});

//Starts the server
app.listen(port, ()=>{
    console.log(`Server is running on port ${port}`);
});