// -------------------------------------------------
// fetchActiveFlights.js
// Haalt actieve vluchten op via AirLabs
// Verrijkt met airline namen (batch), klaargemaakt
// voor normalizer in utils.
// -------------------------------------------------

import { VITE_AIRLABS_API_KEY } from "$lib/config/apiKey.js";
import fetchAirlinesBatch from "./fetchAirlineInfo.js"; // hergebruikt in fetchAircraftDetails.js
import { getJson } from "$lib/api/httpClient.js";




// Example: fetch flights data from AirLabs
const apiKey = VITE_AIRLABS_API_KEY;
const url = `https://airlabs.co/api/v9/flights?api_key=${encodeURIComponent(apiKey)}`;

async function fetchFlights() {
  try {
    const response = await fetch(url);
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }
    const data = await response.json();
    console.log("Flights data:", data);
    // do something with data, e.g. render in UI
  } catch (error) {
    console.error("Error fetching flights:", error);
  }
}

// Run the function
fetchFlights();

/**
 * Haalt actieve vluchten op en verrijkt ze met airline-informatie.
 * Typen zijn bewust losjes gehouden omdat we in JS werken met externe API-data.
 */
// eslint-disable-next-line @typescript-eslint/no-explicit-any
// export default async function fetchActiveFlights(limit = 100) {
//   const url = `https://airlabs.co/api/v9/flights?api_key=${VITE_AIRLABS_API_KEY}&limit=${limit}`;

//   try {
//     const json = await getJson(url);

//     // API-limit reached of andere fout → error bubbelt door
//     if (json?.error) {
//       throw new Error(json.error.message || "Airlabs API error");
//     }

//     /** @type {any[]} */
//     const flights = json.response || [];
//     // -------------------------------------------
//     // Stap 1: alle ICAO airline codes verzamelen
//     // -------------------------------------------
//     const icaoList = flights.map((f) => f.airline_icao);
//     // -------------------------------------------
//     // Stap 2: 1 batch call om ALLE airlines op te halen
//     // -------------------------------------------
//     const airlineMap = await fetchAirlinesBatch(icaoList);
//     // -------------------------------------------
//     // Stap 3: merge airline naam
//     // -------------------------------------------
//     const mergedFlights = flights.map((/** @type {any} */ f) => {
//       /** @type {{ [key: string]: any }} */
//       const map = airlineMap;
//       const info = map[f.airline_icao] || null;

//       return {
//         ...f,
//         airline_name: info?.name || f.airline_iata || f.airline_icao || "Onbekend",
//         airline_logo: info?.logo || null
//       };
//     });

//     return mergedFlights;

//   } catch (err) {
//     // Belangrijk: error laten doorbubbelen zodat de UI “error state” toont
//     console.error("fetchActiveFlights error:", err);
//     throw err;
//   }
// }
