const express = require("express");
const cors = require("cors");

const app = express();

// ✅ Middleware
app.use(cors());
app.use(express.json());

// ✅ Root route (test if server is live)
app.get("/", (req, res) => {
  res.send("Backend is working 🚀");
});

// ✅ Trips API
app.get("/trips", (req, res) => {
  res.json([
    {
      id: 1,
      title: "Spiti Winter Expedition",
      price: 17999,
      image: "https://images.pexels.com/photos/2901209/pexels-photo-2901209.jpeg",
      location: "Spiti Valley"
    },
    {
      id: 2,
      title: "Manali Adventure",
      price: 12499,
      image: "https://images.pexels.com/photos/2387873/pexels-photo-2387873.jpeg",
      location: "Manali"
    },
    {
      id: 3,
      title: "Kashmir Paradise",
      price: 19999,
      image: "https://images.pexels.com/photos/1586298/pexels-photo-1586298.jpeg",
      location: "Kashmir"
    }
  ]);
});

// ✅ Handle unknown routes (prevents confusion)
app.use((req, res) => {
  res.status(404).json({ message: "Route not found ❌" });
});

// ✅ Server start
const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});