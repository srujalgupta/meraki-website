const path = require("path");
const mongoose = require("mongoose");
require("dotenv").config();

const express = require("express");
const cors = require("cors");
const Trip = require("./models/Trip");

const app = express();
const PORT = Number(process.env.PORT) || 5000;
const PUBLIC_DIR = path.join(__dirname, "public");
const CLIENT_ORIGINS = (process.env.CLIENT_ORIGINS || "http://localhost:3000,http://localhost:5173")
  .split(",")
  .map((origin) => origin.trim())
  .filter(Boolean);

if (!process.env.MONGO_URI) {
  throw new Error("MONGO_URI is required. Add it to backend/.env before starting the server.");
}

app.disable("x-powered-by");
app.set("trust proxy", 1);

mongoose
  .connect(process.env.MONGO_URI)
  .then(() => console.log("MongoDB connected"))
  .catch((error) => {
    console.error("MongoDB connection failed:", error.message);
    process.exit(1);
  });

const getClientIp = (req) =>
  req.ip ||
  req.headers["x-forwarded-for"]?.toString().split(",")[0].trim() ||
  req.socket?.remoteAddress ||
  "unknown";

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
  maxRequests: 80,
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
    faqs,
    batchDates,
    rating,
    category,
    trending,
    packages,
  } = req.body;

  if (
    isCreateRequest &&
    (!title || !location || price === undefined || price === null || !duration || !image)
  ) {
    return res.status(400).json({
      success: false,
      message: "title, location, price, duration, and image are required.",
    });
  }

  const normalizedBody = {
    title,
    location,
    price,
    duration,
    image,
    description,
    about,
    rating,
    category,
    trending,
  };

  if (bestFor !== undefined) normalizedBody.bestFor = Array.isArray(bestFor) ? bestFor.slice(0, 12) : [];
  if (highlights !== undefined) normalizedBody.highlights = Array.isArray(highlights) ? highlights.slice(0, 12) : [];
  if (itinerary !== undefined) normalizedBody.itinerary = Array.isArray(itinerary) ? itinerary.slice(0, 12) : [];
  if (inclusions !== undefined) normalizedBody.inclusions = Array.isArray(inclusions) ? inclusions.slice(0, 20) : [];
  if (exclusions !== undefined) normalizedBody.exclusions = Array.isArray(exclusions) ? exclusions.slice(0, 20) : [];
  if (gallery !== undefined) normalizedBody.gallery = Array.isArray(gallery) ? gallery.slice(0, 12) : [];
  if (faqs !== undefined) normalizedBody.faqs = Array.isArray(faqs) ? faqs.slice(0, 12) : [];
  if (batchDates !== undefined) normalizedBody.batchDates = Array.isArray(batchDates) ? batchDates.slice(0, 20) : [];
  if (packages !== undefined) normalizedBody.packages = Array.isArray(packages) ? packages.slice(0, 10) : [];

  req.body = Object.fromEntries(
    Object.entries(normalizedBody).filter(([, value]) => value !== undefined)
  );

  next();
};

app.use(securityHeaders);
app.use(
  cors({
    origin(origin, callback) {
      if (!origin || CLIENT_ORIGINS.includes(origin)) {
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
app.use(
  staticAssetLimiter,
  express.static(PUBLIC_DIR, {
    fallthrough: true,
    etag: true,
    maxAge: "1h",
  })
);

app.get("/", readLimiter, (req, res) => {
  res.json({
    success: true,
    message: "Meraki Tribe API is running",
  });
});

app.get("/trips", readLimiter, async (req, res) => {
  try {
    const trips = await Trip.find();
    res.json(trips);
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});

app.post("/trips", writeLimiter, sensitiveActionLimiter, sanitizeTripPayload, async (req, res) => {
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

  return next(err);
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
