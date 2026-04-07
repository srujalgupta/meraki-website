const express = require("express");
const cors = require("cors");

const app = express();

// ✅ FIX CORS
app.use(cors({
  origin: "https://meraki-website-1zna.vercel.app"
}));

app.use(express.json());

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

app.listen(5000, () => {
  console.log("Server running on port 5000");
});