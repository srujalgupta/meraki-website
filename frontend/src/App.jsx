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

/* ================= REVIEWS ================= */
function Reviews() {
  const reviews = [
    { name: "Rahul Sharma", text: "Spiti trip was magical!", rating: 5, date: "Jan 2026" },
    { name: "Priya Mehta", text: "Very well organized trip.", rating: 4, date: "Dec 2025" },
    { name: "Amit Verma", text: "Best experience ever.", rating: 5, date: "Nov 2025" },
    { name: "Sneha Kapoor", text: "Loved the vibe!", rating: 5, date: "Oct 2025" },
    { name: "Karan Patel", text: "Smooth journey.", rating: 4, date: "Sep 2025" },
    { name: "Neha Shah", text: "Great support team.", rating: 5, date: "Aug 2025" }
  ];

  return (
    <div className="py-20 overflow-hidden text-white">
      <h2 className="text-center text-4xl mb-12">Traveler Reviews ⭐</h2>

      <div className="flex gap-8 animate-scroll">
        {[...reviews, ...reviews].map((r, i) => (
          <div key={i}
            className="min-w-[350px] bg-white/10 p-6 rounded-xl hover:scale-105 transition">

            <div className="text-yellow-400">{"⭐".repeat(r.rating)}</div>
            <p className="text-gray-300">"{r.text}"</p>

            <div className="flex justify-between mt-4 text-gray-400">
              <span>{r.name}</span>
              <span>{r.date}</span>
            </div>

          </div>
        ))}
      </div>
    </div>
  );
}

/* ================= FOOTER ================= */
function ContactUs() {
  return (
    <div className="bg-black text-white pt-16 border-t border-gray-800 relative">

      <div className="max-w-7xl mx-auto px-6 grid md:grid-cols-4 gap-10">

        <div>
          <h3 className="text-yellow-400 mb-4">About</h3>
          <p className="text-gray-400">Travel with Meraki Tribe.</p>
          <div className="flex gap-4 mt-4 text-xl">
           <div className="flex gap-4 mt-4 text-xl">

  <FaYoutube />

  <a
    href="https://www.instagram.com/the.merakitribe?igsh=OGRydWFsc2xrcGsz"
    target="_blank"
    rel="noopener noreferrer"
  >
    <FaInstagram className="hover:text-pink-400 cursor-pointer" />
  </a>

  <FaLinkedin />

</div>
          </div>
        </div>

        <div>
          <h3 className="text-yellow-400 mb-4">Trips</h3>
          <ul className="text-gray-400">
            <li>Spiti</li><li>Manali</li>
          </ul>
        </div>

        <div>
          <h3 className="text-yellow-400 mb-4">Links</h3>
          <ul className="text-gray-400">
            <li>About</li><li>Contact</li>
          </ul>
        </div>

        <div>
          <h3 className="text-yellow-400 mb-4">Contact</h3>
          <p>+91 96623 51358</p>
          <iframe src="https://www.google.com/maps?q=Ahmedabad&output=embed"
            width="100%" height="150" className="mt-4 rounded"></iframe>
        </div>

      </div>

      <a href="https://wa.me/919662351358" target="_blank"
        className="fixed bottom-6 right-6 bg-green-500 p-4 rounded-full">
        <FaWhatsapp />
      </a>

    </div>
  );
}

/* ================= HOME ================= */
function Home() {
  const [trips, setTrips] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    axios.get("https://abc123.ngrok-free.dev/trips")
      .then(res => setTrips(res.data));
  }, []);

  return (
    <div className="bg-black text-white min-h-screen">

      <Navbar />

    <div className="hero-container">

  <video autoPlay loop muted className="hero-video">
    <source src="/hero.mp4" />
  </video>

  <div className="hero-overlay"></div>

  <div className="hero-content">

    <h1 className="hero-title">
      THE MERAKI TRIBE
    </h1>

    <p className="hero-subtitle">
      Luxury Travel • Adventure • Experiences 🌍
    </p>

    <div className="hero-buttons">
      <button
        onClick={() => window.scrollTo({ top: 800, behavior: "smooth" })}
        className="btn-primary"
      >
        Explore Trips ✨
      </button>

      <a
  href="https://www.instagram.com/the.merakitribe?igsh=OGRydWFsc2xrcGsz"
  target="_blank"
  rel="noopener noreferrer"
  className="btn-glass"
>
  Watch Stories 🎥
</a>
    </div>

  </div>

</div>

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
      <Reviews />
      <ContactUs />

    </div>
  );
}

