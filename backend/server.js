const express = require("express");
const cors = require("cors");

const app = express();
const PORT = 5000;

app.use(
  cors({
    origin: ["http://localhost:3000", "http://localhost:5173"],
    methods: ["GET", "POST", "PUT", "DELETE"],
    credentials: true
  })
);

app.use(express.json());

/* ================= DATA ================= */
let trips = [
  {
    id: 1,
    title: "Spiti Winter Expedition",
    location: "Spiti Valley, Himachal Pradesh",
    price: 17999,
    duration: "6 Days / 5 Nights",
    image: "https://images.pexels.com/photos/2901209/pexels-photo-2901209.jpeg",
    description:
      "A thrilling winter road trip through snowy Himalayan landscapes, monasteries, and frozen rivers.",
    rating: 4.9,
    category: "Adventure",
    trending: true
  },
  {
    id: 2,
    title: "Goa Beach Escape",
    location: "Goa",
    price: 9999,
    duration: "4 Days / 3 Nights",
    image: "https://images.pexels.com/photos/1450353/pexels-photo-1450353.jpeg",
    description:
      "Enjoy beach sunsets, watersports, nightlife, and relaxed coastal stays with your travel tribe.",
    rating: 4.7,
    category: "Leisure",
    trending: true
  },
  {
    id: 3,
    title: "Kasol & Kheerganga Trek",
    location: "Kasol, Himachal Pradesh",
    price: 7499,
    duration: "3 Days / 2 Nights",
    image: "https://images.pexels.com/photos/2387873/pexels-photo-2387873.jpeg",
    description:
      "A short mountain escape with riverside cafés, scenic trails, and the iconic Kheerganga trek.",
    rating: 4.8,
    category: "Trekking",
    trending: false
  },
  {
    id: 4,
    title: "Udaipur Royal Retreat",
    location: "Udaipur, Rajasthan",
    price: 11999,
    duration: "3 Days / 2 Nights",
    image: "https://images.pexels.com/photos/3581364/pexels-photo-3581364.jpeg",
    description:
      "Explore lakes, palaces, heritage streets, and evening cultural experiences in the city of lakes.",
    rating: 4.6,
    category: "Culture",
    trending: false
  },
  {
    id: 5,
    title: "Rishikesh Adventure Camp",
    location: "Rishikesh, Uttarakhand",
    price: 8999,
    duration: "3 Days / 2 Nights",
    image: "https://images.pexels.com/photos/1268855/pexels-photo-1268855.jpeg",
    description:
      "Perfect for thrill seekers with rafting, bonfire nights, riverside camping, and mountain views.",
    rating: 4.8,
    category: "Adventure",
    trending: true
  },
  {
    id: 6,
    title: "Manali Snow Getaway",
    location: "Manali, Himachal Pradesh",
    price: 13999,
    duration: "5 Days / 4 Nights",
    image: "https://images.pexels.com/photos/417074/pexels-photo-417074.jpeg",
    description:
      "Experience snow-covered valleys, cafes, local markets, and unforgettable scenic drives.",
    rating: 4.7,
    category: "Mountain",
    trending: false
  }
];

let reviews = [
  {
    id: 1,
    name: "Aarav Sharma",
    place: "Delhi",
    rating: 5,
    text: "The Spiti trip was perfectly managed. The vibe, stays, and people were amazing."
  },
  {
    id: 2,
    name: "Priya Mehta",
    place: "Ahmedabad",
    rating: 5,
    text: "I loved the community feeling. It did not feel like a normal tour, it felt personal."
  },
  {
    id: 3,
    name: "Rohan Verma",
    place: "Pune",
    rating: 5,
    text: "Very smooth coordination and beautiful locations. Definitely booking again."
  },
  {
    id: 4,
    name: "Sneha Kapoor",
    place: "Mumbai",
    rating: 4,
    text: "The planning and support were great. The group energy made the whole experience better."
  }
];

let bookings = [];

/* ================= ROOT ================= */
app.get("/", (req, res) => {
  res.json({
    success: true,
    message: "Meraki Tribe API is running"
  });
});

/* ================= TRIPS ================= */
app.get("/trips", (req, res) => {
  res.json(trips);
});

app.get("/trips/:id", (req, res) => {
  const tripId = Number(req.params.id);
  const trip = trips.find((item) => item.id === tripId);

  if (!trip) {
    return res.status(404).json({
      success: false,
      message: "Trip not found"
    });
  }

  res.json(trip);
});

/* ================= REVIEWS ================= */
app.get("/reviews", (req, res) => {
  res.json(reviews);
});

/* ================= SEARCH ================= */
app.get("/search", (req, res) => {
  const { location, category, trending } = req.query;
  let filteredTrips = [...trips];

  if (location) {
    filteredTrips = filteredTrips.filter((trip) =>
      trip.location.toLowerCase().includes(location.toLowerCase())
    );
  }

  if (category) {
    filteredTrips = filteredTrips.filter(
      (trip) => trip.category.toLowerCase() === category.toLowerCase()
    );
  }

  if (trending !== undefined) {
    filteredTrips = filteredTrips.filter(
      (trip) => String(trip.trending) === String(trending)
    );
  }

  res.json(filteredTrips);
});

/* ================= BOOKINGS ================= */
app.post("/bookings", (req, res) => {
  const { name, email, phone, tripId, travelers } = req.body;

  if (!name || !email || !phone || !tripId) {
    return res.status(400).json({
      success: false,
      message: "name, email, phone and tripId are required"
    });
  }

  const trip = trips.find((item) => item.id === Number(tripId));

  if (!trip) {
    return res.status(404).json({
      success: false,
      message: "Trip not found for booking"
    });
  }

  const booking = {
    id: bookings.length + 1,
    name,
    email,
    phone,
    tripId: Number(tripId),
    tripTitle: trip.title,
    travelers: travelers || 1,
    totalPrice: trip.price * (travelers || 1),
    bookedAt: new Date().toISOString()
  };

  bookings.push(booking);

  res.status(201).json({
    success: true,
    message: "Booking created successfully",
    booking
  });
});

app.get("/bookings", (req, res) => {
  res.json(bookings);
});

/* ================= ADD REVIEW ================= */
app.post("/reviews", (req, res) => {
  const { name, place, rating, text } = req.body;

  if (!name || !place || !rating || !text) {
    return res.status(400).json({
      success: false,
      message: "name, place, rating and text are required"
    });
  }

  const review = {
    id: reviews.length + 1,
    name,
    place,
    rating: Number(rating),
    text
  };

  reviews.push(review);

  res.status(201).json({
    success: true,
    message: "Review added successfully",
    review
  });
});

/* ================= 404 ================= */
app.use((req, res) => {
  res.status(404).json({
    success: false,
    message: "Route not found"
  });
});

/* ================= START ================= */
app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});