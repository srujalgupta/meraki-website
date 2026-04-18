const fs = require("fs");
const path = require("path");
const mongoose = require("mongoose");
require("dotenv").config();

const express = require("express");
const cors = require("cors");
const Trip = require("./models/Trip");

const app = express();
const PORT = Number(process.env.PORT) || 5000;
const NODE_ENV = process.env.NODE_ENV || "development";
const IS_PRODUCTION = NODE_ENV === "production";
const PUBLIC_DIR = path.join(__dirname, "public");
const SAMPLE_DATA_DIR = path.join(__dirname, "sample-data");
const GOOGLE_PLACES_API_KEY = process.env.GOOGLE_PLACES_API_KEY?.trim() || "";
const GOOGLE_PLACES_PLACE_ID = process.env.GOOGLE_PLACES_PLACE_ID?.trim() || "";
const GOOGLE_PLACES_LANGUAGE_CODE = process.env.GOOGLE_PLACES_LANGUAGE_CODE?.trim() || "en";
const CLIENT_ORIGINS = (process.env.CLIENT_ORIGINS || "http://localhost:3000,http://localhost:5173")
  .split(",")
  .map((origin) => origin.trim())
  .filter(Boolean);
const allowAllOrigins = CLIENT_ORIGINS.includes("*");

const normalizeOrigin = (origin = "") => {
  const trimmedOrigin = origin.trim();

  if (!trimmedOrigin || trimmedOrigin.includes("*")) {
    return trimmedOrigin.replace(/\/+$/, "");
  }

  try {
    return new URL(trimmedOrigin).origin;
  } catch {
    return trimmedOrigin.replace(/\/+$/, "");
  }
};

const escapeRegex = (value = "") => value.replace(/[|\\{}()[\]^$+?.]/g, "\\$&");

const configuredOriginMatchers = CLIENT_ORIGINS.map((origin) => {
  const normalizedOrigin = normalizeOrigin(origin);

  if (!normalizedOrigin || normalizedOrigin === "*") {
    return null;
  }

  if (!normalizedOrigin.includes("*")) {
    return {
      type: "exact",
      value: normalizedOrigin,
    };
  }

  return {
    type: "pattern",
    value: new RegExp(
      `^${normalizedOrigin.split("*").map(escapeRegex).join(".*")}$`,
      "i"
    ),
  };
}).filter(Boolean);

const isPrivateHostname = (hostname = "") => {
  const normalizedHostname = hostname.toLowerCase();

  if (
    normalizedHostname === "localhost" ||
    normalizedHostname === "127.0.0.1" ||
    normalizedHostname === "::1" ||
    normalizedHostname === "[::1]"
  ) {
    return true;
  }

  if (/^10\.\d{1,3}\.\d{1,3}\.\d{1,3}$/.test(normalizedHostname)) {
    return true;
  }

  if (/^192\.168\.\d{1,3}\.\d{1,3}$/.test(normalizedHostname)) {
    return true;
  }

  const match = normalizedHostname.match(/^172\.(\d{1,3})\.\d{1,3}\.\d{1,3}$/);
  return Boolean(match && Number(match[1]) >= 16 && Number(match[1]) <= 31);
};

const isAllowedOrigin = (origin) => {
  if (!origin || allowAllOrigins) {
    return true;
  }

  const normalizedOrigin = normalizeOrigin(origin);

  if (
    configuredOriginMatchers.some((matcher) =>
      matcher.type === "exact"
        ? matcher.value === normalizedOrigin
        : matcher.value.test(normalizedOrigin)
    )
  ) {
    return true;
  }

  if (IS_PRODUCTION) {
    return false;
  }

  try {
    const parsedOrigin = new URL(origin);
    return isPrivateHostname(parsedOrigin.hostname);
  } catch {
    return false;
  }
};

const slugifyTripValue = (value) =>
  value
    ?.toString()
    .trim()
    .toLowerCase()
    .replace(/\s+x\s+/g, "-")
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "") || "";

const createFallbackTripId = (trip, index) => {
  const baseValue = trip?._id || trip?.id || trip?.title || `trip-${index + 1}`;
  return slugifyTripValue(baseValue);
};

