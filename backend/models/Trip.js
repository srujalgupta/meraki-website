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
  trending: Boolean,

  packages: [
    {
      name: String,
      price: Number,
      duration: String,
      pdf: String
    }
  ]
});

module.exports = mongoose.model("Trip", tripSchema);