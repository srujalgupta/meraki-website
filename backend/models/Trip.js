const mongoose = require("mongoose");

const tripSchema = new mongoose.Schema({
  title: String,
  location: String,
  price: Number,
  duration: String,
  image: String,
  description: String,
  about: String,
  bestFor: [String],
  highlights: [String],
  itinerary: [
    {
      title: String,
      description: String
    }
  ],
  inclusions: [String],
  exclusions: [String],
  gallery: [String],
  faqs: [
    {
      question: String,
      answer: String
    }
  ],
  batchDates: [
    {
      date: String,
      slots: Number
    }
  ],
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
