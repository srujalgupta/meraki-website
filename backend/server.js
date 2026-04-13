const mongoose = require("mongoose");
require("dotenv").config();

const express = require("express");
const cors = require("cors");
const Trip = require("./models/Trip");

const app = express();
const PORT = 5000;

// ✅ MongoDB Connection
mongoose.connect(process.env.MONGO_URI)
  .then(() => console.log("MongoDB Connected ✅"))
  .catch((err) => console.log(err));

// ✅ Middleware
app.use(cors({
  origin: ["http://localhost:3000", "http://localhost:5173"],
  methods: ["GET", "POST", "PUT", "DELETE"],
  credentials: true
}));

app.use(express.json());
app.use(express.static("public"));

// ================= ROOT =================
app.get("/", (req, res) => {
  res.json({
    success: true,
    message: "Meraki Tribe API is running"
  });
});

// ================= TRIPS =================

// ✅ GET all trips (from MongoDB)
app.get("/trips", async (req, res) => {
  try {
    const trips = await Trip.find();
    res.json(trips);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// ✅ ADD trip
app.post("/trips", async (req, res) => {
  try {
    const {
      title,
      location,
      price,
      duration,
      image,
      description,
      rating,
      category,
      trending,
      packages
    } = req.body;

    const newTrip = new Trip({
      title,
      location,
      price,
      duration,
      image,
      description,
      rating,
      category,
      trending,
      packages   // 🔥 THIS IS IMPORTANT
    });

    await newTrip.save();

    res.status(201).json({
      success: true,
      message: "Trip added successfully",
      trip: newTrip
    });

  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
});

app.put("/trips/:id", async (req, res) => {
  try {
    const updatedTrip = await Trip.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true }
    );

    res.json({
      success: true,
      message: "Trip updated successfully",
      trip: updatedTrip
    });

  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
});


// ================= 404 =================
app.use((req, res) => {
  res.status(404).json({
    success: false,
    message: "Route not found"
  });
});

// ================= START =================
app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});