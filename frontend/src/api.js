import fallbackTrips from "./fallbackTrips";

const normalizeApiBase = (value) => value?.trim().replace(/\/+$/, "") || "";
const REQUEST_TIMEOUT_MS = 12000;
const LOCALHOSTS = new Set(["localhost", "127.0.0.1", "::1", "[::1]"]);

const isPrivateHostname = (hostname = "") => {
  const normalizedHostname = hostname.toLowerCase();

  if (LOCALHOSTS.has(normalizedHostname)) {
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

const getDefaultApiBase = () => {
  if (typeof window === "undefined") {
    return "";
  }

  const { hostname } = window.location;
  const resolvedHostname = hostname || "localhost";

  // Local dev and LAN phone testing should hit the local backend directly.
  if (import.meta.env.DEV || isPrivateHostname(resolvedHostname)) {
    return `http://${resolvedHostname}:5000`;
  }

  // Hosted frontend deployments should use the colocated proxy route by default.
  return "/api";
};

const slugifyTripValue = (value) =>
  value
    ?.toString()
    .trim()
    .toLowerCase()
    .replace(/\s+x\s+/g, "-")
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "") || "";

const API = normalizeApiBase(
  import.meta.env.VITE_API_URL || getDefaultApiBase()
);

const buildApiUrl = (path) => {
  const normalizedPath = path.startsWith("/") ? path : `/${path}`;

  if (!API) {
    return normalizedPath;
  }

  if (API.startsWith("/")) {
    return `${API}${normalizedPath}`;
  }

  return new URL(normalizedPath, `${API}/`).toString();
};

const normalizeTrip = (trip, index) => ({
  ...trip,
  _id: String(trip?._id || trip?.id || `trip-${index + 1}`),
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

const normalizeTrips = (trips) =>
  (Array.isArray(trips) ? trips : []).map((trip, index) => normalizeTrip(trip, index));

const normalizeReview = (review, index) => ({
  id: String(review?.id || `review-${index + 1}`),
  name: review?.name?.trim() || "Google traveler",
  place: review?.place?.trim() || "Google Reviews",
  tripName: review?.tripName?.trim() || "Reviewed on Google",
  month: review?.month?.trim() || "Recently",
  rating: Math.max(1, Math.min(5, Math.round(Number(review?.rating) || 5))),
  image: review?.image?.trim() || "/logo.png",
  text: review?.text?.trim() || "Shared a review on Google.",
  authorUrl: review?.authorUrl?.trim() || "",
  reviewUrl: review?.reviewUrl?.trim() || "",
});

const normalizeReviews = (reviews) =>
  (Array.isArray(reviews) ? reviews : []).map((review, index) => normalizeReview(review, index));

const matchesTripId = (trip, tripId) => {
  const requestedId = slugifyTripValue(tripId);
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
};

const readJson = async (path, options = {}) => {
  const controller = new AbortController();
  const timeoutId = setTimeout(() => controller.abort(), REQUEST_TIMEOUT_MS);
  let response;

  try {
    response = await fetch(buildApiUrl(path), {
      ...options,
      signal: controller.signal,
    });
  } finally {
    clearTimeout(timeoutId);
  }

  if (!response.ok) {
    const error = new Error(`Request failed with status ${response.status}`);
    error.status = response.status;
    throw error;
  }

  return response.json();
};

export const resolveApiAssetUrl = (assetPath) => {
  if (!assetPath) return "#";

  const normalizedAssetPath = assetPath.replace(/^\/+/, "");
  return buildApiUrl(normalizedAssetPath);
};

export const loadTrips = async () => {
  try {
    const trips = normalizeTrips(await readJson("/trips"));

    if (!trips.length) {
      throw new Error("No trips returned from API");
    }

    return {
      trips,
      errorMessage: "",
      usingFallback: false,
    };
  } catch (error) {
    console.error("Unable to load live trips. Falling back to bundled data.", error);

    return {
      trips: normalizeTrips(fallbackTrips),
      errorMessage: "Live trip data is unavailable right now. Showing bundled trip details instead.",
      usingFallback: true,
    };
  }
};

export const loadBusinessReviews = async () => {
  try {
    const payload = await readJson("/reviews", {
      cache: "no-store",
      headers: {
        "Cache-Control": "no-cache",
        Pragma: "no-cache",
      },
    });
    const reviews = normalizeReviews(payload?.reviews);

    if (!reviews.length) {
      throw new Error("No reviews returned from API");
    }

    return {
      reviews,
      errorMessage: "",
      usingFallback: false,
    };
  } catch (error) {
    console.error("Unable to load Google reviews. Keeping bundled review cards.", error);

    return {
      reviews: [],
      errorMessage: "Google reviews are unavailable right now.",
      usingFallback: true,
    };
  }
};

export const loadTripById = async (tripId) => {
  try {
    const trip = normalizeTrip(await readJson(`/trips/${encodeURIComponent(tripId)}`), 0);

    return {
      trip,
      errorMessage: "",
      usingFallback: false,
    };
  } catch (error) {
    const { trips, errorMessage } = await loadTrips();
    const bundledFallbackTrips = normalizeTrips(fallbackTrips);
    const fallbackTrip =
      trips.find((trip) => matchesTripId(trip, tripId)) ||
      bundledFallbackTrips.find((trip) => matchesTripId(trip, tripId)) ||
      null;

    return {
      trip: fallbackTrip,
      errorMessage: fallbackTrip
        ? error.status === 404
          ? ""
          : errorMessage
        : error.status === 404
          ? "Trip not found."
          : errorMessage,
      usingFallback: true,
    };
  }
};

export default API;
