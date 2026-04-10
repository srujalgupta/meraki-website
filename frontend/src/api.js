const API_URL = "http://localhost:5000";

export const getTrips = async () => {
  const res = await fetch(`${API_URL}/trips`);
  return res.json();
};
const API = "http://localhost:5000";

export default API;