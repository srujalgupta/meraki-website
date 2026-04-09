import React, { useEffect, useMemo, useState } from "react";
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
  FaHeart,
  FaRegHeart,
  FaSearch,
  FaStar,
  FaCloudSun,
  FaUsers,
  FaCalendarAlt,
  FaFilter,
  FaChevronDown,
  FaChevronUp,
} from "react-icons/fa";
import API from "./api";

const WHATSAPP_NUMBER = "919662351358";

const destinationMeta = {
  spiti: {
    bestTime: "June to September",
    weather: "Cold and scenic weather, usually between 5°C to 18°C during the main season.",
  },
  goa: {
    bestTime: "November to February",
    weather: "Warm and pleasant beach weather, usually between 22°C to 32°C.",
  },
  manali: {
    bestTime: "October to June",
    weather: "Cool mountain weather, usually between 4°C to 20°C depending on the month.",
  },
  default: {
    bestTime: "October to March",
    weather: "Pleasant destination weather with seasonal changes based on travel dates.",
  },
};

const fallbackReviews = [
  {
    id: 1,
    name: "Aarav Sharma",
    place: "Delhi",
    tripName: "Spiti Valley Adventure",
    month: "June 2025",
    rating: 5,
    image:
      "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=300&auto=format&fit=crop&q=80",
    text: "Amazing trip planning and very smooth coordination. Everything felt premium and safe.",
  },
  {
    id: 2,
    name: "Priya Mehta",
    place: "Ahmedabad",
    tripName: "Goa Escape",
    month: "December 2025",
    rating: 5,
    image:
      "https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=300&auto=format&fit=crop&q=80",
    text: "Loved the group vibe and the support team. It truly felt like traveling with a tribe.",
  },
  {
    id: 3,
    name: "Rohan Verma",
    place: "Pune",
    tripName: "Manali Adventure",
    month: "March 2026",
    rating: 5,
    image:
      "https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?w=300&auto=format&fit=crop&q=80",
    text: "Best backpacking experience I have had. The itinerary and stays were very well managed.",
  },
  {
    id: 4,
    name: "Sana Khan",
    place: "Mumbai",
    tripName: "Spiti Valley Adventure",
    month: "July 2025",
    rating: 5,
    image:
      "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=300&auto=format&fit=crop&q=80",
    text: "The booking process was easy and the whole trip was unforgettable. Highly recommended.",
  },
];

const defaultFAQs = [
  {
    question: "How do I book a trip?",
    answer:
      "Select your preferred batch, enter traveler details, and click Book Now. Your trip details will be sent directly on WhatsApp for confirmation.",
  },
  {
    question: "Are meals included in the package?",
    answer:
      "Meals depend on the package. Please check the inclusions section of each trip page for exact details.",
  },
  {
    question: "Can solo travelers join these trips?",
    answer:
      "Yes, solo travelers are welcome. Our group trips are designed to help like-minded travelers connect easily.",
  },
  {
    question: "Is it safe for female travelers?",
    answer:
      "Yes, we focus on safe coordination and comfortable travel experiences, especially for solo and female travelers.",
  },
  {
    question: "What happens after booking on WhatsApp?",
    answer:
      "Our team confirms your slot, shares payment details, and guides you with all next travel instructions.",
  },
];

const getTripMeta = (trip) => {
  const combined = `${trip?.title || ""} ${trip?.location || ""}`.toLowerCase();

  if (combined.includes("spiti")) return destinationMeta.spiti;
  if (combined.includes("goa")) return destinationMeta.goa;
  if (combined.includes("manali")) return destinationMeta.manali;

  return destinationMeta.default;
};

const getBatchDates = (trip) => {
  if (trip?.batchDates?.length) return trip.batchDates;
  return [
    { date: "2026-04-20", slots: 8 },
    { date: "2026-05-10", slots: 5 },
    { date: "2026-06-01", slots: 3 },
  ];
};

const getTripFAQs = (trip) => {
  if (trip?.faqs?.length) return trip.faqs;
  return defaultFAQs;
};

const openWhatsAppBooking = (
  trip,
  people = 1,
  travelDate = "Not selected",
  pickupCity = "Not selected",
  roomType = "Not selected",
  specialRequest = "None"
) => {
  const totalPrice = (trip?.price || 0) * people;

  const message = `Hello, I want to book this trip:
🌍 Trip: ${trip.title}
📍 Location: ${trip.location || "N/A"}
📅 Date: ${travelDate}
👥 People: ${people}
🚐 Pickup City: ${pickupCity}
🛏 Room Type: ${roomType}
📝 Special Request: ${specialRequest}
💰 Total Price: ₹${totalPrice}
Please share details.`;

  const url = `https://wa.me/${WHATSAPP_NUMBER}?text=${encodeURIComponent(message)}`;
  window.open(url, "_blank");
};

function LiveBackground() {
  return (
    <div className="fixed inset-0 z-0">
      <video
        autoPlay
        loop
        muted
        playsInline
        className="absolute top-0 left-0 h-full w-full object-cover"
      >
        <source src="/hero.mp4" type="video/mp4" />
      </video>
      <div className="absolute inset-0 bg-black/60"></div>
    </div>
  );
}

