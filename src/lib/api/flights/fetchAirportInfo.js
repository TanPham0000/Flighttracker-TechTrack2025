import { VITE_AIRLABS_API_KEY } from "$lib/config/apiKey.js";
export default async function fetchAirportInfo(iata) {
  if (!iata) return null;

  const url = `https://airlabs.co/api/v9/airports?api_key=${VITE_AIRLABS_API_KEY}&iata_code=${iata}`;
  try {
    const res = await fetch(url);
    if (!res.ok) return null;

    const json = await res.json();

    if (!json.response || !json.response.length) return null;

    return json.response[0];
  } catch (err) {
    console.error("fetchAirportInfo error:", err);
    return null;
  }
}
