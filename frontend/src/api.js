import fallbackTrips from "./fallbackTrips";

const normalizeApiBase = (value) => value?.trim().replace(/\/+$/, "") || "";

const slugifyTripValue = (value) =>
  value
    ?.toString()
    .trim()
    .toLowerCase()
    .replace(/\s+x\s+/g, "-")
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "") || "";

const API = normalizeApiBase(
  import.meta.env.VITE_API_URL ||
    (import.meta.env.DEV
      ? "http://localhost:5000"
      : typeof window !== "undefined"
        ? window.location.origin
        : "")
);

const normalizeTrip = (trip, index) => ({
  ...trip,
  _id: String(trip?._id || trip?.id || `trip-${index + 1}`),
  bestFor: Array.isArray(trip?.bestFor) ? trip.bestFor : [],
  highlights: Array.isArray(trip?.highlights) ? trip.highlights : [],
  itinerary: Array.isArray(trip?.itinerary) ? trip.itinerary : [],
  inclusions: Array.isArray(trip?.inclusions) ? trip.inclusions : [],
  exclusions: Array.isArray(trip?.exclusions) ? trip.exclusions : [],
  gallery: Array.isArray(trip?.gallery) ? trip.gallery : [],
  faqs: Array.isArray(trip?.faqs) ? trip.faqs : [],
  batchDates: Array.isArray(trip?.batchDates) ? trip.batchDates : [],
  packages: Array.isArray(trip?.packages) ? trip.packages : [],
});

const normalizeTrips = (trips) =>
  (Array.isArray(trips) ? trips : []).map((trip, index) => normalizeTrip(trip, index));

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

const readJson = async (path) => {
  const response = await fetch(`${API}${path}`);

  if (!response.ok) {
    const error = new Error(`Request failed with status ${response.status}`);
    error.status = response.status;
    throw error;
  }

  return response.json();
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
