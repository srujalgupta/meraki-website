const express = require("express");
const cors = require("cors");

const app = express();

app.use(cors());
app.use(express.json());

// TEST ROUTE
app.get("/", (req, res) => {
  res.send("Backend Running 🚀");
});

// TRIPS DATA
app.get("/trips", (req, res) => {
  res.json([
    {
      title: "Spiti Winter Expedition",
      price: 17999,
      image: "https://images.pexels.com/photos/2901209/pexels-photo-2901209.jpeg",
      duration: "7N/8D",
      location: "Spiti Valley",
      highlights: [
        "Key Monastery",
        "Chicham Bridge",
        "Hikkim Post Office"
      ],
      itinerary: [
        "Delhi to Shimla",
        "Shimla to Kalpa",
        "Kalpa to Kaza"
      ]
    },
    {
      title: "Manali Adventure",
      price: 12499,
      image: "https://images.pexels.com/photos/2387873/pexels-photo-2387873.jpeg",
      duration: "5N/6D",
      location: "Manali",
      highlights: [
        "Solang Valley",
        "Atal Tunnel",
        "Snow Activities"
      ],
      itinerary: [
        "Delhi to Manali",
        "Solang Valley visit",
        "Rohtang Pass"
      ]
    },
    {
      title: "Kashmir Paradise",
      price: 19999,
      image: "https://images.pexels.com/photos/1586298/pexels-photo-1586298.jpeg",
      duration: "6N/7D",
      location: "Kashmir",
      highlights: [
        "Dal Lake",
        "Gulmarg",
        "Sonmarg"
      ],
      itinerary: [
        "Arrival in Srinagar",
        "Gulmarg visit",
        "Sonmarg trip"
      ]
    }
  ]);
});

// BOOKING API
app.post("/book", (req, res) => {
  console.log("Booking:", req.body);
  res.json({ message: "Booking successful" });
});

// START SERVER
app.listen(5000, () => {
  console.log("Server running on port 5000");
});