const normalizeTrip = (trip, index) => ({
  ...trip,
  _id: String(trip?._id || createFallbackTripId(trip, index)),
  bestFor: Array.isArray(trip?.bestFor) ? trip.bestFor : [],
  highlights: Array.isArray(trip?.highlights) ? trip.highlights : [],
  itinerary: Array.isArray(trip?.itinerary) ? trip.itinerary : [],
  inclusions: Array.isArray(trip?.inclusions) ? trip.inclusions : [],
  exclusions: Array.isArray(trip?.exclusions) ? trip.exclusions : [],
  gallery: Array.isArray(trip?.gallery) ? trip.gallery : [],
  thingsToPack: Array.isArray(trip?.thingsToPack) ? trip.thingsToPack : [],
  faqs: Array.isArray(trip?.faqs) ? trip.faqs : [],
  batchDates: Array.isArray(trip?.batchDates) ? trip.batchDates : [],
  packages: Array.isArray(trip?.packages) ? trip.packages : [],
});

const loadFallbackTrips = () => {
  if (!fs.existsSync(SAMPLE_DATA_DIR)) {
    return [];
  }

  return fs
    .readdirSync(SAMPLE_DATA_DIR)
    .filter((fileName) => fileName.toLowerCase().endsWith(".json"))
    .map((fileName) => {
      const filePath = path.join(SAMPLE_DATA_DIR, fileName);

      try {
        return JSON.parse(fs.readFileSync(filePath, "utf8"));
      } catch (error) {
        console.error(`Skipping invalid sample trip file "${fileName}":`, error.message);
        return null;
      }
    })
    .filter(Boolean)
    .map(normalizeTrip);
};

const fallbackTrips = loadFallbackTrips();
let isDatabaseAvailable = false;
const publicAssetHandler = express.static(PUBLIC_DIR, {
  fallthrough: true,
  etag: true,
  maxAge: "1h",
});

app.disable("x-powered-by");
app.set("trust proxy", 1);

if (process.env.MONGO_URI) {
  mongoose
    .connect(process.env.MONGO_URI)
    .then(() => {
      isDatabaseAvailable = true;
      console.log("MongoDB connected");
    })
    .catch((error) => {
      console.error(
        "MongoDB connection failed. Starting in bundled sample-data mode:",
        error.message
      );
    });
} else {
  console.warn("MONGO_URI is not set. Starting in bundled sample-data mode.");
}

const getClientIp = (req) =>
  req.ip ||
  req.headers["x-forwarded-for"]?.toString().split(",")[0].trim() ||
  req.socket?.remoteAddress ||
  "unknown";

const normalizeGoogleReview = (review, index, placeDisplayName) => {
  const reviewText =
    review?.text?.text ||
    review?.originalText?.text ||
    "Shared a review on Google.";
  const authorName = review?.authorAttribution?.displayName || "Google traveler";
  const authorPhoto = review?.authorAttribution?.photoUri || "/logo.png";
  const publishedLabel =
    review?.relativePublishTimeDescription ||
    (review?.publishTime
      ? new Date(review.publishTime).toLocaleDateString("en-IN", {
          month: "long",
          year: "numeric",
        })
      : "Recently");

  return {
    id: review?.name || `google-review-${index + 1}`,
    name: authorName,
    place: "Google Reviews",
    tripName: placeDisplayName || "Reviewed on Google",
    month: publishedLabel,
    rating: Math.max(1, Math.min(5, Math.round(Number(review?.rating) || 5))),
    image: authorPhoto,
    text: reviewText,
    authorUrl: review?.authorAttribution?.uri || "",
    reviewUrl: review?.googleMapsUri || "",
  };
};

const fetchGooglePlaceReviews = async () => {
  if (!GOOGLE_PLACES_API_KEY || !GOOGLE_PLACES_PLACE_ID) {
    return {
      reviews: [],
      configured: false,
      source: "fallback",
    };
  }

  const controller = new AbortController();
  const timeoutId = setTimeout(() => controller.abort(), 8000);
  let response;

  try {
    response = await fetch(
      `https://places.googleapis.com/v1/places/${encodeURIComponent(
        GOOGLE_PLACES_PLACE_ID
      )}?languageCode=${encodeURIComponent(GOOGLE_PLACES_LANGUAGE_CODE)}`,
      {
        signal: controller.signal,
        headers: {
          "Content-Type": "application/json",
          "X-Goog-Api-Key": GOOGLE_PLACES_API_KEY,
          "X-Goog-FieldMask": "displayName,reviews",
        },
      }
    );
  } finally {
    clearTimeout(timeoutId);
  }

  if (!response.ok) {
    const errorText = await response.text();
    throw new Error(`Google Places request failed with ${response.status}: ${errorText}`);
  }

  const placeDetails = await response.json();
  const displayName = placeDetails?.displayName?.text || "Reviewed on Google";
  const reviews = (placeDetails?.reviews || []).map((review, index) =>
    normalizeGoogleReview(review, index, displayName)
  );

  return {
    reviews,
    configured: true,
    source: "google-places",
  };
};

