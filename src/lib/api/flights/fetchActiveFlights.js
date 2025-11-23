import { VITE_AIRLABS_API_KEY } from "$lib/config/apiKey.js";

/**
 * fetchActiveFlights()
 * ---------------------
 * Haalt de lijst met actieve / recente vluchten op via AirLabs.
 * Gebruik: /flights endpoint
 */
export default async function fetchActiveFlights(limit = 100) {
  const url = `https://airlabs.co/api/v9/flights?api_key=${VITE_AIRLABS_API_KEY}&limit=${limit}`;

  try {
    const res = await fetch(url);
    if (!res.ok) throw new Error("Airlabs HTTP fout " + res.status);

    const json = await res.json();
    if (!json.response) return [];

    return json.response.map((f) => ({
      flight_icao: f.flight_icao,
      flight_iata: f.flight_iata,
      reg_number: f.reg_number,

      airline_icao: f.airline_icao,
      airline_iata: f.airline_iata,

      dep_iata: f.dep_iata,
      dep_icao: f.dep_icao,
      arr_iata: f.arr_iata,
      arr_icao: f.arr_icao,

      status: f.status,

      lat: f.lat,
      lng: f.lng,
      alt: f.alt,
      speed: f.speed,
      dir: f.dir,
      updated: f.updated,

      aircraft_icao: f.aircraft_icao,
      aircraft_iata: f.aircraft_iata,
    }));
  } catch (err) {
    console.error("fetchActiveFlights error:", err);
    return [];
  }
}