function Navbar({ wishlistCount = 0 }) {
  return (
    <header className="fixed top-0 left-0 z-50 w-full border-b border-orange-400/20 bg-black/70 backdrop-blur-md animate-fadeInSoft">
      <div className="mx-auto flex max-w-7xl flex-wrap items-center justify-between gap-3 px-4 py-3 text-white sm:px-6">
        <Link to="/" className="flex min-w-0 items-center gap-3">
          <img
            src="/logo.png"
            alt="logo"
            className="h-10 w-10 rounded-full object-cover transition duration-500 hover:scale-105 sm:h-11 sm:w-11"
          />
          <h2 className="truncate text-base font-bold text-orange-400 sm:text-lg">
            The Meraki Tribe
          </h2>
        </Link>

        <div className="flex items-center gap-3">
          <div className="hidden rounded-full border border-white/10 bg-white/10 px-4 py-2 text-sm text-white sm:block">
            Wishlist: <span className="font-semibold text-orange-300">{wishlistCount}</span>
          </div>

          <a
            href="https://wa.me/919662351358"
            target="_blank"
            rel="noopener noreferrer"
            className="animate-pulseSoft flex min-h-[44px] items-center gap-2 rounded-full bg-green-500 px-4 py-2 text-sm font-semibold text-white transition duration-300 hover:scale-105 hover:bg-green-600"
          >
            Book Now
          </a>
        </div>
      </div>
    </header>
  );
}

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
      icon: "🌱",
    },
    {
      title: "COMMUNITY OF EXPLORERS",
      desc: "Join like-minded travelers who share your passion for adventure. Our curated group trips foster connections and create lasting friendships.",
      icon: "🤝",
    },
    {
      title: "SEAMLESS, PASSIONATE SERVICE",
      desc: "We handle all trip details to ensure a smooth experience, driven by our love for travel and a commitment to making your journey memorable.",
      icon: "❤️",
    },
  ];

  return (
    <section id="about" className="relative z-10 bg-transparent pt-32 pb-20 text-white">
      <div className="mx-auto max-w-7xl px-6">
        <h2 className="mx-auto mb-16 w-fit border-b border-orange-400/40 pb-6 text-center text-4xl font-light tracking-[0.3em] text-orange-400 md:text-6xl lg:text-7xl">
          Why The Meraki Tribe Stands Out
        </h2>

        <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-4">
          {features.map((feature, index) => (
            <article
              key={index}
              className="group min-h-[380px] overflow-hidden rounded-2xl bg-gradient-to-br from-white to-gray-50 p-8 text-black shadow-xl backdrop-blur-sm transition-all duration-700 hover:-translate-y-4 hover:scale-[1.02] hover:shadow-2xl hover:ring-8 ring-orange-400/20 hover:bg-gradient-to-br hover:from-orange-50 hover:to-white"
            >
              <div className="mb-6 flex h-20 w-20 items-center justify-center rounded-2xl bg-gradient-to-r from-orange-400/20 to-orange-500/20 text-3xl group-hover:scale-110 group-hover:bg-gradient-to-r group-hover:from-orange-400/40 group-hover:to-orange-500/40 transition-all duration-500">
                {feature.icon}
              </div>
              <h3 className="mb-4 text-2xl font-black leading-tight tracking-tight group-hover:text-orange-600">
                {feature.title}
              </h3>
              <p className="text-base leading-relaxed text-gray-700 group-hover:text-gray-800">
                {feature.desc}
              </p>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}

function Reviews({ reviews }) {
  const duplicatedReviews = [...reviews, ...reviews];

  return (
    <section id="reviews" className="py-24 text-white">
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
                key={`${review.id}-${index}`}
                className="w-[340px] shrink-0 rounded-2xl border border-white/10 bg-white/5 p-6 backdrop-blur-md"
              >
                <div className="mb-4 flex items-center gap-4">
                  <img
                    src={review.image}
                    alt={review.name}
                    className="h-14 w-14 rounded-full object-cover"
                  />
                  <div>
                    <h3 className="text-lg font-semibold text-white">{review.name}</h3>
                    <p className="text-sm text-gray-400">
                      {review.place} • {review.month}
                    </p>
                  </div>
                </div>

                <div className="mb-3 flex items-center gap-1 text-orange-400">
                  {Array.from({ length: review.rating }).map((_, i) => (
                    <FaStar key={i} />
                  ))}
                </div>

                <p className="leading-7 text-gray-200">“{review.text}”</p>
                <h3 className="mt-5 text-lg font-semibold text-white">{review.tripName}</h3>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}

function SearchFilters({
  searchTerm,
  setSearchTerm,
  selectedLocation,
  setSelectedLocation,
  sortBy,
  setSortBy,
  maxPrice,
  setMaxPrice,
  locations,
}) {
  return (
    <div className="mb-10 rounded-3xl border border-white/10 bg-white/5 p-5 backdrop-blur-md">
      <div className="mb-5 flex items-center gap-2 text-orange-400">
        <FaFilter />
        <h3 className="text-xl font-semibold text-white">Search & Filters</h3>
      </div>

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <div className="relative">
          <FaSearch className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" />
          <input
            type="text"
            placeholder="Search trips..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="min-h-[48px] w-full rounded-xl border border-white/10 bg-black/40 py-3 pl-11 pr-4 text-white outline-none transition focus:border-orange-400"
          />
        </div>

        <select
          value={selectedLocation}
          onChange={(e) => setSelectedLocation(e.target.value)}
          className="min-h-[48px] w-full rounded-xl border border-white/10 bg-black/40 px-4 py-3 text-white outline-none transition focus:border-orange-400"
        >
          <option value="">All Locations</option>
          {locations.map((location, idx) => (
            <option key={idx} value={location}>
              {location}
            </option>
          ))}
        </select>

        <select
          value={sortBy}
          onChange={(e) => setSortBy(e.target.value)}
          className="min-h-[48px] w-full rounded-xl border border-white/10 bg-black/40 px-4 py-3 text-white outline-none transition focus:border-orange-400"
        >
          <option value="default">Sort By</option>
          <option value="lowToHigh">Price: Low to High</option>
          <option value="highToLow">Price: High to Low</option>
          <option value="trending">Trending First</option>
          <option value="name">Name A-Z</option>
        </select>

        <input
          type="number"
          placeholder="Max price"
          value={maxPrice}
          onChange={(e) => setMaxPrice(e.target.value)}
          className="min-h-[48px] w-full rounded-xl border border-white/10 bg-black/40 px-4 py-3 text-white outline-none transition focus:border-orange-400"
        />
      </div>
    </div>
  );
}

function TripCard({ trip, onClick, isWishlisted, onToggleWishlist }) {
  const meta = getTripMeta(trip);
  const batches = getBatchDates(trip);
  const nextBatch = batches[0];

  return (
    <article className="touch-card glass-card group overflow-hidden rounded-3xl border border-white/10 transition duration-500 hover:-translate-y-3 hover:bg-white/10 hover:shadow-[0_25px_80px_rgba(0,0,0,0.45)]">
      <div className="relative cursor-pointer overflow-hidden" onClick={onClick}>
        <img
          src={trip.image}
          alt={trip.title}
          className="h-56 w-full object-cover transition duration-700 group-hover:scale-110 sm:h-64"
        />

        <button
          onClick={(e) => {
            e.stopPropagation();
            onToggleWishlist(trip);
          }}
          className="absolute right-3 top-3 flex h-11 w-11 items-center justify-center rounded-full bg-black/50 text-white backdrop-blur-md transition duration-300 hover:scale-110"
        >
          {isWishlisted ? <FaHeart className="text-red-500" /> : <FaRegHeart />}
        </button>
      </div>

      <div className="p-4 sm:p-5">
        <div className="flex items-start justify-between gap-3">
          <h3
            onClick={onClick}
            className="cursor-pointer text-lg font-bold text-white transition group-hover:text-orange-300 sm:text-xl"
          >
            {trip.title}
          </h3>

          {trip.trending && (
            <span className="shrink-0 rounded-full border border-orange-400/20 bg-orange-400/10 px-3 py-1 text-[11px] text-orange-300 sm:text-xs">
              Trending
            </span>
          )}
        </div>

        <p className="mt-2 text-sm text-gray-400">
          {trip.location || "Adventure destination"}
        </p>

        <p className="mt-2 text-sm leading-7 text-gray-300 line-clamp-3">
          {trip.description ||
            "A beautiful travel experience filled with scenic views, local culture, and memorable moments."}
        </p>

        <div className="mt-4 space-y-2 rounded-2xl border border-white/10 bg-black/20 p-4">
          <p className="flex items-center gap-2 text-sm text-orange-300">
            <FaCalendarAlt /> Best time: {meta.bestTime}
          </p>
          <p className="flex items-center gap-2 text-sm text-cyan-300">
            <FaCloudSun /> {meta.weather}
          </p>
          <p className="flex items-center gap-2 text-sm text-green-300">
            <FaUsers /> Next batch: {nextBatch.date} • {nextBatch.slots} slots left
          </p>
        </div>

        <p className="mt-4 text-xl font-semibold text-orange-400 sm:text-2xl">
          ₹{trip.price}
        </p>

        <div className="mt-6 flex flex-col gap-3 sm:flex-row">
          <button
            onClick={onClick}
            className="min-h-[44px] flex-1 rounded-xl border border-orange-400/30 bg-orange-400/10 px-4 py-3 font-medium text-orange-300 transition duration-300 hover:bg-orange-400/20 active:scale-[0.98]"
          >
            View Details
          </button>

          <button
            onClick={() => openWhatsAppBooking(trip)}
            className="flex min-h-[44px] flex-1 items-center justify-center gap-2 rounded-xl bg-green-500 px-4 py-3 font-semibold text-white transition duration-300 hover:bg-green-600 active:scale-[0.98]"
          >
            <FaWhatsapp />
            Book Trip
          </button>
        </div>
      </div>
    </article>
  );
}

function Home() {
  const [trips, setTrips] = useState([]);
  const [reviews] = useState(fallbackReviews);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [wishlist, setWishlist] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedLocation, setSelectedLocation] = useState("");
  const [sortBy, setSortBy] = useState("default");
  const [maxPrice, setMaxPrice] = useState("");
  const navigate = useNavigate();

  useEffect(() => {
    axios
      .get(`${API}/trips`)
      .then((res) => setTrips(res.data))
      .catch((err) => {
        console.error(err);
        setError("Failed to load trips.");
      })
      .finally(() => setLoading(false));
  }, []);

  const locations = useMemo(() => {
    return [...new Set(trips.map((trip) => trip.location).filter(Boolean))];
  }, [trips]);

  const filteredTrips = useMemo(() => {
    let updatedTrips = [...trips];

    if (searchTerm.trim()) {
      updatedTrips = updatedTrips.filter((trip) =>
        `${trip.title} ${trip.location || ""} ${trip.description || ""}`
          .toLowerCase()
          .includes(searchTerm.toLowerCase())
      );
    }

    if (selectedLocation) {
      updatedTrips = updatedTrips.filter((trip) => trip.location === selectedLocation);
    }

    if (maxPrice) {
      updatedTrips = updatedTrips.filter((trip) => Number(trip.price) <= Number(maxPrice));
    }

    if (sortBy === "lowToHigh") {
      updatedTrips.sort((a, b) => a.price - b.price);
    } else if (sortBy === "highToLow") {
      updatedTrips.sort((a, b) => b.price - a.price);
    } else if (sortBy === "trending") {
      updatedTrips.sort((a, b) => Number(b.trending) - Number(a.trending));
    } else if (sortBy === "name") {
      updatedTrips.sort((a, b) => a.title.localeCompare(b.title));
    }

    return updatedTrips;
  }, [trips, searchTerm, selectedLocation, maxPrice, sortBy]);

  const handleToggleWishlist = (trip) => {
    setWishlist((prev) => {
      const exists = prev.find((item) => item.id === trip.id);
      if (exists) {
        return prev.filter((item) => item.id !== trip.id);
      }
      return [...prev, trip];
    });
  };

  return (
    <main className="relative z-10 min-h-screen text-white">
      <LiveBackground />
      <Navbar wishlistCount={wishlist.length} />

      <section id="trips" className="mx-auto max-w-7xl px-6 pb-12 pt-28">
        <div className="mb-12 max-w-4xl animate-fadeInUp sm:mb-16">
          <p className="mb-3 text-[11px] uppercase tracking-[0.3em] text-orange-400 sm:mb-4 sm:text-sm sm:tracking-[0.4em]">
            Adventure reimagined
          </p>

          <h1 className="text-3xl font-extrabold leading-tight text-white sm:text-5xl md:text-7xl">
            <span className="inline-block animate-floatSoft">Travel with stories,</span>
            <span className="block text-orange-300 animate-floatSoft">not just itineraries.</span>
          </h1>

          <p className="mt-4 max-w-2xl text-base leading-7 text-gray-300 sm:mt-6 sm:text-lg md:text-xl">
            Discover unforgettable backpacking journeys and book instantly on WhatsApp.
          </p>
        </div>

        <SearchFilters
          searchTerm={searchTerm}
          setSearchTerm={setSearchTerm}
          selectedLocation={selectedLocation}
          setSelectedLocation={setSelectedLocation}
          sortBy={sortBy}
          setSortBy={setSortBy}
          maxPrice={maxPrice}
          setMaxPrice={setMaxPrice}
          locations={locations}
        />

        {loading && <div className="py-10 text-gray-300">Loading trips...</div>}

        {error && (
          <div className="rounded-xl border border-red-500/30 bg-red-500/10 p-4 text-red-300">
            {error}
          </div>
        )}

        {!loading && !error && filteredTrips.length === 0 && (
          <div className="rounded-2xl border border-white/10 bg-white/5 p-8 text-center backdrop-blur-md">
            <h3 className="text-2xl font-bold text-white">No trips found</h3>
            <p className="mt-3 text-gray-300">
              Try another search term or adjust your filters.
            </p>
          </div>
        )}

        {!loading && !error && filteredTrips.length > 0 && (
          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3 sm:gap-8">
            {filteredTrips.map((trip, index) => (
              <div
                key={trip.id ?? index}
                className="animate-fadeInUp"
                style={{ animationDelay: `${index * 0.1}s` }}
              >
                <TripCard
                  trip={trip}
                  onClick={() => navigate(`/trip/${trip.id ?? index}`)}
                  isWishlisted={wishlist.some((item) => item.id === trip.id)}
                  onToggleWishlist={handleToggleWishlist}
                />
              </div>
            ))}
          </div>
        )}
      </section>

      <WhyUs />
      <Reviews reviews={reviews} />
      <Footer />
      <FloatingWhatsApp />
    </main>
  );
}

function FAQSection({ faqs }) {
  const [openIndex, setOpenIndex] = useState(0);

  return (
    <section className="mt-10 rounded-2xl border border-white/10 bg-white/5 p-6 backdrop-blur-md">
      <h2 className="mb-6 text-2xl font-bold text-orange-400">Frequently Asked Questions</h2>

      <div className="space-y-4">
        {faqs.map((faq, index) => {
          const isOpen = openIndex === index;

          return (
            <div
              key={index}
              className="overflow-hidden rounded-2xl border border-white/10 bg-black/20"
            >
              <button
                onClick={() => setOpenIndex(isOpen ? -1 : index)}
                className="flex w-full items-center justify-between gap-4 px-5 py-4 text-left"
              >
                <span className="font-semibold text-white">{faq.question}</span>
                <span className="text-orange-400">
                  {isOpen ? <FaChevronUp /> : <FaChevronDown />}
                </span>
              </button>

              {isOpen && (
                <div className="border-t border-white/10 px-5 py-4 text-gray-300">
                  {faq.answer}
                </div>
              )}
            </div>
          );
        })}
      </div>
    </section>
  );
}

function TripDetail() {
  const { id } = useParams();
  const navigate = useNavigate();

  const [trip, setTrip] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [selectedImage, setSelectedImage] = useState(null);
  const [travelDate, setTravelDate] = useState("");
  const [people, setPeople] = useState(1);
  const [pickupCity, setPickupCity] = useState("");
  const [roomType, setRoomType] = useState("Double Sharing");
  const [specialRequest, setSpecialRequest] = useState("");
  const [activeSection, setActiveSection] = useState("itinerary");
  const [wishlist, setWishlist] = useState([]);
  const [selectedBatch, setSelectedBatch] = useState("");

  const today = new Date().toISOString().split("T")[0];

  useEffect(() => {
    axios
      .get(`${API}/trips`)
      .then((res) => {
        const trips = res.data;
        const selectedTrip =
          trips.find((item) => String(item.id) === String(id)) || trips[Number(id)];

        if (!selectedTrip) {
          setError("Trip not found.");
          return;
        }

        setTrip(selectedTrip);

        const batches = getBatchDates(selectedTrip);
        if (batches.length > 0) {
          setSelectedBatch(batches[0].date);
          setTravelDate(batches[0].date);
        }
      })
      .catch((err) => {
        console.error(err);
        setError("Failed to load trip details.");
      })
      .finally(() => setLoading(false));
  }, [id]);

  const meta = getTripMeta(trip || {});
  const faqs = getTripFAQs(trip || {});
  const batchDates = getBatchDates(trip || {});
  const selectedBatchInfo =
    batchDates.find((batch) => batch.date === selectedBatch) || batchDates[0];

  const toggleWishlist = () => {
    if (!trip) return;

    setWishlist((prev) => {
      const exists = prev.find((item) => item.id === trip.id);
      if (exists) return prev.filter((item) => item.id !== trip.id);
      return [...prev, trip];
    });
  };

  return (
    <main className="relative min-h-screen bg-black text-white">
      <LiveBackground />
      <Navbar wishlistCount={wishlist.length} />

      <section className="mx-auto max-w-6xl px-6 pb-12 pt-28">
        <button
          onClick={() => navigate(-1)}
          className="mb-6 rounded-lg border border-white/10 bg-white/10 px-4 py-2 transition hover:bg-white/15"
        >
          Back
        </button>

        {loading && <div className="text-gray-300">Loading trip details...</div>}

        {error && (
          <div className="rounded-xl border border-red-500/30 bg-red-500/10 p-4 text-red-300">
            {error}
          </div>
        )}

        {!loading && !error && trip && (
          <>
            <article className="overflow-hidden rounded-3xl border border-white/10 bg-white/5 backdrop-blur-md">
              <div className="relative">
                <img
                  src={trip.image}
                  alt={trip.title}
                  className="h-72 w-full object-cover md:h-[28rem]"
                />

                <button
                  onClick={toggleWishlist}
                  className="absolute right-6 top-6 flex h-12 w-12 items-center justify-center rounded-full bg-black/50 text-xl text-white backdrop-blur-md transition hover:scale-110"
                >
                  {wishlist.some((item) => item.id === trip.id) ? (
                    <FaHeart className="text-red-500" />
                  ) : (
                    <FaRegHeart />
                  )}
                </button>
              </div>

              <div className="grid gap-8 p-6 md:grid-cols-3 md:p-8">
                <div className="md:col-span-2">
                  <p className="mb-3 text-sm uppercase tracking-[0.3em] text-orange-400">
                    {trip.location || "Featured destination"}
                  </p>

                  <h1 className="text-4xl font-bold">{trip.title}</h1>

                  <p className="mt-4 text-2xl font-semibold text-orange-400">
                    ₹{trip.price}
                  </p>

                  <p className="mt-6 leading-8 text-gray-300">
                    {trip.description ||
                      "A curated travel experience with beautiful views, smooth planning, and a vibrant explorer community."}
                  </p>

                  <div className="mt-8 grid gap-4 md:grid-cols-2">
                    <div className="rounded-2xl border border-orange-400/20 bg-orange-500/10 p-5">
                      <p className="mb-2 flex items-center gap-2 text-lg font-bold text-orange-300">
                        <FaCalendarAlt /> Best Time to Visit
                      </p>
                      <p className="text-gray-200">{meta.bestTime}</p>
                    </div>

                    <div className="rounded-2xl border border-cyan-400/20 bg-cyan-500/10 p-5">
                      <p className="mb-2 flex items-center gap-2 text-lg font-bold text-cyan-300">
                        <FaCloudSun /> Weather
                      </p>
                      <p className="text-gray-200">{meta.weather}</p>
                    </div>
                  </div>

                  <div className="mt-10 flex flex-wrap gap-3">
                    <button
                      onClick={() => setActiveSection("itinerary")}
                      className={`rounded-full px-5 py-2 text-sm font-semibold transition ${
                        activeSection === "itinerary"
                          ? "bg-orange-500 text-white"
                          : "border border-white/20 bg-white/10 text-gray-300 hover:bg-white/20"
                      }`}
                    >
                      Itinerary
                    </button>

                    <button
                      onClick={() => setActiveSection("inclusions")}
                      className={`rounded-full px-5 py-2 text-sm font-semibold transition ${
                        activeSection === "inclusions"
                          ? "bg-green-500 text-white"
                          : "border border-white/20 bg-white/10 text-gray-300 hover:bg-white/20"
                      }`}
                    >
                      Inclusions
                    </button>

                    <button
                      onClick={() => setActiveSection("exclusions")}
                      className={`rounded-full px-5 py-2 text-sm font-semibold transition ${
                        activeSection === "exclusions"
                          ? "bg-red-500 text-white"
                          : "border border-white/20 bg-white/10 text-gray-300 hover:bg-white/20"
                      }`}
                    >
                      Exclusions
                    </button>

                    <button
                      onClick={() => setActiveSection("gallery")}
                      className={`rounded-full px-5 py-2 text-sm font-semibold transition ${
                        activeSection === "gallery"
                          ? "bg-purple-500 text-white"
                          : "border border-white/20 bg-white/10 text-gray-300 hover:bg-white/20"
                      }`}
                    >
                      Gallery
                    </button>
                  </div>

                  <div className="mt-8 rounded-2xl border border-white/10 bg-white/5 p-6 backdrop-blur-md">
                    {activeSection === "itinerary" && (
                      <div>
                        <h2 className="mb-4 text-2xl font-bold text-orange-400">
                          Itinerary
                        </h2>
                        <ul className="space-y-3 text-gray-300">
                          <li className="rounded-xl border border-white/10 bg-black/20 p-4">
                            Day 1 - Arrival and check-in
                          </li>
                          <li className="rounded-xl border border-white/10 bg-black/20 p-4">
                            Day 2 - Sightseeing and local exploration
                          </li>
                          <li className="rounded-xl border border-white/10 bg-black/20 p-4">
                            Day 3 - Adventure activities and free time
                          </li>
                          <li className="rounded-xl border border-white/10 bg-black/20 p-4">
                            Day 4 - Checkout and departure
                          </li>
                        </ul>
                      </div>
                    )}

                    {activeSection === "inclusions" && (
                      <div>
                        <h2 className="mb-4 text-2xl font-bold text-green-400">
                          Inclusions
                        </h2>
                        <ul className="space-y-3 text-gray-300">
                          <li className="rounded-xl border border-green-500/20 bg-green-500/10 p-4">
                            Stay accommodation
                          </li>
                          <li className="rounded-xl border border-green-500/20 bg-green-500/10 p-4">
                            Meals
                          </li>
                          <li className="rounded-xl border border-green-500/20 bg-green-500/10 p-4">
                            Transport
                          </li>
                          <li className="rounded-xl border border-green-500/20 bg-green-500/10 p-4">
                            Trip coordination and support
                          </li>
                        </ul>
                      </div>
                    )}

                    {activeSection === "exclusions" && (
                      <div>
                        <h2 className="mb-4 text-2xl font-bold text-red-400">
                          Exclusions
                        </h2>
                        <ul className="space-y-3 text-gray-300">
                          <li className="rounded-xl border border-red-500/20 bg-red-500/10 p-4">
                            Personal expenses
                          </li>
                          <li className="rounded-xl border border-red-500/20 bg-red-500/10 p-4">
                            Extra activities
                          </li>
                          <li className="rounded-xl border border-red-500/20 bg-red-500/10 p-4">
                            Shopping and personal purchases
                          </li>
                          <li className="rounded-xl border border-red-500/20 bg-red-500/10 p-4">
                            Anything not mentioned in inclusions
                          </li>
                        </ul>
                      </div>
                    )}

                    {activeSection === "gallery" && (
                      <div>
                        <h2 className="mb-4 text-2xl font-bold text-purple-400">
                          Trip Gallery
                        </h2>

                        {trip.gallery && trip.gallery.length > 0 ? (
                          <div className="grid grid-cols-2 gap-4 md:grid-cols-3">
                            {trip.gallery.map((img, index) => (
                              <img
                                key={index}
                                src={img}
                                alt={`${trip.title} ${index + 1}`}
                                onClick={() => setSelectedImage(img)}
                                className="h-40 w-full cursor-pointer rounded-xl object-cover transition hover:scale-105"
                              />
                            ))}
                          </div>
                        ) : (
                          <p className="text-gray-400">
                            No gallery images available for this trip.
                          </p>
                        )}
                      </div>
                    )}
                  </div>

                  <FAQSection faqs={faqs} />
                </div>

                <div className="md:col-span-1">
                  <div className="sticky top-28 rounded-2xl border border-orange-400/20 bg-white/10 p-6 shadow-xl backdrop-blur-md">
                    <h2 className="mb-4 text-xl font-bold text-orange-400">
                      Book This Trip
                    </h2>

                    <p className="mb-4 text-sm font-semibold text-red-400">
                      ⚠ {selectedBatchInfo?.slots || 0} slots left in selected batch
                    </p>

                    <label className="mb-2 block text-sm text-gray-300">Select batch date</label>
                    <select
                      value={selectedBatch}
                      onChange={(e) => {
                        setSelectedBatch(e.target.value);
                        setTravelDate(e.target.value);
                      }}
                      className="mb-4 w-full rounded border border-white/20 bg-black/50 p-2"
                    >
                      {batchDates.map((batch, index) => (
                        <option key={index} value={batch.date}>
                          {batch.date} - {batch.slots} slots left
                        </option>
                      ))}
                    </select>

                    <label className="mb-2 block text-sm text-gray-300">Travel date</label>
                    <input
                      type="date"
                      min={today}
                      value={travelDate}
                      onChange={(e) => setTravelDate(e.target.value)}
                      className="mb-4 w-full rounded border border-white/20 bg-black/50 p-2"
                    />

                    <label className="mb-2 block text-sm text-gray-300">Number of people</label>
                    <input
                      type="number"
                      min="1"
                      value={people}
                      onChange={(e) => setPeople(Number(e.target.value))}
                      className="mb-4 w-full rounded border border-white/20 bg-black/50 p-2"
                    />

                    <label className="mb-2 block text-sm text-gray-300">Pickup city</label>
                    <input
                      type="text"
                      value={pickupCity}
                      onChange={(e) => setPickupCity(e.target.value)}
                      placeholder="Enter pickup city"
                      className="mb-4 w-full rounded border border-white/20 bg-black/50 p-2"
                    />

                    <label className="mb-2 block text-sm text-gray-300">Room preference</label>
                    <select
                      value={roomType}
                      onChange={(e) => setRoomType(e.target.value)}
                      className="mb-4 w-full rounded border border-white/20 bg-black/50 p-2"
                    >
                      <option>Double Sharing</option>
                      <option>Triple Sharing</option>
                      <option>Quad Sharing</option>
                      <option>Private Room</option>
                    </select>

                    <label className="mb-2 block text-sm text-gray-300">Special request</label>
                    <textarea
                      rows="3"
                      value={specialRequest}
                      onChange={(e) => setSpecialRequest(e.target.value)}
                      placeholder="Any note or preference..."
                      className="mb-4 w-full rounded border border-white/20 bg-black/50 p-2"
                    />

                    <div className="mb-4 rounded-lg border border-white/10 bg-black/40 p-3">
                      <p className="text-sm text-gray-300">Total Price</p>
                      <p className="text-2xl font-bold text-orange-400">
                        ₹{trip.price * people}
                      </p>
                    </div>

                    <button
                      onClick={() =>
                        openWhatsAppBooking(
                          trip,
                          people,
                          travelDate || "Not selected",
                          pickupCity || "Not selected",
                          roomType || "Not selected",
                          specialRequest || "None"
                        )
                      }
                      className="w-full rounded-xl bg-green-500 px-6 py-3 text-white transition hover:bg-green-600"
                    >
                      Book Now
                    </button>
                  </div>
                </div>
              </div>
            </article>
          </>
        )}
      </section>

      {selectedImage && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/90 p-4"
          onClick={() => setSelectedImage(null)}
        >
          <img
            src={selectedImage}
            alt="Selected trip"
            className="max-h-[90vh] max-w-[90vw] rounded-xl"
          />
        </div>
      )}

      <Footer />
      <FloatingWhatsApp />
    </main>
  );
}

function Footer() {
  return (
    <footer id="contact" className="relative z-10 mt-2 bg-black text-white">
      <div className="mx-auto grid max-w-7xl gap-10 px-6 py-16 md:grid-cols-2 lg:grid-cols-4">
        <div>
          <h3 className="mb-6 border-b border-orange-400 pb-2 text-2xl font-semibold">
            About Us
          </h3>
          <p className="text-gray-300">
            Welcome to The Meraki Tribe, where every journey is crafted with care
            and passion.
          </p>
        </div>

        <div>
          <h3 className="mb-6 border-b border-orange-400 pb-2 text-2xl font-semibold">
            Backpacking Trips
          </h3>
          <ul className="space-y-2 text-gray-300">
            <li>
              <Link to="/trip/1" className="hover:text-orange-400">
                Spiti Valley
              </Link>
            </li>
            <li>
              <Link to="/trip/2" className="hover:text-orange-400">
                Goa Escape
              </Link>
            </li>
            <li>
              <Link to="/trip/6" className="hover:text-orange-400">
                Manali Adventure
              </Link>
            </li>
          </ul>
        </div>

        <div>
          <h3 className="mb-6 border-b border-orange-400 pb-2 text-2xl font-semibold">
            Quick Links
          </h3>
          <ul className="space-y-2 text-gray-300">
            <li>
              <a href="#about" className="hover:text-orange-400">
                About Us
              </a>
            </li>
            <li>
              <a href="#trips" className="hover:text-orange-400">
                Trips
              </a>
            </li>
            <li>
              <a href="#reviews" className="hover:text-orange-400">
                Reviews
              </a>
            </li>
            <li>
              <a href="#contact" className="hover:text-orange-400">
                Contact Us
              </a>
            </li>
            <li className="flex items-center gap-2">
              <FaInstagram className="text-pink-500" />
              <a
                href="https://www.instagram.com/the.merakitribe"
                target="_blank"
                rel="noopener noreferrer"
                className="hover:text-orange-400"
              >
                Instagram
              </a>
            </li>
          </ul>
        </div>

        <div>
          <h3 className="mb-6 border-b border-orange-400 pb-2 text-2xl font-semibold">
            Contact Us
          </h3>

          <ul className="space-y-3 text-gray-300">
            <li className="flex gap-2">
              <FaMapMarkerAlt className="mt-1 text-orange-400" />
              <a
                href="https://maps.app.goo.gl/FmbfyeuF7EhTaccW9?g_st=iwb"
                target="_blank"
                rel="noopener noreferrer"
                className="hover:text-orange-400"
              >
                The Meraki Tribe, Raj Nagar Extension, Ghaziabad, Uttar Pradesh 201301
              </a>
            </li>

            <li className="flex gap-2">
              <FaPhoneAlt className="mt-1 text-orange-400" />
              <div className="flex flex-col">
                <a href="tel:+919662351358" className="hover:text-orange-400">
                  +91 96623 51358
                </a>
                <a href="tel:+919027059288" className="hover:text-orange-400">
                  +91 90270 59288
                </a>
              </div>
            </li>

            <li className="flex gap-2">
              <FaEnvelope className="mt-1 text-orange-400" />
              <a
                href="mailto:info.merakitribe@gmail.com"
                className="hover:text-orange-400"
              >
                info.merakitribe@gmail.com
              </a>
            </li>

            <li className="flex gap-2">
              <FaClock className="mt-1 text-orange-400" />
              <span>10:00 AM to 10:00 PM</span>
            </li>
          </ul>

          <div className="mt-8 overflow-hidden rounded-2xl border border-orange-400/30 bg-white/10 backdrop-blur-sm">
            <div className="h-56 w-full">
              <iframe
                title="The Meraki Tribe Location"
                src="https://www.openstreetmap.org/export/embed.html?bbox=77.4300%2C28.6700%2C77.5000%2C28.7400&layer=mapnik&marker=28.7041%2C77.4497"
                width="100%"
                height="100%"
                style={{ border: 0 }}
                loading="lazy"
              ></iframe>
            </div>
          </div>

          <a
            href="https://maps.app.goo.gl/FmbfyeuF7EhTaccW9?g_st=iwb"
            target="_blank"
            rel="noopener noreferrer"
            className="mt-3 inline-block text-sm font-medium text-orange-400 hover:text-orange-300"
          >
            Open exact location in Google Maps
          </a>
        </div>
      </div>

      <div className="border-t border-white/10 bg-zinc-800 px-6 py-6 text-sm text-gray-300">
        <div className="mx-auto flex max-w-7xl flex-col items-center justify-between gap-4 md:flex-row">
          <p>The Meraki Tribe. All Rights Reserved.</p>
          <div className="flex flex-wrap gap-3">
            <span className="rounded-full border border-white/10 px-3 py-1">
              PayPal
            </span>
            <span className="rounded-full border border-white/10 px-3 py-1">
              Visa
            </span>
            <span className="rounded-full border border-white/10 px-3 py-1">
              MasterCard
            </span>
            <span className="rounded-full border border-white/10 px-3 py-1">
              UPI
            </span>
            <span className="rounded-full border border-white/10 px-3 py-1">
              GPay
            </span>
          </div>
        </div>
      </div>
    </footer>
  );
}

function FloatingWhatsApp() {
  return (
    <a
      href={`https://wa.me/${WHATSAPP_NUMBER}?text=${encodeURIComponent(
        "Hello, I want to know more about your trips."
      )}`}
      target="_blank"
      rel="noopener noreferrer"
      className="animate-pulseSoft fixed bottom-4 right-4 z-50 flex h-14 w-14 items-center justify-center rounded-full bg-green-500 text-2xl text-white shadow-[0_10px_30px_rgba(0,0,0,0.4)] transition duration-300 hover:scale-110 hover:bg-green-600 sm:bottom-6 sm:right-6 sm:h-16 sm:w-16 sm:text-3xl"
      aria-label="Chat on WhatsApp"
    >
      <FaWhatsapp />
    </a>
  );
}

function App() {
  return (
    <Routes>
      <Route path="/" element={<Home />} />
      <Route path="/trip/:id" element={<TripDetail />} />
    </Routes>
  );
}

export default App;