const mongoose = require("mongoose");

const tripSchema = new mongoose.Schema({
  title: String,
  location: String,
  price: Number,
  duration: String,
  image: String,
  description: String,
  rating: Number,
  category: String,
  trending: Boolean
});

module.exports = mongoose.model("Trip", tripSchema);