import React, { useEffect, useState } from "react";
import axios from "axios";
import { Routes, Route, useNavigate, useParams, Link } from "react-router-dom";
import {
  FaYoutube,
  FaInstagram,
  FaLinkedinIn,
  FaWhatsapp,
  FaMapMarkerAlt,
  FaPhoneAlt,
  FaEnvelope,
  FaClock,
} from "react-icons/fa";
import API from "./api";

const WHATSAPP_NUMBER = "919662351358";

const openWhatsAppBooking = (trip) => {
  const message = `Hello, I want to book this trip:

🌍 Trip: ${trip.title}
📍 Location: ${trip.location || "N/A"}
💰 Price: ₹${trip.price}

Please share details.`;

  const url = `https://wa.me/${WHATSAPP_NUMBER}?text=${encodeURIComponent(message)}`;
  window.open(url, "_blank");
};

/* ================= LIVE BACKGROUND ================= */
function LiveBackground() {
  return (
    <div className="fixed inset-0 z-0">
      
      {/* VIDEO */}
      <video
        autoPlay
        loop
        muted
        playsInline
        className="absolute top-0 left-0 w-full h-full object-cover"
      >
        <source src="/hero.mp4" type="video/mp4" />
      </video>

      {/* DARK OVERLAY */}
      <div className="absolute inset-0 bg-black/60"></div>
    </div>
  );
}
/* ================= NAVBAR ================= */
function Navbar() {
  return (
    <header className="fixed top-0 left-0 z-50 w-full border-b border-orange-400/20 bg-black/70 backdrop-blur-md">
      <div className="mx-auto flex max-w-7xl items-center justify-between px-6 py-3 text-white">
        
        <Link to="/" className="flex items-center gap-3">
          <img
            src="/logo.png"
            alt="logo"
            className="h-10 w-10 rounded-full object-cover"
          />
          <h2 className="text-lg font-bold text-orange-400">
            The Meraki Tribe
          </h2>
        </Link>

        <a
          href="https://wa.me/919662351358"
          target="_blank"
          rel="noopener noreferrer"
          className="flex items-center gap-2 rounded-full bg-green-500 px-4 py-2 text-sm font-semibold text-white hover:bg-green-600"
        >
          Book Now
        </a>
      </div>
    </header>
  );
}
/* ================= WHY US ================= */
function WhyUs() {
  const features = [
    {
      title: "SAFETY FIRST",
      desc: "We prioritize your safety with special measures for solo and female travelers, ensuring a secure and comfortable journey from start to finish.",
      icon: "🛡️",
    },
    {
      title: "ECO-FRIENDLY COMMITMENT",
      desc: "Our tree-planting initiative neutralizes your carbon footprint, promoting responsible travel and making a positive impact on the environment.",
      icon: "🌍",
    },
    {
      title: "COMMUNITY OF EXPLORERS",
      desc: "Join like-minded travelers who share your passion for adventure. Our curated group trips foster connections and create lasting friendships.",
      icon: "🥾",
    },
    {
      title: "SEAMLESS, PASSIONATE SERVICE",
      desc: "We handle all trip details to ensure a smooth experience, driven by our love for travel and a commitment to making your journey memorable.",
      icon: "🤍",
    },
  ];

  return (
    <section className="pt-24 pb-10 text-white">
      <div className="mx-auto max-w-7xl px-6">
        <h2 className="mx-auto mb-14 w-fit border-b border-orange-400/40 pb-4 text-center text-3xl font-light tracking-[0.25em] text-orange-400 md:text-5xl">
          Why The Meraki Tribe Stands Out
        </h2>

        <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-4">
          {features.map((feature, index) => (
            <article
              key={index}
              className="min-h-[370px] rounded-xl bg-white p-7 text-black shadow-lg transition duration-500 hover:-translate-y-2 hover:shadow-2xl"
            >
              <div className="text-4xl">{feature.icon}</div>
              <h3 className="mt-6 text-xl font-extrabold leading-snug">
                {feature.title}
              </h3>
              <p className="mt-5 text-base leading-8 text-gray-700">
                {feature.desc}
              </p>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}

/* ================= MOVING REVIEWS ================= */
function Reviews() {
  const reviews = [
    {
      name: "Aarav Sharma",
      place: "Delhi",
      text: "Amazing trip planning and very smooth coordination. Everything felt premium and safe.",
    },
    {
      name: "Priya Mehta",
      place: "Ahmedabad",
      text: "Loved the group vibe and the support team. It truly felt like traveling with a tribe.",
    },
    {
      name: "Rohan Verma",
      place: "Pune",
      text: "Best backpacking experience I have had. The itinerary and stays were very well managed.",
    },
    {
      name: "Sana Khan",
      place: "Mumbai",
      text: "The booking process was easy and the whole trip was unforgettable. Highly recommended.",
    },
  ];

  const duplicatedReviews = [...reviews, ...reviews];

  return (
    <section className="py-24 text-white">
      <div className="mx-auto max-w-7xl px-6">
        <h2 className="mb-4 text-center text-4xl font-bold text-orange-400">
          Traveler Reviews
        </h2>
        <p className="mx-auto mb-10 max-w-2xl text-center text-gray-300">
          Real experiences from people who traveled with us.
        </p>

        <div className="overflow-hidden">
          <div className="flex w-max animate-marquee gap-6">
            {duplicatedReviews.map((review, index) => (
              <div
                key={index}
                className="w-[320px] shrink-0 rounded-2xl border border-white/10 bg-white/5 p-6 backdrop-blur-md"
              >
                <div className="mb-3 text-xl text-orange-400">★★★★★</div>
                <p className="leading-7 text-gray-200">“{review.text}”</p>
                <h3 className="mt-5 text-lg font-semibold text-white">
                  {review.name}
                </h3>
                <p className="text-sm text-gray-400">{review.place}</p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}

/* ================= TRIP CARD ================= */
function TripCard({ trip, onClick }) {
  return (
    <article className="group overflow-hidden rounded-3xl border border-white/10 bg-white/5 backdrop-blur-md transition duration-500 hover:-translate-y-3 hover:bg-white/10 hover:shadow-[0_25px_80px_rgba(0,0,0,0.45)]">
      <div className="cursor-pointer overflow-hidden" onClick={onClick}>
        <img
          src={trip.image}
          alt={trip.title}
          className="h-64 w-full object-cover transition duration-700 group-hover:scale-110"
        />
      </div>

      <div className="p-5">
        <div className="flex items-center justify-between gap-4">
          <h3
            onClick={onClick}
            className="cursor-pointer text-xl font-bold text-white"
          >
            {trip.title}
          </h3>
          <span className="rounded-full border border-orange-400/20 bg-orange-400/10 px-3 py-1 text-xs text-orange-300">
            Trending
          </span>
        </div>

        <p className="mt-2 text-sm text-gray-400">
          {trip.location || "Adventure destination"}
        </p>

        <p className="mt-4 text-2xl font-semibold text-orange-400">
          ₹{trip.price}
        </p>

        <div className="mt-6 flex gap-3">
          <button
            onClick={onClick}
            className="flex-1 rounded-xl border border-orange-400/30 bg-orange-400/10 px-4 py-3 font-medium text-orange-300 transition hover:bg-orange-400/20"
          >
            View Details
          </button>

          <button
            onClick={() => openWhatsAppBooking(trip)}
            className="flex flex-1 items-center justify-center gap-2 rounded-xl bg-green-500 px-4 py-3 font-semibold text-white transition hover:bg-green-600"
          >
            <FaWhatsapp />
            Book Trip
          </button>
        </div>
      </div>
    </article>
  );
}

/* ================= HOME ================= */
function Home() {
  const [trips, setTrips] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const navigate = useNavigate();

  useEffect(() => {
    axios
      .get(`${API}/trips`)
      .then((res) => setTrips(res.data || []))
      .catch((err) => {
        console.error(err);
        setError("Failed to load trips.");
      })
      .finally(() => setLoading(false));
  }, []);

  return (
    <main className="relative z-10 min-h-screen text-white">
      <LiveBackground />
      <Navbar />

      <section className="mx-auto max-w-7xl px-6 pb-12 pt-28">
        <div className="mb-12 max-w-3xl animate-fadeInUp">
          <p className="mb-3 text-sm uppercase tracking-[0.35em] text-orange-400">
            Adventure reimagined
          </p>
          <h1 className="text-4xl font-bold leading-tight md:text-6xl">
            Travel with stories,
            <span className="block text-white/80">not just itineraries.</span>
          </h1>
          <p className="mt-4 max-w-2xl text-lg text-gray-300">
            Discover unforgettable backpacking journeys and book instantly on WhatsApp.
          </p>
        </div>

        {loading && <div className="py-10 text-gray-300">Loading trips...</div>}

        {error && (
          <div className="rounded-xl border border-red-500/30 bg-red-500/10 p-4 text-red-300">
            {error}
          </div>
        )}

        {!loading && !error && trips.length > 0 && (
          <div className="grid gap-8 sm:grid-cols-2 lg:grid-cols-3">
            {trips.map((trip, index) => (
              <TripCard
                key={trip.id ?? index}
                trip={trip}
                onClick={() => navigate(`/trip/${trip.id ?? index}`)}
              />
            ))}
          </div>
        )}
      </section>

      <Reviews />
      <WhyUs />
      <Footer />
      <FloatingWhatsApp />
    </main>
  );
}


/* ================= TRIP DETAIL ================= */
function TripDetail() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [trip, setTrip] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const [selectedImage, setSelectedImage] = useState(null);
  const [travelDate, setTravelDate] = useState("");
  const [people, setPeople] = useState(1);

  const today = new Date().toISOString().split("T")[0];

  useEffect(() => {
    axios
      .get(`${API}/trips`)
      .then((res) => {
        const trips = res.data || [];
        const selectedTrip =
          trips.find((item) => String(item.id) === String(id)) ?? trips[Number(id)];

        if (!selectedTrip) {
          setError("Trip not found.");
          return;
        }

        setTrip(selectedTrip);
      })
      .catch((err) => {
        console.error(err);
        setError("Failed to load trip details.");
      })
      .finally(() => {
        setLoading(false);
      });
  }, [id]);

  return (
    <main className="relative min-h-screen bg-black text-white">
      <LiveBackground />
      <Navbar />

      <section className="mx-auto max-w-6xl px-6 pb-12 pt-28">
        <button
          onClick={() => navigate("/")}
          className="mb-6 rounded-lg border border-white/10 bg-white/10 px-4 py-2 transition hover:bg-white/15"
        >
          ← Back
        </button>

        {loading && <div className="text-gray-300">Loading trip details...</div>}

        {error && (
          <div className="rounded-xl border border-red-500/30 bg-red-500/10 p-4 text-red-300">
            {error}
          </div>
        )}

        {!loading && !error && trip && (
          <article className="overflow-hidden rounded-3xl border border-white/10 bg-white/5 backdrop-blur-md">
            
            <img
              src={trip.image}
              alt={trip.title}
              className="h-72 w-full object-cover md:h-[28rem]"
            />

            <div className="p-6 md:p-8 grid md:grid-cols-3 gap-8">

              {/* LEFT SIDE (DETAILS) */}
              <div className="md:col-span-2">
                
                <p className="mb-3 text-sm uppercase tracking-[0.3em] text-orange-400">
                  {trip.location || "Featured destination"}
                </p>

                <h1 className="text-4xl font-bold">{trip.title}</h1>

                <p className="mt-4 text-2xl font-semibold text-orange-400">
                  ₹{trip.price}
                </p>

                {/* DESCRIPTION */}
                <p className="mt-6 leading-8 text-gray-300">
                  {trip.description ||
                    "A curated travel experience with beautiful views, smooth planning, and a vibrant explorer community."}
                </p>

                {/* ITINERARY */}
                <div className="mt-8">
                  <h2 className="text-2xl font-bold text-orange-400">Itinerary</h2>
                  <ul className="mt-4 space-y-2 text-gray-300">
                    <li>Day 1: Arrival & Check-in</li>
                    <li>Day 2: Sightseeing</li>
                    <li>Day 3: Adventure Activities</li>
                    <li>Day 4: Departure</li>
                  </ul>
                </div>

                {/* INCLUSIONS */}
                <div className="mt-8">
                  <h2 className="text-2xl font-bold text-green-400">Inclusions</h2>
                  <ul className="mt-4 space-y-2 text-gray-300">
                    <li>✔ Stay</li>
                    <li>✔ Meals</li>
                    <li>✔ Transport</li>
                  </ul>
                </div>

                {/* EXCLUSIONS */}
                <div className="mt-8">
                  <h2 className="text-2xl font-bold text-red-400">Exclusions</h2>
                  <ul className="mt-4 space-y-2 text-gray-300">
                    <li>✘ Personal expenses</li>
                    <li>✘ Extra activities</li>
                  </ul>
                </div>

                {/* GALLERY */}
                <div className="mt-8">
                  <h2 className="text-2xl font-bold text-orange-400 mb-4">
                    Trip Gallery
                  </h2>

                  <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                    {(trip.gallery || []).map((img, index) => (
                      <img
                        key={index}
                        src={img}
                        alt="trip"
                        onClick={() => setSelectedImage(img)}
                        className="h-40 w-full object-cover rounded-xl cursor-pointer hover:scale-105 transition"
                      />
                    ))}
                  </div>
                </div>

              </div>

              {/* RIGHT SIDE (PREMIUM BOOKING BOX) */}
              <div className="md:col-span-1">
                <div className="sticky top-28 rounded-2xl bg-white/10 backdrop-blur-md p-6 border border-orange-400/20 shadow-xl">

                  <h2 className="text-xl font-bold text-orange-400 mb-4">
                    Book This Trip
                  </h2>

                  <p className="text-red-400 text-sm mb-4 font-semibold">
                    ⚠ Only few slots left!
                  </p>

                  <input
                    type="date"
                    min={today}
                    value={travelDate}
                    onChange={(e) => setTravelDate(e.target.value)}
                    className="w-full mb-4 p-2 rounded bg-black/50 border border-white/20"
                  />

                  <input
                    type="number"
                    min="1"
                    value={people}
                    onChange={(e) => setPeople(e.target.value)}
                    className="w-full mb-4 p-2 rounded bg-black/50 border border-white/20"
                  />

                  <div className="mb-4 p-3 rounded-lg bg-black/40 border border-white/10">
                    <p className="text-sm text-gray-300">Total Price</p>
                    <p className="text-2xl font-bold text-orange-400">
                      ₹{trip.price * people}
                    </p>
                  </div>

                  <button
                    onClick={() => {
                      const message = `Hello, I want to book this trip:

🌍 Trip: ${trip.title}
📅 Date: ${travelDate || "Not selected"}
👥 People: ${people}
💰 Total Price: ₹${trip.price * people}`;

                      const url = `https://wa.me/${WHATSAPP_NUMBER}?text=${encodeURIComponent(message)}`;
                      window.open(url, "_blank");
                    }}
                    className="w-full flex items-center justify-center gap-2 rounded-xl bg-green-500 px-6 py-3 text-white hover:bg-green-600"
                  >
                    <FaWhatsapp />
                    Book Now
                  </button>

                </div>
              </div>

            </div>
          </article>
        )}
      </section>

      {/* FULLSCREEN IMAGE */}
      {selectedImage && (
        <div
          className="fixed inset-0 bg-black/90 flex items-center justify-center z-50"
          onClick={() => setSelectedImage(null)}
        >
          <img src={selectedImage} className="max-h-[90%] max-w-[90%] rounded-xl" />
        </div>
      )}

      <Footer />
      <FloatingWhatsApp />
    </main>
  );
}
/* ================= FOOTER ================= */
function Footer() {
  return (
    <footer className="relative z-10 mt-2 bg-black text-white">
      
      <div className="mx-auto grid max-w-7xl gap-10 px-6 py-16 md:grid-cols-2 lg:grid-cols-4">
        
        {/* ABOUT */}
        <div>
          <h3 className="mb-6 border-b border-orange-400 pb-2 text-2xl font-semibold">
            About Us
          </h3>
          <p className="text-gray-300">
            Welcome to The Meraki Tribe, where every journey is crafted with care and passion.
          </p>
        </div>

        {/* TRIPS */}
        <div>
          <h3 className="mb-6 border-b border-orange-400 pb-2 text-2xl font-semibold">
            Backpacking Trips
          </h3>
          <ul className="space-y-2 text-gray-300">
            <li>Spiti Valley</li>
            <li>Kashmir Valley</li>
            <li>Zanskar Valley</li>
          </ul>
        </div>

        {/* QUICK LINKS */}
        <div>
          <h3 className="mb-6 border-b border-orange-400 pb-2 text-2xl font-semibold">
            Quick Links
          </h3>
          <ul className="space-y-2 text-gray-300">
            <li>About Us</li>
            <li>Contact Us</li>

            <li className="flex items-center gap-2">
              <FaInstagram className="text-pink-500" />
              <a
                href="https://www.instagram.com/the.merakitribe?igsh=OGRydWFsc2xrcGsz"
                target="_blank"
                rel="noopener noreferrer"
                className="hover:text-orange-400"
              >
                Instagram
              </a>
            </li>
          </ul>
        </div>

        {/* CONTACT */}
        <div>
          <h3 className="mb-6 border-b border-orange-400 pb-2 text-2xl font-semibold">
            Contact Us
          </h3>

          <ul className="space-y-3 text-gray-300">
            <li className="flex gap-2">
              <FaMapMarkerAlt className="text-orange-400" />
              Ahmedabad, Gujarat, India
            </li>

            <li className="flex gap-2">
              <FaPhoneAlt className="text-orange-400" />
              <div className="flex flex-col">
                <span>+91 96623 51358</span>
                <span>+91 90270 59288</span>
              </div>
            </li>

            <li className="flex gap-2">
              <FaEnvelope className="text-orange-400" />
              info.merakitribe@gmail.com
            </li>

            <li className="flex gap-2">
              <FaClock className="text-orange-400" />
              10:00 AM to 10:00 PM
            </li>
          </ul>
        </div>
      </div>

      {/* BOTTOM STRIP */}
      <div className="border-t border-white/10 bg-zinc-800 px-6 py-6 text-sm text-gray-300">
        <div className="mx-auto flex max-w-7xl flex-col items-center justify-between gap-4 md:flex-row">
          
          <p>The Meraki Tribe | All Rights Reserved</p>

          <div className="flex gap-3">
            <span>PayPal</span>
            <span>Visa</span>
            <span>MasterCard</span>
            <span>UPI</span>
            <span>GPay</span>
          </div>

        </div>
      </div>

    </footer>
  );
}

/* ================= FLOATING WHATSAPP ================= */
function FloatingWhatsApp() {
  return (
    <a
      href={`https://wa.me/${WHATSAPP_NUMBER}?text=${encodeURIComponent(
        "Hello, I want to know more about your trips."
      )}`}
      target="_blank"
      rel="noopener noreferrer"
      className="fixed bottom-6 right-6 z-50 flex h-16 w-16 items-center justify-center rounded-full bg-green-500 text-3xl text-white shadow-[0_10px_30px_rgba(0,0,0,0.4)] transition hover:scale-110 hover:bg-green-600"
      aria-label="Chat on WhatsApp"
    >
      <FaWhatsapp />
    </a>
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