/* ================= TRIP DETAIL ================= */
function TripDetail() {
  const { id } = useParams();
  const [trip, setTrip] = useState(null);
  const [tab, setTab] = useState("overview");
  const [activeImage, setActiveImage] = useState(null);

  const [form, setForm] = useState({
    name: "", phone: "", date: "", people: ""
  });

  useEffect(() => {
    axios.get("http://localhost:5000/trips")
      .then(res => {
        const index = Number(id);
        if (!isNaN(index) && res.data && res.data[index]) {
          setTrip(res.data[index]);
        }
      });
  }, [id]);

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const sendWhatsApp = () => {
    if (!trip) return;

    const message = `Hi, I want to book ${trip.title}

👤 Name: ${form.name}
📞 Phone: ${form.phone}
📅 Date: ${form.date}
👥 People: ${form.people}`;

    window.open(`https://wa.me/919662351358?text=${encodeURIComponent(message)}`);
  };

  if (!trip) return <div className="text-white p-10">Loading...</div>;

  const gallery = [
    trip.image,
    "https://images.pexels.com/photos/2901209/pexels-photo-2901209.jpeg",
    "https://images.pexels.com/photos/2387873/pexels-photo-2387873.jpeg"
  ];

  return (
    <div className="bg-black text-white min-h-screen">

      <Navbar />

      {/* HERO */}
      <div className="relative">
        <img src={trip.image} className="w-full h-[60vh] object-cover" />
        <div className="absolute inset-0 bg-black/60 flex items-end p-6">
          <h1 className="text-4xl font-bold">{trip.title}</h1>
        </div>
      </div>

      <div className="max-w-6xl mx-auto p-6 grid md:grid-cols-3 gap-6">

        {/* LEFT */}
        <div className="md:col-span-2 space-y-6 fade-in">

          <p className="text-gray-400">📍 {trip.location}</p>

          {/* TABS */}
          <div className="flex gap-6 border-b border-gray-700">
            {["overview","itinerary","gallery","inclusion","exclusion"].map(t => (
              <span key={t}
                onClick={() => setTab(t)}
                className={`cursor-pointer pb-2 capitalize transition ${
                  tab === t ? "border-b-2 border-yellow-400 text-yellow-400 scale-110" : "hover:text-yellow-300"
                }`}>
                {t}
              </span>
            ))}
          </div>

          {/* CONTENT */}
          <div className="fade-in">

            {tab === "overview" && (
              <div>
                <p>🌄 Explore {trip.location} with stunning landscapes.</p>
                <p>🔥 Bonfire nights & music vibes.</p>
                <p>📸 Capture unforgettable memories.</p>
              </div>
            )}

            {tab === "itinerary" && (
              <div className="space-y-3">
                {["Arrival 🏨","Explore 🌄","Adventure 🚙","Bonfire 🔥","Return 🏁"].map((d,i)=>(
                  <div key={i} className="timeline-card">
                    Day {i+1}: {d}
                  </div>
                ))}
              </div>
            )}

            {/* GALLERY */}
            {tab === "gallery" && (
              <div className="grid grid-cols-2 gap-4">
                {gallery.map((img,i)=>(
                  <img key={i}
                    src={img}
                    onClick={()=>setActiveImage(img)}
                    className="rounded-xl cursor-pointer hover:scale-105 transition"
                  />
                ))}

                {activeImage && (
                  <div onClick={()=>setActiveImage(null)}
                    className="fixed inset-0 bg-black/80 flex items-center justify-center z-50">
                    <img src={activeImage} className="max-h-[80vh] rounded-xl"/>
                  </div>
                )}
              </div>
            )}

            {tab === "inclusion" && (
              <div className="bg-green-200 text-black p-6 rounded-xl">
                <ul>
                  <li>✔️ Stay 🏨</li>
                  <li>✔️ Meals 🍽️</li>
                  <li>✔️ Transport 🚐</li>
                </ul>
              </div>
            )}

            {tab === "exclusion" && (
              <div className="bg-red-200 text-black p-6 rounded-xl">
                <ul>
                  <li>❌ Personal expenses</li>
                  <li>❌ Entry tickets</li>
                </ul>
              </div>
            )}

          </div>

        </div>

        {/* RIGHT */}
        <div className="tilt-card bg-white/10 p-6 rounded-xl">

          <h2 className="text-xl mb-2">💰 ₹{trip.price}</h2>

          <div className="space-y-3 mt-4">

            <input name="name" placeholder="👤 Name" onChange={handleChange} className="w-full p-2 text-black rounded"/>
            <input name="phone" placeholder="📞 Phone" onChange={handleChange} className="w-full p-2 text-black rounded"/>
            <input type="date" name="date" onChange={handleChange} className="w-full p-2 text-black rounded"/>
            <input name="people" placeholder="👥 People" onChange={handleChange} className="w-full p-2 text-black rounded"/>

            <button onClick={sendWhatsApp}
              className="w-full bg-green-500 py-3 rounded hover:scale-105 transition">
              Book Now 🚀
            </button>

          </div>

        </div>

      </div>

      <ContactUs />
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