const createRateLimiter = ({
  windowMs,
  maxRequests,
  message,
  keyPrefix = "global",
  keyGenerator = getClientIp,
}) => {
  const requests = new Map();

  return (req, res, next) => {
    const now = Date.now();
    const key = `${keyPrefix}:${keyGenerator(req)}`;
    const entry = requests.get(key);

    if (!entry || entry.resetAt <= now) {
      requests.set(key, { count: 1, resetAt: now + windowMs });
    } else {
      entry.count += 1;
    }

    const currentEntry = requests.get(key);
    const remaining = Math.max(maxRequests - currentEntry.count, 0);

    res.setHeader("X-RateLimit-Limit", String(maxRequests));
    res.setHeader("X-RateLimit-Remaining", String(remaining));
    res.setHeader("X-RateLimit-Reset", String(Math.ceil(currentEntry.resetAt / 1000)));

    if (currentEntry.count > maxRequests) {
      return res.status(429).json({
        success: false,
        message,
      });
    }

    if (requests.size > 5000) {
      for (const [storedKey, storedEntry] of requests.entries()) {
        if (storedEntry.resetAt <= now) requests.delete(storedKey);
      }
    }

    next();
  };
};

const securityHeaders = (req, res, next) => {
  res.setHeader("X-Content-Type-Options", "nosniff");
  res.setHeader("X-Frame-Options", "DENY");
  res.setHeader("Referrer-Policy", "strict-origin-when-cross-origin");
  res.setHeader("Permissions-Policy", "camera=(), microphone=(), geolocation=()");
  res.setHeader("Cross-Origin-Opener-Policy", "same-origin");
  res.setHeader(
    "Content-Security-Policy",
    "default-src 'none'; frame-ancestors 'none'; base-uri 'none'; form-action 'self'"
  );

  if (req.secure) {
    res.setHeader("Strict-Transport-Security", "max-age=31536000; includeSubDomains");
  }

  next();
};

const readLimiter = createRateLimiter({
  windowMs: 60 * 1000,
  maxRequests: 90,
  message: "Too many requests. Please slow down and try again in a minute.",
  keyPrefix: "read",
});

const writeLimiter = createRateLimiter({
  windowMs: 15 * 60 * 1000,
  maxRequests: 20,
  message: "Too many write requests. Please try again later.",
  keyPrefix: "write",
});

const staticAssetLimiter = createRateLimiter({
  windowMs: 5 * 60 * 1000,
  maxRequests: 240,
  message: "Too many asset requests. Please try again later.",
  keyPrefix: "static",
});

// Reuse this later for signup, login, OTP, or AI-generation endpoints.
const sensitiveActionLimiter = createRateLimiter({
  windowMs: 15 * 60 * 1000,
  maxRequests: 8,
  message: "Too many sensitive requests from this IP. Please try again later.",
  keyPrefix: "sensitive",
});

const sanitizeText = (value, maxLength = 240) => {
  if (typeof value !== "string") return undefined;

  const normalized = value.replace(/\s+/g, " ").trim().slice(0, maxLength);
  return normalized || undefined;
};

const sanitizeLongText = (value, maxLength = 1600) => {
  if (typeof value !== "string") return undefined;

  const normalized = value.replace(/\r\n/g, "\n").trim().slice(0, maxLength);
  return normalized || undefined;
};

const sanitizeBoolean = (value) => {
  if (typeof value === "boolean") return value;
  if (value === "true") return true;
  if (value === "false") return false;
  return undefined;
};

const sanitizeNumber = (value, { min = 0, max = Number.MAX_SAFE_INTEGER } = {}) => {
  if (value === "" || value === null || value === undefined) return undefined;

  const normalized = Number(value);
  if (!Number.isFinite(normalized)) return undefined;

  return Math.min(max, Math.max(min, normalized));
};

const sanitizeStringList = (value, { maxItems = 12, maxLength = 180 } = {}) => {
  if (!Array.isArray(value)) return [];

  return value
    .slice(0, maxItems)
    .map((item) => sanitizeText(item, maxLength))
    .filter(Boolean);
};

const sanitizeItineraryItems = (value) => {
  if (!Array.isArray(value)) return [];

  return value
    .slice(0, 12)
    .map((item) => ({
      title: sanitizeText(item?.title, 140),
      description: sanitizeLongText(item?.description, 600),
    }))
    .filter((item) => item.title && item.description);
};

