const express = require("express");
const cors = require("cors");

const app = express();

// ✅ allow all origins (for now)
app.use(cors());

app.use(express.json());

// ✅ root test route
app.get("/", (req, res) => {
  res.send("Backend is working 🚀");
});

// ✅ trips route
app.get("/trips", (req, res) => {
  res.json([
    {
      title: "Spiti Winter Expedition",
      price: 17999,
      image: "https://images.pexels.com/photos/2901209/pexels-photo-2901209.jpeg",
      location: "Spiti Valley"
    },
    {
      title: "Manali Adventure",
      price: 12499,
      image: "https://images.pexels.com/photos/2387873/pexels-photo-2387873.jpeg",
      location: "Manali"
    },
    {
      title: "Kashmir Paradise",
      price: 19999,
      image: "https://images.pexels.com/photos/1586298/pexels-photo-1586298.jpeg",
      location: "Kashmir"
    }
  ]);
});

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
  console.log("Server running on port", PORT);
});