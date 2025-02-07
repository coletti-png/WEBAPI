const mongoose = require("mongoose");

//Setup Mongoose Schema
const favoritethings = new mongoose.Schema({
    favoritething:{type:String, required: true},
});

const FavoriteThings = mongoose.model("FavoriteThings", favoritethings, "favoritethings");
module.exports = FavoriteThings;