const sanitizeFaqs = (value) => {
  if (!Array.isArray(value)) return [];

  return value
    .slice(0, 12)
    .map((item) => ({
      question: sanitizeText(item?.question, 180),
      answer: sanitizeLongText(item?.answer, 500),
    }))
    .filter((item) => item.question && item.answer);
};

const sanitizeBatchDates = (value) => {
  if (!Array.isArray(value)) return [];

  return value
    .slice(0, 20)
    .map((item) => ({
      date: sanitizeText(item?.date, 60),
      slots: sanitizeNumber(item?.slots, { min: 0, max: 500 }),
    }))
    .filter((item) => item.date);
};

const sanitizePackages = (value) => {
  if (!Array.isArray(value)) return [];

  return value
    .slice(0, 10)
    .map((item) => ({
      name: sanitizeText(item?.name, 160),
      price: sanitizeNumber(item?.price, { min: 0, max: 1000000 }),
      duration: sanitizeText(item?.duration, 80),
      pdf: sanitizeText(item?.pdf, 220),
    }))
    .filter((item) => item.name && item.price !== undefined);
};

const sanitizeTripPayload = (req, res, next) => {
  const isCreateRequest = req.method === "POST";
  const {
    title,
    location,
    price,
    duration,
    image,
    description,
    about,
    bestFor,
    highlights,
    itinerary,
    inclusions,
    exclusions,
    gallery,
    thingsToPack,
    faqs,
    batchDates,
    rating,
    category,
    trending,
    packages,
  } = req.body;

  const normalizedBody = {
    title: sanitizeText(title, 160),
    location: sanitizeText(location, 160),
    price: sanitizeNumber(price, { min: 0, max: 1000000 }),
    duration: sanitizeText(duration, 80),
    image: sanitizeText(image, 300),
    description: sanitizeLongText(description, 500),
    about: sanitizeLongText(about, 1800),
    rating: sanitizeNumber(rating, { min: 0, max: 5 }),
    category: sanitizeText(category, 120),
    trending: sanitizeBoolean(trending),
  };

  if (
    isCreateRequest &&
    (
      !normalizedBody.title ||
      !normalizedBody.location ||
      normalizedBody.price === undefined ||
      !normalizedBody.duration ||
      !normalizedBody.image
    )
  ) {
    return res.status(400).json({
      success: false,
      message: "title, location, price, duration, and image are required.",
    });
  }

  if (bestFor !== undefined) normalizedBody.bestFor = sanitizeStringList(bestFor, { maxItems: 12 });
  if (highlights !== undefined) normalizedBody.highlights = sanitizeStringList(highlights, { maxItems: 12 });
  if (itinerary !== undefined) normalizedBody.itinerary = sanitizeItineraryItems(itinerary);
  if (inclusions !== undefined) normalizedBody.inclusions = sanitizeStringList(inclusions, { maxItems: 20 });
  if (exclusions !== undefined) normalizedBody.exclusions = sanitizeStringList(exclusions, { maxItems: 20 });
  if (gallery !== undefined) normalizedBody.gallery = sanitizeStringList(gallery, { maxItems: 24, maxLength: 300 });
  if (thingsToPack !== undefined) normalizedBody.thingsToPack = sanitizeStringList(thingsToPack, { maxItems: 20 });
  if (faqs !== undefined) normalizedBody.faqs = sanitizeFaqs(faqs);
  if (batchDates !== undefined) normalizedBody.batchDates = sanitizeBatchDates(batchDates);
  if (packages !== undefined) normalizedBody.packages = sanitizePackages(packages);

  req.body = Object.fromEntries(
    Object.entries(normalizedBody).filter(([, value]) => value !== undefined)
  );

  next();
};

const getTripsCollection = async () => {
  if (isDatabaseAvailable) {
    try {
      const tripsFromDatabase = await Trip.find().lean();
      if (tripsFromDatabase.length > 0) {
        return tripsFromDatabase.map(normalizeTrip);
      }
    } catch (error) {
      console.error("Failed to fetch trips from MongoDB. Falling back to sample data:", error.message);
    }
  }

  return fallbackTrips;
};

