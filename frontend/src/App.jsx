import React from "react";
import { useEffect, useState } from "react";
import axios from "axios";
import { Routes, Route, useNavigate, useParams } from "react-router-dom";
import { FaYoutube, FaInstagram, FaLinkedin, FaWhatsapp } from "react-icons/fa";

/* ================= NAVBAR ================= */
function Navbar() {
  return (
    <div className="fixed top-0 w-full bg-black/60 backdrop-blur-md px-6 py-3 z-50 text-white flex items-center justify-between">
      <div className="flex items-center gap-3">
        <img src="/logo.png" className="w-10 h-10 rounded-full" />
        <h2 className="font-bold text-lg">Meraki Tribe</h2>
      </div>
    </div>
  );
}

/* ================= WHY US ================= */
function WhyUs() {
  const features = [
    { title: "Safety First", desc: "24x7 support, verified stays & trained leaders.", icon: "🛡️" },
    { title: "Eco Friendly", desc: "Responsible travel & sustainable practices.", icon: "🌱" },
    { title: "Community", desc: "Meet like-minded explorers & make friends.", icon: "🌍" },
    { title: "Premium Service", desc: "Comfortable & well-planned experiences.", icon: "⭐" },
    { title: "Expert Leaders", desc: "Experienced trip captains for guidance.", icon: "🧭" },
    { title: "Hassle-Free", desc: "We manage everything for you.", icon: "🧳" }
  ];

  return (
    <div className="bg-black text-white py-24">
      <h2 className="text-center text-4xl font-bold text-yellow-400 mb-16">
        Why Meraki Tribe Stands Out
      </h2>

      <div className="max-w-7xl mx-auto px-6 grid md:grid-cols-3 gap-10">
        {features.map((f, i) => (
          <div key={i}
            className="bg-white/10 backdrop-blur-lg border border-white/20 p-8 rounded-2xl hover:scale-105 hover:shadow-2xl transition">

            <div className="text-5xl mb-4">{f.icon}</div>
            <h3 className="text-xl font-semibold mb-2">{f.title}</h3>
            <p className="text-gray-400 text-sm">{f.desc}</p>

          </div>
        ))}
      </div>
    </div>
  );
}

/* ================= HOME ================= */
function Home() {
  const [trips, setTrips] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    axios
      .get("https://meraki-backend.onrender.com/trips")
      .then((res) => setTrips(res.data || []))
      .catch((err) => {
        console.log("API Error:", err);
        setTrips([]); // prevent crash
      });
  }, []);

  return (
    <div className="bg-black text-white min-h-screen">
      <Navbar />

      <div className="p-6 grid md:grid-cols-3 gap-8">
        {trips.map((trip, i) => (
          <div key={i}
            onClick={() => navigate(`/trip/${i}`)}
            className="bg-white/10 p-4 rounded-xl hover:scale-105 cursor-pointer">

            <img src={trip.image} className="h-60 w-full object-cover" />
            <h2>{trip.title}</h2>
            <p>₹{trip.price}</p>

          </div>
        ))}
      </div>

      <WhyUs />
    </div>
  );
}

/* ================= TRIP DETAIL ================= */
function TripDetail() {
  const { id } = useParams();
  const [trip, setTrip] = useState(null);

  useEffect(() => {
    axios
      .get("https://meraki-backend.onrender.com/trips")
      .then((res) => {
        const index = Number(id);
        if (!isNaN(index) && res.data && res.data[index]) {
          setTrip(res.data[index]);
        }
      })
      .catch((err) => {
        console.log("API Error:", err);
      });
  }, [id]);

  if (!trip) return <div className="text-white p-10">Loading...</div>;

  return (
    <div className="bg-black text-white min-h-screen">
      <Navbar />
      <h1 className="p-10 text-3xl">{trip.title}</h1>
    </div>
  );
}

/* ================= APP ================= */
function App() {
  return (
    <Routes>
      <Route path="/" element={<Home />} />
      <Route path="/trip/:id" element={<TripDetail />} />
    </Routes>
  );
}

export default App;