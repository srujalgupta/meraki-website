import React, { useEffect, useMemo, useState } from "react";
import axios from "axios";
import { useRef } from "react";
import { Routes, Route, useNavigate, useParams, Link, useLocation } from "react-router-dom";
import {
  FaInstagram,
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
  FaHome,
} from "react-icons/fa";
import API from "./api";

const WHATSAPP_NUMBER = "919662351358";

const destinationMeta = {
  kumbhalgarhJawai: {
    bestTime: "October to March",
    weather:
      "Warm days, cooler evenings, and pleasant safari conditions through the main Rajasthan travel season.",
  },
  spiti: {
    bestTime: "June to September",
    weather: "Cold and scenic weather, usually between 5\u00B0C to 18\u00B0C during the main season.",
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
    tripName: "Spiti Valley Adventure",
    month: "August 2025",
    rating: 5,
    image:
      "https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=300&auto=format&fit=crop&q=80",
    text: "Loved the group vibe and the support team. The route felt adventurous but still very well managed.",
  },
  {
    id: 3,
    name: "Rohan Verma",
    place: "Pune",
    tripName: "Spiti Valley Adventure",
    month: "March 2026",
    rating: 5,
    image:
      "https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?w=300&auto=format&fit=crop&q=80",
    text: "Best backpacking experience I have had. The itinerary, camps, and support team were all on point.",
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
      "Enter your traveler details and click Book Now. Your trip request will go directly to WhatsApp for confirmation and next steps.",
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

  if (combined.includes("kumbhalgarh") || combined.includes("jawai")) {
    return destinationMeta.kumbhalgarhJawai;
  }
  if (combined.includes("spiti")) return destinationMeta.spiti;

  return destinationMeta.default;
};

const getBatchDates = (trip) => {
  if (trip?.batchDates?.length) return trip.batchDates;
  return [];
};

const getTripFAQs = (trip) => {
  if (trip?.faqs?.length) return trip.faqs;
  return defaultFAQs;
};

const WISHLIST_STORAGE_KEY = "merakiWishlist";

const getTripId = (trip) => trip?._id || trip?.id || trip?.title || null;

const isTripWishlisted = (wishlist, trip) => {
  const tripId = getTripId(trip);
  return wishlist.some((item) => getTripId(item) === tripId);
};

const tripPdfGuides = {
  "spiti-full.pdf": {
    about:
      "This Summer Spiti circuit is designed as a fuller Spiti experience from Delhi, covering the Kinnaur side on the way in and the Manali side on the return. The package flow in the itinerary PDFs includes stays around Sangla or Rakcham, Nako or Tabo, two nights in Kaza, a Chandratal Swiss Camp stay, and a final Manali halt before the journey wraps up.",
    highlights: [
      "7N/8D classic Summer Spiti route with broad destination coverage",
      "Stays across Rakcham or Sangla, Nako or Tabo, Kaza, Chandratal, and Manali",
      "12 meals included in the package as per the itinerary PDF",
      "Balanced route for travelers who want the complete Spiti feel without making the plan too rushed",
    ],
    itinerary: [
      {
        title: "Delhi departure and route briefing",
        description:
          "Board from Delhi, settle into the journey, and begin the long but scenic drive toward the mountains with clear coordination before departure.",
      },
      {
        title: "Sangla or Rakcham stay",
        description:
          "Enter the Kinnaur side and halt around Sangla or Rakcham for the first proper mountain stay, letting the group ease into the altitude and terrain.",
      },
      {
        title: "Nako or Tabo halt",
        description:
          "Continue deeper into the circuit toward Nako or Tabo, passing high-altitude landscapes and heritage-style Himalayan village stretches on the way.",
      },
      {
        title: "Arrival in Kaza",
        description:
          "Reach Kaza, settle into the stay, and use the evening to acclimatize, explore the town lightly, and prepare for the local Spiti sightseeing days ahead.",
      },
      {
        title: "Kaza local exploration",
        description:
          "Spend a second day around Kaza for the signature Spiti side of the trip, with room for monasteries, viewpoints, village visits, and iconic valley stops.",
      },
      {
        title: "Chandratal Swiss camp stay",
        description:
          "Leave Kaza behind and head toward Chandratal for a more remote high-altitude camp experience, which is one of the standout nights of the route.",
      },
      {
        title: "Manali halt",
        description:
          "Cross toward Manali after the Chandratal leg, unwind at the hotel stay, and keep the day lighter after the more rugged section of the circuit.",
      },
      {
        title: "Return and trip wrap-up",
        description:
          "Begin the return leg after breakfast and close the trip with buffer time for onward travel, keeping the PDF's departure advisory in mind.",
      },
    ],
    inclusions: [
      "Stays mentioned in the PDF route plan, including Kaza and Chandratal Swiss Camps",
      "12 meals in total as listed in the PDF: 6 breakfasts and 6 dinners",
      "Trip coordination and boarding guidance before departure",
      "Road-trip style movement through the full Summer Spiti circuit",
    ],
    exclusions: [
      "Train or flight tickets to reach the Delhi boarding point",
      "Lunches, cafe stops, snacks, and personal purchases during the trip",
      "Any upgrades beyond the listed stay and occupancy arrangement",
      "Anything not specifically mentioned in the package itinerary or meal plan",
    ],
  },
  "spiti-short.pdf": {
    about:
      "The short Spiti package is a tighter 4N/5D plan built for travelers who want the Kaza and Chandratal side of Spiti in fewer days. The PDF route focuses on a Manali-side entry with stays in Manali, two nights in Kaza, and a Chandratal Swiss Camp night before the return.",
    highlights: [
      "4N/5D short-format Spiti trip for a quicker Himalayan escape",
      "Manali to Kaza to Chandratal route plan from the PDF",
      "8 meals included in the package as listed in the itinerary PDF",
      "Best suited for travelers who want Spiti highlights without the longer circuit",
    ],
    itinerary: [
      {
        title: "Manali arrival and route start",
        description:
          "Reach Manali, connect with the group, and settle in for the night before heading into the higher sections of the valley route.",
      },
      {
        title: "Kaza transfer and acclimatization",
        description:
          "Travel toward Kaza through changing mountain terrain and keep the first evening relaxed to adjust to altitude and road fatigue.",
      },
      {
        title: "Kaza sightseeing day",
        description:
          "Use the day for the core Kaza-side experiences, including village stops, viewpoints, monastery-style attractions, and local exploration.",
      },
      {
        title: "Chandratal camp experience",
        description:
          "Move on to Chandratal for a camp stay that adds the adventure feel missing from shorter city-style mountain trips.",
      },
      {
        title: "Breakfast and return journey",
        description:
          "Wrap up after breakfast and begin the return leg, keeping enough time for post-trip travel from the exit point.",
      },
    ],
    inclusions: [
      "Manali, Kaza, and Chandratal stay plan as listed in the package PDF",
      "8 meals in total as listed in the PDF: 4 breakfasts and 4 dinners",
      "Trip coordination throughout the short-circuit route",
      "Support for transfers and check-ins during the trip",
    ],
    exclusions: [
      "Travel to the starting point before package reporting time",
      "Lunches, snacks, and personal expenses during the route",
      "Any optional local activity not mentioned in the package itinerary",
      "Anything beyond the stay and meals listed in the PDF",
    ],
  },
  "spiti-4x4.pdf": {
    about:
      "The 4x4 Spiti expedition package follows a broader mountain circuit with a stronger road-trip feel. The local PDF text shows the route flowing through Jibhi or Tirthan, Sangla or Chitkul or Rakcham, Nako, Kaza, and Chandratal, making it a more immersive overland version of the Spiti journey.",
    highlights: [
      "Spiti overland circuit built for 4x4-style road exploration",
      "Mountain stays across Jibhi or Tirthan, Sangla belt, Nako, Kaza, and Chandratal",
      "12 meals included in the package PDF: 6 breakfasts and 6 dinners",
      "High-altitude villages, monastery regions, and rugged valley driving",
    ],
    itinerary: [
      {
        title: "Departure and first mountain halt",
        description:
          "Leave the city stretch behind and head into the hills, with the first stay planned around Jibhi or Tirthan as per the route notes in the PDF.",
      },
      {
        title: "Sangla valley side stay",
        description:
          "Continue across the Kinnaur side toward the Sangla, Chitkul, or Rakcham belt and enjoy a more scenic valley-heavy leg of the journey.",
      },
      {
        title: "Nako transfer",
        description:
          "Push deeper into the circuit and halt around Nako, gradually moving into the stark high-altitude landscape Spiti is known for.",
      },
      {
        title: "Kaza base arrival",
        description:
          "Reach Kaza, settle in, and use the base to prepare for the core high-altitude exploration part of the expedition.",
      },
      {
        title: "High-altitude villages and monastery belt",
        description:
          "Spend the day exploring the higher villages and monastery side of Spiti, which is one of the signature experiences called out by the package route.",
      },
      {
        title: "Chandratal camp stay",
        description:
          "Head onward to Chandratal and stay in Swiss Camps for the more remote and adventure-driven section of the package.",
      },
      {
        title: "Return leg and departure buffer",
        description:
          "Begin the return after breakfast, keeping the package advisory in mind for onward travel from the final drop or boarding leg.",
      },
    ],
    inclusions: [
      "4x4-style route coverage through the major stay points listed in the PDF",
      "12 meals in total as listed in the package PDF",
      "Chandratal Swiss Camp night included in the plan",
      "Group coordination and route support throughout the trip",
    ],
    exclusions: [
      "Personal shopping, lunches, and cafe expenses on the route",
      "Travel to the main reporting or boarding point before the trip starts",
      "Rooming upgrades beyond the listed occupancy plan",
      "Anything not explicitly listed in the package itinerary",
    ],
  },
  "spiti-biking.pdf": {
    about:
      "The biking variant follows the Spiti route with the same expedition spirit but is structured around riding days and a stronger road-adventure experience. The PDF text points to stays through Jibhi or Tirthan, Sangla-side villages, Nako, Kaza, and Chandratal, with a dedicated focus on high-altitude villages and monastery stretches during the journey.",
    highlights: [
      "Spiti biking circuit for riders looking for a stronger expedition feel",
      "Route includes Jibhi or Tirthan, Sangla-side stays, Nako, Kaza, and Chandratal",
      "12 meals included in the PDF package plan: 6 breakfasts and 6 dinners",
      "Built around mountain roads, high-altitude villages, and monastery-region riding",
    ],
    itinerary: [
      {
        title: "Departure and first riding stretch",
        description:
          "Begin the route and ride toward the first mountain halt, easing into the trip with the opening scenic section before the terrain grows more demanding.",
      },
      {
        title: "Sangla side riding day",
        description:
          "Continue toward the Sangla, Chitkul, or Rakcham side and enjoy one of the most scenic valley-based riding sections of the whole route.",
      },
      {
        title: "Nako halt",
        description:
          "Ride into the higher landscape and halt around Nako, where the terrain and air start to feel more distinctly Spiti-like.",
      },
      {
        title: "Kaza arrival",
        description:
          "Reach Kaza and use the evening for rest, bike checks, and acclimatization before the core exploration day around the region.",
      },
      {
        title: "High-altitude village and monastery ride",
        description:
          "Cover the standout high-altitude villages and monastery-side stretches that give the biking package its real Spiti expedition character.",
      },
      {
        title: "Chandratal camp night",
        description:
          "Ride onward to Chandratal and stay in Swiss Camps, adding the offbeat lake-and-camp experience to the package.",
      },
      {
        title: "Return after breakfast",
        description:
          "Wrap up the riding circuit with breakfast and the return leg, keeping the PDF's onward-travel timing advice in mind.",
      },
    ],
    inclusions: [
      "Stay plan across the route points listed in the biking itinerary PDF",
      "12 meals in total as listed in the PDF: 6 breakfasts and 6 dinners",
      "Chandratal Swiss Camp experience within the route",
      "Trip coordination for the group biking circuit",
    ],
    exclusions: [
      "Fuel, damages, or personal bike-related incident costs unless separately covered",
      "Lunches, snacks, and personal purchases on the route",
      "Travel to the reporting or boarding point before the trip begins",
      "Anything not clearly mentioned in the package itinerary",
    ],
  },
  "kumbhalgarh x jawai itinerary.pdf": {
    about:
      "Kumbhalgarh x Jawai is a short Rajasthan circuit built for travelers who want heritage, scenic countryside, and wildlife in one compact getaway. The itinerary PDF shows an Ahmedabad departure, an early Kumbhalgarh arrival with fort exploration and a cultural evening, followed by a Ranakpur stop and an evening Jawai leopard safari before returning.",
    highlights: [
      "2N/3D Rajasthan escape from Ahmedabad",
      "Kumbhalgarh Fort visit with local exploration around the stay",
      "Ranakpur Jain Temple stop built into the Jawai route",
      "Evening Jawai leopard safari as a core trip experience",
      "6 meals included in the package PDF: 2 breakfasts, 2 lunches, and 2 dinners",
      "Traditional folk dance and DJ night during the Kumbhalgarh stay",
    ],
    itinerary: [
      {
        title: "Ahmedabad departure",
        description:
          "Board from Ahmedabad and begin the overnight journey toward Kumbhalgarh for a short but experience-led Rajasthan circuit.",
      },
      {
        title: "Kumbhalgarh arrival and fort visit",
        description:
          "Reach Kumbhalgarh early morning, check in, have breakfast, relax at the stay, then head out after lunch to visit Kumbhalgarh Fort before returning for the evening cultural program, dinner, and overnight stay.",
      },
      {
        title: "Ranakpur and Jawai leopard safari",
        description:
          "Travel toward Jawai via Ranakpur Jain Temple, pause for lunch on the route, and continue to the evening Jawai leopard safari, which is one of the biggest highlights of the package.",
      },
      {
        title: "Return to Ahmedabad",
        description:
          "Begin the return after the Jawai leg and reach Ahmedabad early morning with enough buffer for onward plans.",
      },
    ],
    inclusions: [
      "Comfortable AC bus from Ahmedabad to Jawai and return as listed in the PDF",
      "4x4 jeep transfer from the stay to Kumbhalgarh Fort and return",
      "6 meals in total: 2 breakfasts, 2 lunches, and 2 dinners",
      "Stay as per the package occupancy plan",
      "Jawai leopard safari as part of the itinerary flow",
      "Trip coordination before and during the route",
    ],
    exclusions: [
      "Alcohol, mineral water, and food or beverages not included in the package",
      "Extra refreshments, snacks, and personal purchases during the trip",
      "Entry fees or optional add-ons not explicitly mentioned in inclusions",
      "Anything not specifically listed in the itinerary package",
    ],
  },
};

const getPackageGuide = (selectedPackage) => {
  const pdfName = selectedPackage?.pdf?.split("/").pop()?.toLowerCase();
  return pdfName ? tripPdfGuides[pdfName] || null : null;
};

const getPdfHref = (pdfPath) => {
  if (!pdfPath) return "#";
  const normalizedPdfPath = pdfPath.replace(/^\/+/, "");
  return `${API}/${encodeURI(normalizedPdfPath)}`;
};

const getDurationLabel = (trip, selectedPackage) =>
  selectedPackage?.duration || trip?.duration || "4D/3N";

const getDayCount = (durationLabel) => {
  const match = durationLabel?.match(/(\d+)\s*D/i);
  return match ? Number(match[1]) : 4;
};

const getArrayItems = (value) => {
  if (Array.isArray(value)) {
    return value
      .map((item) => {
        if (typeof item === "string") return item.trim();
        if (item && typeof item.description === "string") return item.description.trim();
        return "";
      })
      .filter(Boolean);
  }

  if (typeof value === "string") {
    return value
      .split(/\r?\n|,/)
      .map((item) => item.trim())
      .filter(Boolean);
  }

  return [];
};

const buildFallbackOverview = (trip, selectedPackage, packageGuide) => {
  const durationLabel = getDurationLabel(trip, selectedPackage);
  return (
    trip?.about ||
    packageGuide?.about ||
    `${trip?.title || "This trip"} is a well-planned ${durationLabel} group experience in ${
      trip?.location || "a beautiful destination"
    }. It is designed for travelers who want scenic views, a smooth on-ground plan, and enough flexibility to enjoy the place without feeling rushed.`
  );
};

const buildFallbackHighlights = (trip, selectedPackage, packageGuide) => {
  const packageName = selectedPackage?.name ? `${selectedPackage.name} package` : null;
  const baseHighlights = [
    `${getDurationLabel(trip, selectedPackage)} itinerary with balanced travel and sightseeing`,
    packageName
      ? `Flexible ${packageName.toLowerCase()} suited to this destination`
      : "Comfortable package options for different travel styles",
    `${trip?.location || "Destination"} sightseeing with curated local stops`,
    "Trip coordination support from planning to departure",
  ];

  if (getArrayItems(trip?.highlights).length) return getArrayItems(trip.highlights);
  if (packageGuide?.highlights?.length) return packageGuide.highlights;
  return baseHighlights;
};

const buildFallbackItinerary = (trip, selectedPackage, packageGuide) => {
  if (Array.isArray(trip?.itinerary) && trip.itinerary.length) return trip.itinerary;
  if (Array.isArray(packageGuide?.itinerary) && packageGuide.itinerary.length) {
    return packageGuide.itinerary;
  }

  const dayCount = Math.max(3, getDayCount(getDurationLabel(trip, selectedPackage)));
  const destination = trip?.location || trip?.title || "the destination";

  const fallbackDays = [
    {
      title: "Arrival, transfers, and check-in",
      description: `Reach ${destination}, complete hotel or camp check-in, settle in, and get a short briefing about the trip flow and local conditions.`,
    },
    {
      title: "Core sightseeing and local exploration",
      description: `Spend the day exploring key viewpoints, local markets, and signature attractions around ${destination} at a comfortable pace.`,
    },
    {
      title: "Signature experience day",
      description: `Enjoy the main travel highlight of the trip with enough time for photography, food stops, and group experiences.`,
    },
    {
      title: "Departure and return",
      description: `Wrap up the journey with breakfast, checkout, and return transfers while keeping buffer time for a smooth departure.`,
    },
  ];

  if (dayCount <= 4) return fallbackDays.slice(0, dayCount);

  const extendedDays = [...fallbackDays];
  extendedDays.splice(3, 0, {
    title: "Leisure time and optional activities",
    description:
      "Keep part of the day relaxed for cafes, shopping, optional activities, or simply enjoying the destination at your own pace.",
  });

  return extendedDays.slice(0, dayCount);
};

const buildFallbackInclusions = (trip, selectedPackage, packageGuide) => {
  const inclusions = getArrayItems(trip?.inclusions);
  if (inclusions.length) return inclusions;
  if (packageGuide?.inclusions?.length) return packageGuide.inclusions;

  return [
    `${getDurationLabel(trip, selectedPackage)} stay as per selected package`,
    "Trip coordination and on-ground support",
    "Sightseeing and transfers mentioned in the itinerary",
    "Basic assistance with check-in and travel planning",
  ];
};

const buildFallbackExclusions = (trip, packageGuide) => {
  const exclusions = getArrayItems(trip?.exclusions);
  if (exclusions.length) return exclusions;
  if (packageGuide?.exclusions?.length) return packageGuide.exclusions;

  return [
    "Personal expenses, shopping, and snacks outside the plan",
    "Adventure activities or add-ons not explicitly listed",
    "Meals not mentioned in package inclusions",
    `Anything not specifically mentioned for ${trip?.title || "the trip"}`,
  ];
};

const openWhatsAppBooking = (
  trip,
  people = 1,
  travelDate = "Not selected",
  pickupCity = "Not selected",
  roomType = "Not selected",
  specialRequest = "None",
  selectedPackage = null
) => {
  const unitPrice = selectedPackage?.price || trip?.price || 0;
  const totalPrice = unitPrice * people;
  const packageLine = selectedPackage?.name
    ? `Package: ${selectedPackage.name}`
    : null;
  const bookingMessage = [
    "Hello, I want to book this trip:",
    `Trip: ${trip.title}`,
    packageLine,
    `Location: ${trip.location || "N/A"}`,
    `Date: ${travelDate}`,
    `People: ${people}`,
    `Pickup City: ${pickupCity}`,
    `Room Type: ${roomType}`,
    `Special Request: ${specialRequest}`,
    `Total Price: \u20B9${totalPrice}`,
    "Please share details.",
  ]
    .filter(Boolean)
    .join("\n");


  const url = `https://wa.me/${WHATSAPP_NUMBER}?text=${encodeURIComponent(bookingMessage)}`;
  window.open(url, "_blank");
};

function LiveBackground() {
  const videoRef = useRef(null);

  useEffect(() => {
    const video = videoRef.current;
    if (!video) return;

    const ensurePlayback = () => {
      const playAttempt = video.play();
      if (playAttempt?.catch) playAttempt.catch(() => {});
    };

    const restartPlayback = () => {
      video.currentTime = 0;
      ensurePlayback();
    };

    const handleVisibilityChange = () => {
      if (!document.hidden) ensurePlayback();
    };

    ensurePlayback();

    video.addEventListener("stalled", ensurePlayback);
    video.addEventListener("suspend", ensurePlayback);
    video.addEventListener("ended", restartPlayback);
    document.addEventListener("visibilitychange", handleVisibilityChange);

    return () => {
      video.removeEventListener("stalled", ensurePlayback);
      video.removeEventListener("suspend", ensurePlayback);
      video.removeEventListener("ended", restartPlayback);
      document.removeEventListener("visibilitychange", handleVisibilityChange);
    };
  }, []);

  return (
    <div className="fixed inset-0 z-0 overflow-hidden">
      <video
        ref={videoRef}
        autoPlay
        loop
        muted
        playsInline
        preload="auto"
        disablePictureInPicture
        className="video-smooth absolute top-0 left-0 h-full w-full object-cover"
      >
        <source src="/hero.mp4" type="video/mp4" />
      </video>
      <div className="absolute inset-0 bg-black/62"></div>
    </div>
  );
}

function Navbar({ wishlistCount = 0 }) {
  return (
    <header className="fixed top-0 left-0 z-50 w-full border-b border-white/10 bg-black/55 backdrop-blur-xl animate-fadeInSoft">
      <div className="mx-auto flex max-w-7xl flex-wrap items-center justify-between gap-3 px-4 py-3 text-white sm:px-6">
        <Link to="/" className="flex min-w-0 items-center gap-3">
          <img
            src="/logo.png"
            alt="logo"
            className="brand-ring h-10 w-10 rounded-2xl border border-white/15 object-cover shadow-[0_10px_30px_rgba(0,0,0,0.28)] transition duration-500 hover:scale-105 sm:h-11 sm:w-11"
          />
          <div className="min-w-0">
            <p className="text-[10px] uppercase tracking-[0.28em] text-orange-300/80">
              Curated Group Travel
            </p>
            <h2 className="truncate font-['Sora'] text-base font-semibold text-white sm:text-lg">
              The Meraki Tribe
            </h2>
          </div>
        </Link>

        <div className="flex flex-wrap items-center gap-3">
          <Link
            to="/"
            className="flex min-h-[44px] items-center gap-2 rounded-full border border-white/10 bg-white/8 px-4 py-2 text-sm font-semibold text-white shadow-[0_8px_24px_rgba(0,0,0,0.18)] transition duration-300 hover:scale-105 hover:border-orange-300/30 hover:bg-white/12"
          >
            <FaHome className="text-orange-300" />
            Home
          </Link>

          <Link
            to="/#trips-list"
            className="flex min-h-[44px] items-center rounded-full border border-white/10 bg-white/8 px-4 py-2 text-sm font-semibold text-white shadow-[0_8px_24px_rgba(0,0,0,0.18)] transition duration-300 hover:scale-105 hover:border-orange-300/30 hover:bg-white/12"
          >
            Trips
          </Link>

          <div className="flex min-h-[44px] items-center gap-2 rounded-full border border-white/10 bg-white/8 px-4 py-2 text-sm font-semibold text-white shadow-[0_8px_24px_rgba(0,0,0,0.18)] transition duration-300 hover:border-orange-300/30 hover:bg-white/12">
            <FaHeart className="text-orange-300" />
            Wishlist
            <span className="rounded-full bg-orange-300/15 px-2 py-0.5 text-xs font-semibold text-orange-200">
              {wishlistCount}
            </span>
          </div>

          <a
            href="https://wa.me/919662351358"
            target="_blank"
            rel="noopener noreferrer"
            className="animate-pulseSoft flex min-h-[44px] items-center gap-2 rounded-full bg-gradient-to-r from-green-500 to-emerald-500 px-4 py-2 text-sm font-semibold text-white shadow-[0_14px_34px_rgba(34,197,94,0.28)] transition duration-300 hover:scale-105 hover:from-green-400 hover:to-emerald-400"
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
      icon: "\uD83D\uDEE1\uFE0F",
    },
    {
      title: "ECO-FRIENDLY COMMITMENT",
      desc: "Our tree-planting initiative neutralizes your carbon footprint, promoting responsible travel and making a positive impact on the environment.",
      icon: "\uD83C\uDF31",
    },
    {
      title: "COMMUNITY OF EXPLORERS",
      desc: "Join like-minded travelers who share your passion for adventure. Our curated group trips foster connections and create lasting friendships.",
      icon: "\uD83E\uDD1D",
    },
    {
      title: "SEAMLESS, PASSIONATE SERVICE",
      desc: "We handle all trip details to ensure a smooth experience, driven by our love for travel and a commitment to making your journey memorable.",
      icon: "\u2764\uFE0F",
    },
  ];

  return (
    <section id="about" className="relative z-10 bg-transparent pt-32 pb-20 text-white">
      <div className="mx-auto max-w-7xl px-6">
        <p className="section-kicker mb-4 text-center text-xs">Why Travel With Us</p>
        <h2 className="section-title mx-auto mb-5 max-w-4xl text-center text-4xl font-semibold text-white md:text-6xl">
          Why The Meraki Tribe Stands Out
        </h2>
        <p className="mx-auto mb-16 max-w-3xl text-center text-base leading-8 text-slate-300 md:text-lg">
          We blend route planning, community, and dependable execution so the trip
          feels polished from the first message to the final drop.
        </p>

        <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-4">
          {features.map((feature, index) => (
            <article
              key={index}
              className="glass-card group min-h-[360px] overflow-hidden rounded-[28px] p-8 text-white transition-all duration-700 hover:-translate-y-3 hover:border-orange-300/30 hover:shadow-[0_30px_80px_rgba(0,0,0,0.34)]"
            >
              <div className="mb-6 flex h-20 w-20 items-center justify-center rounded-3xl border border-white/10 bg-white/8 text-3xl shadow-[inset_0_1px_0_rgba(255,255,255,0.06)] transition-all duration-500 group-hover:scale-110 group-hover:border-orange-300/40 group-hover:bg-orange-400/12">
                {feature.icon}
              </div>
              <h3 className="mb-4 font-['Sora'] text-2xl font-semibold leading-tight tracking-tight text-white group-hover:text-orange-200">
                {feature.title}
              </h3>
              <p className="text-base leading-8 text-slate-300 group-hover:text-slate-100">
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
        <p className="section-kicker mb-4 text-center text-xs">Social Proof</p>
        <h2 className="section-title mb-4 text-center text-4xl font-semibold text-white">
          Traveler Reviews
        </h2>
        <p className="mx-auto mb-10 max-w-2xl text-center text-slate-300">
          A quick look at the kind of confidence, coordination, and comfort travelers
          remember after the trip.
        </p>

        <div className="overflow-hidden">
          <div className="flex w-max animate-marquee gap-6">
            {duplicatedReviews.map((review, index) => (
              <div
                key={`${review.id}-${index}`}
                className="glass-card w-[290px] shrink-0 rounded-[28px] border border-amber-200/10 p-6 sm:w-[340px]"
              >
                <div className="mb-4 flex items-center gap-4">
                  <img
                    src={review.image}
                    alt={review.name}
                    className="h-14 w-14 rounded-2xl border border-white/10 object-cover"
                  />
                  <div>
                    <h3 className="text-lg font-semibold text-white">{review.name}</h3>
                    <p className="text-sm text-slate-400">
                      {review.place} {"\u2022"} {review.month}
                    </p>
                  </div>
                </div>

                <div className="mb-3 flex items-center gap-1 text-orange-400">
                  {Array.from({ length: review.rating }).map((_, i) => (
                    <FaStar key={i} />
                  ))}
                </div>

                <p className="leading-7 text-slate-200">{"\u201C"}{review.text}{"\u201D"}</p>
                <h3 className="mt-5 font-['Sora'] text-lg font-semibold text-white">{review.tripName}</h3>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}

function FeaturedSpotlight({ trip, onViewTrip }) {
  if (!trip) return null;

  const selectedPackage = trip?.packages?.[0] || null;
  const packageGuide = getPackageGuide(selectedPackage);
  const overview = buildFallbackOverview(trip, selectedPackage, packageGuide);
  const highlights = buildFallbackHighlights(trip, selectedPackage, packageGuide).slice(0, 4);

  return (
    <section className="mb-12 sm:mb-16">
      <div className="mb-8">
        <p className="section-kicker mb-3 text-[11px]">Featured Departure</p>
        <h2 className="section-title text-3xl font-semibold text-white sm:text-4xl">
          The trip we would put in front of every first-time traveler
        </h2>
        <p className="mt-4 max-w-3xl text-base leading-8 text-slate-300">
          A closer look at one live route with the clearest mix of place, planning,
          and traveler appeal.
        </p>
      </div>

      <div className="glass-card overflow-hidden rounded-[34px]">
        <div className="grid gap-0 lg:grid-cols-[1.1fr_0.9fr]">
          <div className="relative min-h-[340px] overflow-hidden">
            <img
              src={trip.image}
              alt={trip.title}
              className="h-full w-full object-cover"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/85 via-black/30 to-transparent" />
            <div className="absolute bottom-0 left-0 right-0 p-6 sm:p-8">
              <p className="mb-3 text-[11px] uppercase tracking-[0.28em] text-orange-200/80">
                Featured Experience
              </p>
              <h2 className="font-['Sora'] text-3xl font-semibold text-white sm:text-4xl">
                {trip.title}
              </h2>
              <div className="mt-4 flex flex-wrap gap-3">
                <span className="rounded-full border border-white/10 bg-black/35 px-4 py-2 text-xs uppercase tracking-[0.24em] text-slate-100 backdrop-blur-md">
                  {trip.location || "Curated route"}
                </span>
                <span className="rounded-full border border-white/10 bg-black/35 px-4 py-2 text-xs uppercase tracking-[0.24em] text-orange-200 backdrop-blur-md">
                  {selectedPackage?.duration || trip.duration || "Signature departure"}
                </span>
              </div>
            </div>
          </div>

          <div className="p-6 sm:p-8">
            <p className="section-kicker mb-4 text-[11px]">Spotlight Route</p>
            <p className="text-base leading-8 text-slate-300">
              {overview}
            </p>

            <div className="mt-6 grid gap-3 sm:grid-cols-2">
              {highlights.map((highlight, index) => (
                <div
                  key={index}
                  className="rounded-[22px] border border-white/10 bg-white/6 p-4 text-sm leading-7 text-slate-200"
                >
                  {highlight}
                </div>
              ))}
            </div>

            <div className="mt-6 flex flex-wrap items-center justify-between gap-4 rounded-[24px] border border-orange-300/15 bg-orange-400/10 p-4">
              <div>
                <p className="text-[11px] uppercase tracking-[0.24em] text-slate-400">
                  Starting From
                </p>
                <p className="mt-2 font-['Sora'] text-3xl font-semibold text-orange-200">
                  {"\u20B9"}{selectedPackage?.price || trip.price}
                </p>
              </div>

              <div className="flex flex-wrap gap-3">
                <button
                  onClick={onViewTrip}
                  className="rounded-2xl border border-white/10 bg-white/8 px-5 py-3 font-semibold text-white transition hover:bg-white/12"
                >
                  Explore Trip
                </button>

                <button
                  onClick={() => openWhatsAppBooking(trip, 1, "Not selected", "Not selected", "Double Sharing", "Interested in this featured trip", selectedPackage)}
                  className="rounded-2xl bg-gradient-to-r from-green-500 to-emerald-500 px-5 py-3 font-semibold text-white transition hover:from-green-400 hover:to-emerald-400"
                >
                  Book on WhatsApp
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

function BookingFlowSection() {
  const steps = [
    {
      number: "01",
      title: "Discover the right route",
      description:
        "Start with the live departures, compare duration and budget, and open the trip that matches your kind of travel.",
    },
    {
      number: "02",
      title: "Share your preferences on WhatsApp",
      description:
        "Tell us your city, dates, room style, and any questions. We keep the booking flow direct and human instead of hiding it behind forms.",
    },
    {
      number: "03",
      title: "Confirm and travel with clarity",
      description:
        "Once the route and package are locked, we share the next details clearly so the trip feels sorted before departure day.",
    },
  ];

  return (
    <section className="py-24 text-white">
      <div className="mx-auto max-w-7xl px-6">
        <p className="section-kicker mb-4 text-center text-xs">How It Works</p>
        <h2 className="section-title mx-auto max-w-4xl text-center text-4xl font-semibold text-white md:text-5xl">
          A booking flow that feels personal, not robotic
        </h2>
        <p className="mx-auto mt-5 max-w-3xl text-center text-base leading-8 text-slate-300">
          We keep the digital experience clean, then move the real planning to WhatsApp
          where travelers can ask what they actually care about before committing.
        </p>

        <div className="mt-12 grid gap-6 lg:grid-cols-3">
          {steps.map((step) => (
            <article
              key={step.number}
              className="glass-card rounded-[28px] p-6 transition duration-500 hover:-translate-y-2 hover:border-orange-300/25"
            >
              <p className="mb-5 font-['Sora'] text-4xl font-semibold text-orange-300/85">
                {step.number}
              </p>
              <h3 className="font-['Sora'] text-2xl font-semibold text-white">
                {step.title}
              </h3>
              <p className="mt-4 text-base leading-8 text-slate-300">
                {step.description}
              </p>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}

function BrandStorySection() {
  const brandPoints = [
    "Trips shaped around route quality, not just low prices.",
    "A planning style that stays human from the first message onward.",
    "Smaller, more intentional departures that feel cared for.",
    "Travel pages built from real routes, PDFs, and actual destination context.",
  ];

  return (
    <section className="pb-24 text-white">
      <div className="mx-auto max-w-7xl px-6">
        <div className="mb-8">
          <p className="section-kicker mb-3 text-[11px]">Brand Story</p>
          <h2 className="section-title text-3xl font-semibold text-white sm:text-4xl">
            What makes the brand feel more intentional than a generic travel listing
          </h2>
          <p className="mt-4 max-w-3xl text-base leading-8 text-slate-300">
            The site should not only show trips. It should also explain how The Meraki
            Tribe thinks about routes, communication, and traveler experience.
          </p>
        </div>

        <div className="grid gap-8 lg:grid-cols-[1.05fr_0.95fr]">
        <div className="glass-card rounded-[32px] p-7 sm:p-8">
          <p className="section-kicker mb-4 text-[11px]">About The Brand</p>
          <h2 className="section-title text-3xl font-semibold text-white sm:text-4xl">
            The Meraki Tribe is built for travelers who want a trip to feel considered
          </h2>
          <p className="mt-5 text-base leading-8 text-slate-300">
            We are not trying to flood the site with random departures. The idea is to
            keep the routes selective, make the pages more honest, and create enough
            confidence that a traveler can say yes without feeling like they are guessing.
          </p>
          <p className="mt-4 text-base leading-8 text-slate-300">
            That means clearer itineraries, tighter communication, better route curation,
            and a more grounded booking experience than generic travel listing sites.
          </p>
        </div>

        <div className="grid gap-4">
          {brandPoints.map((point, index) => (
            <div
              key={index}
              className="rounded-[26px] border border-white/10 bg-white/6 p-5 backdrop-blur-md"
            >
              <p className="text-[11px] uppercase tracking-[0.24em] text-orange-300/75">
                Meraki Standard {index + 1}
              </p>
              <p className="mt-3 text-base leading-8 text-slate-200">{point}</p>
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
  hasActiveFilters,
  onResetFilters,
}) {
  return (
    <div className="glass-card mb-10 rounded-[32px] p-5 sm:p-6">
      <div className="mb-5 flex flex-wrap items-center justify-between gap-3">
        <div className="flex items-center gap-2 text-orange-300">
          <FaFilter />
          <h3 className="font-['Sora'] text-xl font-semibold text-white">Search & Filters</h3>
        </div>

        {hasActiveFilters && (
          <button
            onClick={onResetFilters}
            className="rounded-full border border-white/10 bg-white/8 px-4 py-2 text-sm font-semibold text-slate-200 transition hover:border-orange-300/40 hover:bg-orange-400/10 hover:text-white"
          >
            Clear Filters
          </button>
        )}
      </div>

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <div className="relative">
          <FaSearch className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" />
          <input
            type="text"
            placeholder="Search trips..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="min-h-[50px] w-full rounded-2xl border border-white/10 bg-black/30 py-3 pl-11 pr-4 text-white outline-none transition placeholder:text-slate-500 focus:border-orange-300 focus:bg-black/45"
          />
        </div>

        <select
          value={selectedLocation}
          onChange={(e) => setSelectedLocation(e.target.value)}
          className="min-h-[50px] w-full rounded-2xl border border-white/10 bg-black/30 px-4 py-3 text-white outline-none transition focus:border-orange-300 focus:bg-black/45"
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
          className="min-h-[50px] w-full rounded-2xl border border-white/10 bg-black/30 px-4 py-3 text-white outline-none transition focus:border-orange-300 focus:bg-black/45"
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
          className="min-h-[50px] w-full rounded-2xl border border-white/10 bg-black/30 px-4 py-3 text-white outline-none transition placeholder:text-slate-500 focus:border-orange-300 focus:bg-black/45"
        />
      </div>
    </div>
  );
}

function TripCard({ trip, onClick, isWishlisted, onToggleWishlist }) {
  const meta = getTripMeta(trip);
  const tripDuration = trip?.duration || trip?.packages?.[0]?.duration || "Curated trip";

  return (
    <article className="touch-card glass-card group flex h-full flex-col overflow-hidden rounded-[32px] transition duration-500 hover:-translate-y-3 hover:border-orange-300/25 hover:shadow-[0_30px_90px_rgba(0,0,0,0.42)]">
      <div className="relative cursor-pointer overflow-hidden" onClick={onClick}>
        <img
          src={trip.image}
          alt={trip.title}
          className="h-56 w-full object-cover transition duration-700 group-hover:scale-110 sm:h-64"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/10 to-transparent" />

        {trip.trending && (
          <span className="absolute left-4 top-4 rounded-full border border-orange-200/25 bg-orange-500/20 px-3 py-1 text-[11px] font-semibold uppercase tracking-[0.2em] text-orange-100 backdrop-blur-md">
            Trending
          </span>
        )}

        <button
          onClick={(e) => {
            e.stopPropagation();
            onToggleWishlist(trip);
          }}
          aria-label={isWishlisted ? "Remove from wishlist" : "Add to wishlist"}
          className="absolute right-3 top-3 flex h-11 w-11 items-center justify-center rounded-full border border-white/10 bg-black/45 text-white backdrop-blur-md transition duration-300 hover:scale-110"
        >
          {isWishlisted ? <FaHeart className="text-red-500" /> : <FaRegHeart />}
        </button>

        <div className="absolute bottom-4 left-4 right-4 flex items-end justify-between gap-3">
          <div className="min-w-0 flex-1">
            <p className="mb-2 text-[11px] uppercase tracking-[0.28em] text-orange-200/80">
              {trip.location || "Adventure destination"}
            </p>
            <h3 className="line-clamp-2 min-h-[3.5rem] font-['Sora'] text-xl font-semibold text-white sm:text-2xl">
              {trip.title}
            </h3>
          </div>
          <div className="shrink-0 rounded-2xl border border-white/10 bg-black/35 px-3 py-2 text-right backdrop-blur-md">
            <p className="text-[10px] uppercase tracking-[0.2em] text-slate-400">Starting From</p>
            <p className="text-lg font-bold text-orange-300">
              {"\u20B9"}{trip.price}
            </p>
          </div>
        </div>
      </div>

      <div className="flex flex-1 flex-col p-5 sm:p-6">
        <p className="min-h-[5.25rem] text-sm leading-7 text-slate-300 line-clamp-3">
          {trip.description ||
            "A beautiful travel experience filled with scenic views, local culture, and memorable moments."}
        </p>

        <div className="mt-5 space-y-3 rounded-[24px] border border-white/10 bg-black/20 p-4">
          <p className="flex items-center gap-2 text-sm text-orange-200">
            <FaCalendarAlt /> Best time: {meta.bestTime}
          </p>
          <p className="flex items-center gap-2 text-sm text-cyan-200">
            <FaCloudSun /> {meta.weather}
          </p>
          <p className="flex items-center gap-2 text-sm text-emerald-200">
            <FaUsers /> Duration: {tripDuration}
          </p>
        </div>

        <div className="mt-6 flex flex-col gap-3 sm:mt-auto sm:flex-row">
          <button
            onClick={onClick}
            className="min-h-[48px] flex-1 rounded-2xl border border-white/10 bg-white/6 px-4 py-3 font-semibold text-white transition duration-300 hover:border-orange-300/30 hover:bg-white/10 active:scale-[0.98]"
          >
            View Details
          </button>

          <button
            onClick={() => openWhatsAppBooking(trip)}
            className="flex min-h-[48px] flex-1 items-center justify-center gap-2 rounded-2xl bg-gradient-to-r from-green-500 to-emerald-500 px-4 py-3 font-semibold text-white shadow-[0_12px_28px_rgba(34,197,94,0.2)] transition duration-300 hover:from-green-400 hover:to-emerald-400 active:scale-[0.98]"
          >
            <FaWhatsapp />
            Book Trip
          </button>
        </div>
      </div>
    </article>
  );
}

function Home({ wishlist, onToggleWishlist }) {
  const [trips, setTrips] = useState([]);
  // POPUP STATE
  const [showPopup, setShowPopup] = useState(true);
  // FORM STATE
  const [destination, setDestination] = useState("");
  const [budget, setBudget] = useState("");
  const [date, setDate] = useState("");
  const handleClosePopup = () => {
  setShowPopup(false);
};
  const handlePlanTrip = () => {
  const message = `Hello, I want to plan a trip:

Destination: ${destination || "Not specified"}
Budget: ${budget || "Not specified"}
Travel Date: ${date || "Not specified"}`;

  window.open(
    `https://wa.me/${WHATSAPP_NUMBER}?text=${encodeURIComponent(message)}`
  );

  handleClosePopup();
};
  const [reviews] = useState(fallbackReviews);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
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

  const featuredTrip = useMemo(() => {
    return filteredTrips.find((trip) => trip.trending) || filteredTrips[0] || trips[0] || null;
  }, [filteredTrips, trips]);

  const trustMetrics = useMemo(() => {
    const totalPackages = trips.reduce(
      (sum, trip) => sum + (Array.isArray(trip.packages) ? trip.packages.length : 0),
      0
    );
    const averageRating = trips.length
      ? (trips.reduce((sum, trip) => sum + (Number(trip.rating) || 0), 0) / trips.length).toFixed(1)
      : "4.9";

    return [
      {
        label: "Live departures",
        value: `${trips.length || 1}`,
        description: "Real trips currently active in the app, not filler cards.",
      },
      {
        label: "Package variants",
        value: `${totalPackages || 1}`,
        description: "Different trip formats and pricing options across the live routes.",
      },
      {
        label: "Visible rating",
        value: averageRating,
        description: "Average rating shown across the currently listed trips.",
      },
      {
        label: "Traveler stories",
        value: `${reviews.length}+`,
        description: "Review cards reinforcing the tone, comfort, and coordination people remember.",
      },
    ];
  }, [trips, reviews]);

  const homeFaqs = useMemo(
    () => [
      {
        question: "Why are there only a few trips on the website right now?",
        answer:
          "We prefer showing focused, real departures instead of filling the site with placeholder routes. It keeps the planning more honest and the communication more accurate.",
      },
      {
        question: "Do I need to pay directly on the website?",
        answer:
          "No. The website helps you explore routes and share preferences, while the actual confirmation happens with our team on WhatsApp.",
      },
      {
        question: "Can I ask for details before booking?",
        answer:
          "Yes. You can reach out with questions about route flow, stays, pickup, package differences, or suitability before you commit.",
      },
      {
        question: "Are the itinerary sections based on real route info?",
        answer:
          "Yes. We are increasingly grounding trip pages in actual PDFs, route details, and trip-specific information instead of generic copy.",
      },
    ],
    []
  );

  const hasActiveFilters =
    Boolean(searchTerm.trim()) ||
    Boolean(selectedLocation) ||
    sortBy !== "default" ||
    Boolean(maxPrice);

  const handleResetFilters = () => {
    setSearchTerm("");
    setSelectedLocation("");
    setSortBy("default");
    setMaxPrice("");
  };

  return (
    <main className="relative z-10 min-h-screen text-white">
      <LiveBackground />
      <Navbar wishlistCount={wishlist.length} />

      <section id="trips" className="mx-auto max-w-7xl px-6 pb-12 pt-28">
        <div className="noise-overlay brand-sheen mb-12 rounded-[36px] border border-white/10 bg-black/18 px-6 py-8 shadow-[0_30px_80px_rgba(0,0,0,0.28)] backdrop-blur-xl animate-fadeInUp sm:mb-16 sm:px-8 sm:py-10">
          <p className="section-kicker mb-4 text-[11px] sm:text-sm">
            Himalayan Group Departures
          </p>

          <h1 className="hero-title text-4xl font-extrabold leading-[1.05] text-white sm:text-5xl md:text-7xl">
            <span className="inline-block font-['Sora'] animate-floatSoft">Travel with stories,</span>
            <span className="block font-['Sora'] text-orange-200 animate-floatSoft">
              not just itineraries.
            </span>
          </h1>

          <p className="hero-subtitle mt-5 max-w-3xl text-base leading-8 text-slate-200 sm:mt-6 sm:text-lg md:text-xl">
            Discover Spiti departures that feel premium in planning, calm in execution,
            and memorable for the right reasons. Explore the route, choose your package,
            and lock your seat directly on WhatsApp.
          </p>

          <div className="mt-8 grid gap-4 sm:grid-cols-3">
            <div className="rounded-[24px] border border-amber-300/10 bg-white/6 p-4">
              <p className="text-[11px] uppercase tracking-[0.24em] text-slate-400">Live Trips</p>
              <p className="mt-2 font-['Sora'] text-3xl font-semibold text-white">{trips.length || 1}</p>
              <p className="mt-1 text-sm text-slate-300">Curated departures currently visible in the app.</p>
            </div>
            <div className="rounded-[24px] border border-teal-400/10 bg-white/6 p-4">
              <p className="text-[11px] uppercase tracking-[0.24em] text-slate-400">WhatsApp Booking</p>
              <p className="mt-2 font-['Sora'] text-3xl font-semibold text-white">1 Tap</p>
              <p className="mt-1 text-sm text-slate-300">Share your details once and finalize the rest directly with our team.</p>
            </div>
            <div className="rounded-[24px] border border-amber-300/10 bg-white/6 p-4">
              <p className="text-[11px] uppercase tracking-[0.24em] text-slate-400">Traveler Love</p>
              <p className="mt-2 font-['Sora'] text-3xl font-semibold text-white">{reviews.length}+</p>
              <p className="mt-1 text-sm text-slate-300">Positive stories that reinforce the booking confidence.</p>
            </div>
          </div>
        </div>

        <FeaturedSpotlight
          trip={featuredTrip}
          onViewTrip={() => featuredTrip && navigate(`/trip/${featuredTrip._id}`)}
        />

        <div className="mb-8 sm:mb-10">
          <p className="section-kicker mb-3 text-[11px]">Browse Departures</p>
          <h2 className="section-title text-3xl font-semibold text-white sm:text-4xl">
            Explore the trips that are live right now
          </h2>
          <p className="mt-4 max-w-3xl text-base leading-8 text-slate-300">
            Compare route style, duration, and pricing in one place, then open the trip
            that feels right for your kind of travel.
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
          hasActiveFilters={hasActiveFilters}
          onResetFilters={handleResetFilters}
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
          <div>
            <div className="mb-6 flex flex-wrap items-end justify-between gap-3">
              <div>
                <p className="text-[11px] uppercase tracking-[0.24em] text-slate-400">
                  Live Trip Cards
                </p>
                <h3 className="mt-2 font-['Sora'] text-2xl font-semibold text-white">
                  Current departures
                </h3>
              </div>
              <p className="text-sm text-slate-300">
                Showing {filteredTrips.length} {filteredTrips.length === 1 ? "trip" : "trips"}
              </p>
            </div>

            <div id="trips-list" className="grid gap-6 scroll-mt-28 sm:grid-cols-2 lg:grid-cols-3 sm:gap-8">
              {filteredTrips.map((trip, index) => (
                <div
                  key={trip._id}
                  className="animate-fadeInUp"
                  style={{ animationDelay: `${index * 0.1}s` }}
                >
                  <TripCard
                    trip={trip}
                    onClick={() => navigate(`/trip/${trip._id}`)}
                    isWishlisted={isTripWishlisted(wishlist, trip)}
                    onToggleWishlist={onToggleWishlist}
                  />
                </div>
              ))}
            </div>
          </div>
        )}
      </section>

      <BookingFlowSection />
      <BrandStorySection />
      <TrustAndFAQSection faqs={homeFaqs} metrics={trustMetrics} />
      <WhyUs />
      <Reviews reviews={reviews} />
      {showPopup && (
  <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/75 backdrop-blur-md">

    <div className="glass-card w-[90%] max-w-lg rounded-[30px] p-6 text-white sm:p-7">

      <p className="section-kicker mb-3 text-center text-[11px]">Plan With Our Team</p>
      <h2 className="font-['Sora'] text-2xl font-semibold text-white text-center">
        Plan Your Trip {"\u2708\uFE0F"}
      </h2>
      <p className="mt-3 text-center text-sm leading-7 text-slate-300">
        Share your destination, budget, and travel timing. We will take the
        conversation forward on WhatsApp with the right departure option.
      </p>

      {/* DESTINATION */}
      <input
        type="text"
        placeholder="Where do you want to go?"
        value={destination}
        onChange={(e) => setDestination(e.target.value)}
        className="mt-5 w-full rounded-2xl border border-white/10 bg-black/30 p-3 text-white outline-none placeholder:text-slate-500 focus:border-orange-300"
      />

      {/* BUDGET */}
      <input
        type="text"
        placeholder="Your budget (\u20B9)"
        value={budget}
        onChange={(e) => setBudget(e.target.value)}
        className="mt-3 w-full rounded-2xl border border-white/10 bg-black/30 p-3 text-white outline-none placeholder:text-slate-500 focus:border-orange-300"
      />

      {/* DATE */}
      <input
        type="date"
        value={date}
        onChange={(e) => setDate(e.target.value)}
        className="mt-3 w-full rounded-2xl border border-white/10 bg-black/30 p-3 text-white outline-none focus:border-orange-300"
      />

      {/* BUTTONS */}
      <div className="mt-5 flex flex-col gap-3 sm:flex-row">

        <button
          onClick={handlePlanTrip}
          className="flex-1 rounded-2xl bg-gradient-to-r from-green-500 to-emerald-500 py-3 font-semibold text-white transition hover:from-green-400 hover:to-emerald-400"
        >
          Plan Now
        </button>

        <button
          onClick={handleClosePopup}
          className="flex-1 rounded-2xl border border-white/15 py-3 font-semibold text-slate-200 transition hover:bg-white/10"
        >
          Skip
        </button>

      </div>
    </div>
  </div>
)}
      <Footer />
      <FloatingWhatsApp />
    </main>
  );
}

function TrustAndFAQSection({ faqs, metrics }) {
  return (
    <section className="pb-24 text-white">
      <div className="mx-auto max-w-7xl px-6">
        <div className="mb-8">
          <p className="section-kicker mb-3 text-[11px]">Trust And Clarity</p>
          <h2 className="section-title text-3xl font-semibold text-white sm:text-4xl">
            The quick proof travelers usually look for before they message us
          </h2>
          <p className="mt-4 max-w-3xl text-base leading-8 text-slate-300">
            Strong travel sites do not rely only on visuals. They also make it easy to
            trust the process, understand the flow, and get answers fast.
          </p>
        </div>

        <div className="grid gap-8 lg:grid-cols-[0.9fr_1.1fr]">
        <div className="glass-card rounded-[32px] p-6 sm:p-8">
          <p className="section-kicker mb-4 text-[11px]">Trust Signals</p>
          <h2 className="section-title text-3xl font-semibold text-white">
            Enough proof to make the next click easier
          </h2>
          <p className="mt-5 text-base leading-8 text-slate-300">
            Even with a focused set of departures, the site should still answer the
            questions travelers have before they reach out. These quick numbers help frame
            the quality and clarity behind the journeys.
          </p>

          <div className="mt-8 grid gap-4 sm:grid-cols-2">
            {metrics.map((metric) => (
              <div
                key={metric.label}
                className="rounded-[24px] border border-white/10 bg-white/6 p-5"
              >
                <p className="text-[11px] uppercase tracking-[0.24em] text-slate-400">
                  {metric.label}
                </p>
                <p className="mt-3 font-['Sora'] text-3xl font-semibold text-white">
                  {metric.value}
                </p>
                <p className="mt-2 text-sm leading-7 text-slate-300">
                  {metric.description}
                </p>
              </div>
            ))}
          </div>
        </div>

        <FAQSection
          faqs={faqs}
          title="Questions travelers usually ask before booking"
          description="Clear answers upfront make the WhatsApp conversation shorter, easier, and more reassuring."
          className="glass-card rounded-[32px] p-6 sm:p-8"
          titleClassName="font-['Sora'] text-3xl font-semibold text-white"
        />
        </div>
      </div>
    </section>
  );
}

function FAQSection({
  faqs,
  title = "Frequently Asked Questions",
  description = "",
  className = "mt-10 rounded-2xl border border-white/10 bg-white/5 p-6 backdrop-blur-md",
  titleClassName = "text-2xl font-bold text-orange-400",
}) {
  const [openIndex, setOpenIndex] = useState(0);

  return (
    <section className={className}>
      <h2 className={`mb-4 ${titleClassName}`}>{title}</h2>
      {description && (
        <p className="mb-6 max-w-2xl text-base leading-8 text-slate-300">
          {description}
        </p>
      )}

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

function TripDetail({ wishlist, onToggleWishlist }) {
  const { id } = useParams();
  const navigate = useNavigate();

  const [selectedPackage, setSelectedPackage] = useState(null);
  const [trip, setTrip] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [selectedImage, setSelectedImage] = useState(null);
  const [travelDate, setTravelDate] = useState("");
  const [people, setPeople] = useState(1);
  const [pickupCity, setPickupCity] = useState("");
  const [roomType, setRoomType] = useState("Double Sharing");
  const [specialRequest, setSpecialRequest] = useState("");
  const [activeSection, setActiveSection] = useState("overview");

  const today = new Date().toISOString().split("T")[0];

  useEffect(() => {
    axios
      .get(`${API}/trips`)
      .then((res) => {
        const trips = res.data;
        const selectedTrip = trips.find(
          (item) => item._id === id || item._id === id?.toString()
);

       setTrip(selectedTrip || trips[0]);
       if ((selectedTrip || trips[0])?.packages?.length > 0) {
         setSelectedPackage((selectedTrip || trips[0]).packages[0]);
} 

        const finalTrip = selectedTrip || trips[0];
        const batches = getBatchDates(finalTrip);
        if (batches.length > 0) {
          setTravelDate(batches[0].date);
        } else {
          setTravelDate("");
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
  const packageGuide = getPackageGuide(selectedPackage);
  const overview = buildFallbackOverview(trip || {}, selectedPackage, packageGuide);
  const highlights = buildFallbackHighlights(trip || {}, selectedPackage, packageGuide);
  const itineraryItems = buildFallbackItinerary(trip || {}, selectedPackage, packageGuide);
  const inclusionItems = buildFallbackInclusions(trip || {}, selectedPackage, packageGuide);
  const exclusionItems = buildFallbackExclusions(trip || {}, packageGuide);

  const toggleWishlist = () => {
    if (!trip) return;
    onToggleWishlist(trip);
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

        {trip && (
          <div>
            <article className="glass-card overflow-hidden rounded-[34px]">
              <div className="relative">
                <img
                  src={trip.image}
                  alt={trip.title}
                  className="h-72 w-full object-cover md:h-[28rem]"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent" />

                <button
                  onClick={toggleWishlist}
                  className="absolute right-6 top-6 flex h-12 w-12 items-center justify-center rounded-full border border-white/10 bg-black/45 text-xl text-white backdrop-blur-md transition hover:scale-110"
                >
                  {isTripWishlisted(wishlist, trip) ? (
                    <FaHeart className="text-red-500" />
                  ) : (
                    <FaRegHeart />
                  )}
                </button>

                <div className="absolute bottom-0 left-0 right-0 px-6 pb-6 md:px-8 md:pb-8">
                  <div className="flex flex-wrap gap-3">
                    <span className="rounded-full border border-white/10 bg-black/30 px-4 py-2 text-xs uppercase tracking-[0.24em] text-orange-200 backdrop-blur-md">
                      {trip.location || "Featured destination"}
                    </span>
                    <span className="rounded-full border border-white/10 bg-black/30 px-4 py-2 text-xs uppercase tracking-[0.24em] text-slate-200 backdrop-blur-md">
                      {selectedPackage?.duration || trip.duration || "Curated Departure"}
                    </span>
                  </div>
                </div>
              </div>

              <div className="grid gap-8 p-6 md:grid-cols-3 md:p-8">
                <div className="md:col-span-2">
                  <p className="mb-3 text-sm uppercase tracking-[0.3em] text-orange-300/80">
                    {trip.location || "Featured destination"}
                  </p>

                  <h1 className="font-['Sora'] text-4xl font-semibold text-white md:text-5xl">{trip.title}</h1>
                  {trip?.packages?.length > 1 && (
                    <div className="mt-6">
                      <h2 className="mb-4 font-['Sora'] text-xl font-semibold text-orange-200">
                        Available Packages
                      </h2>

                      <div className="grid gap-4 sm:grid-cols-2">
                        {trip.packages.map((pkg, index) => {
                          return (
                            <div
                              key={index}
                              className={`rounded-2xl border p-5 transition duration-300 ${
                                selectedPackage?.name === pkg.name
                                  ? "border-orange-300/40 bg-orange-400/10 scale-[1.02] shadow-[0_18px_40px_rgba(249,115,22,0.16)]"
                                  : "border-white/10 bg-black/20 hover:border-white/20 hover:bg-black/28"
                              }`}
                            >
                              <h3 className="font-['Sora'] text-lg font-semibold text-white">{pkg.name}</h3>

                              <p className="mt-3 text-2xl font-semibold text-orange-300">
                                {"\u20B9"}{pkg.price}
                              </p>

                              <p className="mt-1 text-slate-400">
                                {pkg.duration || "Duration not specified"}
                              </p>

                              <button
                                onClick={() => setSelectedPackage(pkg)}
                                className={`mt-4 w-full rounded-xl py-2.5 font-semibold transition ${
                                  selectedPackage?.name === pkg.name
                                    ? "bg-orange-500 text-white"
                                    : "bg-white/8 text-white hover:bg-white/14"
                                }`}
                              >
                                {selectedPackage?.name === pkg.name ? "Selected \u2713" : "Select Package"}
                              </button>

                              <a
                                href={getPdfHref(pkg.pdf)}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="mt-2 block w-full rounded-xl border border-white/10 bg-white/5 py-2.5 text-center font-medium text-slate-100 transition hover:bg-white/10"
                              >
                                View Itinerary
                              </a>
                            </div>
                          );
                        })}
                      </div>
                    </div>
                  )}

                  <p className="mt-4 text-2xl font-semibold text-orange-300">
                    {"\u20B9"}{selectedPackage?.price || trip.price}
                  </p>

                  {trip?.packages?.length === 1 && selectedPackage?.pdf && (
                    <a
                      href={getPdfHref(selectedPackage.pdf)}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="mt-4 inline-flex rounded-xl border border-white/10 bg-white/5 px-4 py-2.5 text-sm font-medium text-slate-100 transition hover:bg-white/10"
                    >
                      View Itinerary
                    </a>
                  )}

                  <p className="mt-6 leading-8 text-slate-300">
                    {trip.description ||
                      "A curated travel experience with beautiful views, smooth planning, and a vibrant explorer community."}
                  </p>

                  <div className="mt-8 grid gap-4 md:grid-cols-2">
                    <div className="rounded-[24px] border border-orange-300/20 bg-orange-400/10 p-5">
                      <p className="mb-2 flex items-center gap-2 text-lg font-bold text-orange-200">
                        <FaCalendarAlt /> Best Time to Visit
                      </p>
                      <p className="text-slate-200">{meta.bestTime}</p>
                    </div>

                    <div className="rounded-[24px] border border-cyan-300/20 bg-cyan-400/10 p-5">
                      <p className="mb-2 flex items-center gap-2 text-lg font-bold text-cyan-200">
                        <FaCloudSun /> Weather
                      </p>
                      <p className="text-slate-200">{meta.weather}</p>
                    </div>
                  </div>

                  <div className="mt-10 flex flex-wrap gap-3">
                    <button
                      onClick={() => setActiveSection("overview")}
                      className={`rounded-full px-5 py-2 text-sm font-semibold transition ${
                        activeSection === "overview"
                          ? "bg-sky-500 text-white"
                          : "border border-white/20 bg-white/10 text-gray-300 hover:bg-white/20"
                      }`}
                    >
                      About
                    </button>

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

                  <div className="glass-card mt-8 rounded-[28px] p-6">
                    {activeSection === "overview" && (
                      <div>
                        <h2 className="mb-4 text-2xl font-bold text-sky-400">
                          About This Trip
                        </h2>
                        <p className="leading-8 text-gray-300">{overview}</p>

                        <div className="mt-6 grid gap-3 md:grid-cols-2">
                          {highlights.map((item, index) => (
                            <div
                              key={`${item}-${index}`}
                              className="rounded-xl border border-teal-400/20 bg-teal-500/10 p-4 text-gray-200"
                            >
                              {item}
                            </div>
                          ))}
                        </div>
                      </div>
                    )}

                    {activeSection === "itinerary" && (
                      <div>
                        <h2 className="mb-4 text-2xl font-bold text-orange-400">
                          Itinerary
                        </h2>
                        <ul className="space-y-3 text-gray-300">
                          {itineraryItems.map((item, index) => (
                            <li
                              key={`${item.title || item}-${index}`}
                              className="rounded-2xl border border-white/10 bg-black/20 p-4"
                            >
                              <p className="font-semibold text-white">
                                Day {index + 1} - {item.title || `Trip experience`}
                              </p>
                              <p className="mt-2 leading-7 text-gray-300">
                                {item.description || item}
                              </p>
                            </li>
                          ))}
                        </ul>
                      </div>
                    )}

                    {activeSection === "inclusions" && (
                      <div>
                        <h2 className="mb-4 text-2xl font-bold text-green-400">
                          Inclusions
                        </h2>
                        <ul className="space-y-3 text-gray-300">
                          {inclusionItems.map((item, index) => (
                            <li
                              key={`${item}-${index}`}
                              className="rounded-xl border border-green-500/20 bg-green-500/10 p-4"
                            >
                              {item}
                            </li>
                          ))}
                        </ul>
                      </div>
                    )}

                    {activeSection === "exclusions" && (
                      <div>
                        <h2 className="mb-4 text-2xl font-bold text-red-400">
                          Exclusions
                        </h2>
                        <ul className="space-y-3 text-gray-300">
                          {exclusionItems.map((item, index) => (
                            <li
                              key={`${item}-${index}`}
                              className="rounded-xl border border-red-500/20 bg-red-500/10 p-4"
                            >
                              {item}
                            </li>
                          ))}
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
                    <div className="glass-card rounded-[28px] p-6 md:sticky md:top-28">
                    <h2 className="mb-2 font-['Sora'] text-xl font-semibold text-white">
                      Book This Trip
                    </h2>
                    <p className="mb-4 text-sm leading-6 text-slate-300">
                      Share your preferred travel date, traveler count, and room preference. We will take the booking forward on WhatsApp.
                    </p>

                    <label className="mb-2 block text-sm text-gray-300">Travel date</label>
                    <input
                      type="date"
                      min={today}
                      value={travelDate}
                      onChange={(e) => setTravelDate(e.target.value)}
                      className="mb-4 w-full rounded-2xl border border-white/10 bg-black/30 p-3 text-white outline-none focus:border-orange-300"
                    />

                    <label className="mb-2 block text-sm text-gray-300">Number of people</label>
                    <input
                      type="number"
                      min="1"
                      value={people}
                      onChange={(e) => setPeople(Number(e.target.value))}
                      className="mb-4 w-full rounded-2xl border border-white/10 bg-black/30 p-3 text-white outline-none focus:border-orange-300"
                    />

                    <label className="mb-2 block text-sm text-gray-300">Pickup city</label>
                    <input
                      type="text"
                      value={pickupCity}
                      onChange={(e) => setPickupCity(e.target.value)}
                      placeholder="Enter pickup city"
                      className="mb-4 w-full rounded-2xl border border-white/10 bg-black/30 p-3 text-white outline-none placeholder:text-slate-500 focus:border-orange-300"
                    />

                    <label className="mb-2 block text-sm text-gray-300">Room preference</label>
                    <select
                      value={roomType}
                      onChange={(e) => setRoomType(e.target.value)}
                      className="mb-4 w-full rounded-2xl border border-white/10 bg-black/30 p-3 text-white outline-none focus:border-orange-300"
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
                      className="mb-4 w-full rounded-2xl border border-white/10 bg-black/30 p-3 text-white outline-none placeholder:text-slate-500 focus:border-orange-300"
                    />

                    <div className="mb-4 rounded-[24px] border border-orange-300/15 bg-orange-400/8 p-4">
                      <p className="text-sm uppercase tracking-[0.22em] text-slate-400">Total Price</p>
                      <p className="mt-2 text-3xl font-bold text-orange-300">
                        {"\u20B9"}{(selectedPackage?.price || trip.price) * people}
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
                          specialRequest || "None",
                          selectedPackage
                        )
                      }
                      className="w-full rounded-2xl bg-gradient-to-r from-green-500 to-emerald-500 px-6 py-3 font-semibold text-white shadow-[0_12px_30px_rgba(34,197,94,0.24)] transition hover:from-green-400 hover:to-emerald-400"
                    >
                      Book Now
                    </button>
                  </div>
</div>
</div>
</article>
</div>
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
    <footer id="contact" className="relative z-10 mt-2 bg-black/80 text-white backdrop-blur-xl">
      <div className="mx-auto grid max-w-7xl gap-10 px-6 py-16 md:grid-cols-2 lg:grid-cols-4">
        <div id="footer-about" className="scroll-mt-28">
          <h3 className="mb-6 border-b border-orange-300/30 pb-2 font-['Sora'] text-2xl font-semibold">
            About Us
          </h3>
          <p className="text-slate-300 leading-7">
            The Meraki Tribe creates group trips that feel planned by travelers, not
            by a generic booking engine. We focus on real routes, comfortable travel
            coordination, and the kind of on-ground support that helps solo travelers,
            couples, and small groups enjoy the journey without worrying about every
            transfer, stay, and schedule.
          </p>
          <p className="mt-4 text-slate-400 leading-7">
            Our style is simple: meaningful mountain and backpacking experiences,
            transparent communication, women-friendly group travel, and itineraries
            that balance iconic spots with enough breathing room to actually enjoy
            the destination.
          </p>
        </div>

        <div>
          <h3 className="mb-6 border-b border-orange-300/30 pb-2 font-['Sora'] text-2xl font-semibold">
            Live Trips
          </h3>
          <ul className="space-y-3 text-slate-300">
            <li>
              <Link to="/trip/1" className="transition hover:text-orange-300">
                Spiti Valley
              </Link>
            </li>
            <li>
              <span className="text-slate-500">
                More destinations coming soon
              </span>
            </li>
          </ul>
        </div>

        <div>
          <h3 className="mb-6 border-b border-orange-300/30 pb-2 font-['Sora'] text-2xl font-semibold">
            Quick Links
          </h3>
          <ul className="space-y-3 text-slate-300">
            <li>
              <Link to="/#footer-about" className="transition hover:text-orange-300">
                About Us
              </Link>
            </li>
            <li>
              <Link to="/#trips-list" className="transition hover:text-orange-300">
                Trips
              </Link>
            </li>
            <li>
              <Link to="/#reviews" className="transition hover:text-orange-300">
                Reviews
              </Link>
            </li>
            <li>
              <Link to="/#contact" className="transition hover:text-orange-300">
                Contact Us
              </Link>
            </li>
            <li className="flex items-center gap-2">
              <FaInstagram className="text-pink-500" />
              <a
                href="https://www.instagram.com/the.merakitribe"
                target="_blank"
                rel="noopener noreferrer"
                className="transition hover:text-orange-300"
              >
                Instagram
              </a>
            </li>
          </ul>
        </div>

        <div>
          <h3 className="mb-6 border-b border-orange-300/30 pb-2 font-['Sora'] text-2xl font-semibold">
            Contact Us
          </h3>

          <ul className="space-y-4 text-slate-300">
            <li className="flex gap-2">
              <FaMapMarkerAlt className="mt-1 text-orange-400" />
              <a
                href="https://maps.app.goo.gl/FmbfyeuF7EhTaccW9?g_st=iwb"
                target="_blank"
                rel="noopener noreferrer"
                className="transition hover:text-orange-300"
              >
                The Meraki Tribe, Raj Nagar Extension, Ghaziabad, Uttar Pradesh 201301
              </a>
            </li>

            <li className="flex gap-2">
              <FaPhoneAlt className="mt-1 text-orange-400" />
              <div className="flex flex-col">
                <a href="tel:+919662351358" className="transition hover:text-orange-300">
                  +91 96623 51358
                </a>
                <a href="tel:+919027059288" className="transition hover:text-orange-300">
                  +91 90270 59288
                </a>
              </div>
            </li>

            <li className="flex gap-2">
              <FaEnvelope className="mt-1 text-orange-400" />
              <a
                href="mailto:info.merakitribe@gmail.com"
                className="transition hover:text-orange-300"
              >
                info.merakitribe@gmail.com
              </a>
            </li>

            <li className="flex gap-2">
              <FaClock className="mt-1 text-orange-400" />
              <span>10:00 AM to 10:00 PM</span>
            </li>
          </ul>

          <div className="mt-8 overflow-hidden rounded-[28px] border border-orange-300/20 bg-white/8 backdrop-blur-sm">
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
            className="mt-3 inline-block text-sm font-medium text-orange-300 transition hover:text-orange-200"
          >
            Open exact location in Google Maps
          </a>
        </div>
      </div>

      <div className="border-t border-white/10 bg-gradient-to-r from-black/60 via-black/30 to-black/60 px-6 py-6 text-sm text-slate-300">
        <div className="mx-auto flex max-w-7xl flex-col items-center justify-between gap-4 md:flex-row">
          <p>The Meraki Tribe. All Rights Reserved.</p>
          <div className="flex flex-wrap gap-3">
            <span className="rounded-full border border-white/10 bg-white/6 px-3 py-1">
              PayPal
            </span>
            <span className="rounded-full border border-white/10 bg-white/6 px-3 py-1">
              Visa
            </span>
            <span className="rounded-full border border-white/10 bg-white/6 px-3 py-1">
              MasterCard
            </span>
            <span className="rounded-full border border-white/10 bg-white/6 px-3 py-1">
              UPI
            </span>
            <span className="rounded-full border border-white/10 bg-white/6 px-3 py-1">
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

function ScrollManager() {
  const { pathname, hash } = useLocation();

  useEffect(() => {
    let timeoutId;

    const scrollToHashTarget = () => {
      if (!hash) return false;

      const target = document.getElementById(hash.slice(1));
      if (!target) return false;

      target.scrollIntoView({ behavior: "smooth", block: "start" });
      return true;
    };

    const frameId = window.requestAnimationFrame(() => {
      if (hash) {
        const foundTarget = scrollToHashTarget();

        if (!foundTarget) {
          timeoutId = window.setTimeout(() => {
            if (!scrollToHashTarget()) {
              window.scrollTo({ top: 0, left: 0, behavior: "auto" });
            }
          }, 300);
        }

        return;
      }

      window.scrollTo({ top: 0, left: 0, behavior: "auto" });
    });

    return () => {
      window.cancelAnimationFrame(frameId);
      if (timeoutId) window.clearTimeout(timeoutId);
    };
  }, [pathname, hash]);

  return null;
}

function App() {
  const [wishlist, setWishlist] = useState(() => {
    if (typeof window === "undefined") return [];

    try {
      const storedWishlist = localStorage.getItem(WISHLIST_STORAGE_KEY);
      const parsedWishlist = storedWishlist ? JSON.parse(storedWishlist) : [];
      return Array.isArray(parsedWishlist) ? parsedWishlist : [];
    } catch (error) {
      console.error("Failed to load wishlist from storage.", error);
      return [];
    }
  });

  useEffect(() => {
    if (typeof window === "undefined") return;

    localStorage.setItem(WISHLIST_STORAGE_KEY, JSON.stringify(wishlist));
  }, [wishlist]);

  const handleToggleWishlist = (trip) => {
    const tripId = getTripId(trip);
    if (!tripId) return;

    setWishlist((prev) => {
      const exists = prev.some((item) => getTripId(item) === tripId);
      if (exists) {
        return prev.filter((item) => getTripId(item) !== tripId);
      }

      return [...prev, trip];
    });
  };

  return (
    <>
      <ScrollManager />
      <Routes>
        <Route
          path="/"
          element={<Home wishlist={wishlist} onToggleWishlist={handleToggleWishlist} />}
        />
        <Route
          path="/trip/:id"
          element={<TripDetail wishlist={wishlist} onToggleWishlist={handleToggleWishlist} />}
        />
      </Routes>
    </>
  );
}

export default App;