const getTripById = async (tripId) => {
  if (isDatabaseAvailable) {
    try {
      const tripFromDatabase = await Trip.findById(tripId).lean();
      if (tripFromDatabase) {
        return normalizeTrip(tripFromDatabase, 0);
      }
    } catch (error) {
      if (error.name !== "CastError") {
        console.error(
          "Failed to fetch trip details from MongoDB. Falling back to sample data:",
          error.message
        );
      }
    }
  }

  const requestedId = slugifyTripValue(tripId);

  return (
    fallbackTrips.find((trip) => {
      const lookupKeys = new Set(
        [
          trip?._id,
          trip?.id,
          trip?.title,
          slugifyTripValue(trip?._id),
          slugifyTripValue(trip?.id),
          slugifyTripValue(trip?.title),
        ].filter(Boolean)
      );

      return lookupKeys.has(tripId) || lookupKeys.has(requestedId);
    }) || null
  );
};

app.use(securityHeaders);
app.use(
  cors({
    origin(origin, callback) {
      if (isAllowedOrigin(origin)) {
        return callback(null, true);
      }

      return callback(new Error("Origin not allowed by CORS"));
    },
    methods: ["GET", "POST", "PUT", "DELETE"],
    credentials: true,
  })
);
app.use(express.json({ limit: "50kb" }));
app.use(express.urlencoded({ extended: true, limit: "50kb" }));
app.use((req, res, next) => {
  if (!path.extname(req.path)) {
    return next();
  }

  return staticAssetLimiter(req, res, (error) => {
    if (error) {
      return next(error);
    }

    return publicAssetHandler(req, res, next);
  });
});

app.get("/", readLimiter, (req, res) => {
  res.json({
    success: true,
    message: "Meraki Tribe API is running",
  });
});

app.get("/health", (req, res) => {
  res.json({
    success: true,
    status: "ok",
    database: isDatabaseAvailable ? "connected" : "sample-data",
    environment: NODE_ENV,
  });
});

app.get("/trips", readLimiter, async (req, res) => {
  try {
    const trips = await getTripsCollection();
    res.json(trips);
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});

app.get("/trips/:id", readLimiter, async (req, res) => {
  try {
    const trip = await getTripById(req.params.id);

    if (!trip) {
      return res.status(404).json({
        success: false,
        message: "Trip not found",
      });
    }

    return res.json(trip);
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: error.message,
    });
  }
});

app.get("/reviews", readLimiter, async (req, res) => {
  try {
    res.setHeader("Cache-Control", "no-store, no-cache, must-revalidate, proxy-revalidate");
    res.setHeader("Pragma", "no-cache");
    res.setHeader("Expires", "0");

    const payload = await fetchGooglePlaceReviews();

    return res.json(payload);
  } catch (error) {
    return res.status(502).json({
      success: false,
      message: "Unable to fetch Google reviews right now.",
      ...(IS_PRODUCTION ? {} : { details: error.message }),
    });
  }
});

app.post("/trips", writeLimiter, sensitiveActionLimiter, sanitizeTripPayload, async (req, res) => {
  if (!isDatabaseAvailable) {
    return res.status(503).json({
      success: false,
      message: "Database is not configured. The API is currently running in read-only sample mode.",
    });
  }

  try {
    const newTrip = new Trip(req.body);
    await newTrip.save();

    res.status(201).json({
      success: true,
      message: "Trip added successfully",
      trip: newTrip,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
});

app.put(
  "/trips/:id",
  writeLimiter,
  sensitiveActionLimiter,
  sanitizeTripPayload,
  async (req, res) => {
    if (!isDatabaseAvailable) {
      return res.status(503).json({
        success: false,
        message: "Database is not configured. The API is currently running in read-only sample mode.",
      });
    }

    try {
      const updatedTrip = await Trip.findByIdAndUpdate(req.params.id, req.body, {
        new: true,
        runValidators: true,
      });

      if (!updatedTrip) {
        return res.status(404).json({
          success: false,
          message: "Trip not found",
        });
      }

      res.json({
        success: true,
        message: "Trip updated successfully",
        trip: updatedTrip,
      });
    } catch (error) {
      res.status(500).json({
        success: false,
        message: error.message,
      });
    }
  }
);

app.use((err, req, res, next) => {
  if (err.message === "Origin not allowed by CORS") {
    return res.status(403).json({
      success: false,
      message: err.message,
    });
  }

  if (err.type === "entity.parse.failed") {
    return res.status(400).json({
      success: false,
      message: "Invalid JSON payload.",
    });
  }

  if (err.name === "AbortError") {
    return res.status(504).json({
      success: false,
      message: "Upstream service timed out.",
    });
  }

  console.error("Unhandled API error:", err.message);

  return res.status(500).json({
    success: false,
    message: "Internal server error",
  });
});

app.use((req, res) => {
  res.status(404).json({
    success: false,
    message: "Route not found",
  });
});

app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});
