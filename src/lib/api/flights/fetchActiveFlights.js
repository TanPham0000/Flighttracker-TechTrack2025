// -------------------------------------------------
// fetchActiveFlights.js
// Haalt actieve vluchten op via AirLabs
// Verrijkt met airline namen (batch), klaargemaakt
// voor normalizer in utils.
// -------------------------------------------------

import { VITE_AIRLABS_API_KEY } from "$lib/config/apiKey.js";
import fetchAirlinesBatch from "./fetchAirlineInfo.js"; // <<< jouw batch versie

export default async function fetchActiveFlights(limit = 10) {
  const url = `https://airlabs.co/api/v9/flights?api_key=${VITE_AIRLABS_API_KEY}&limit=${limit}`; //

  try {
    const res = await fetch(url);
    if (!res.ok) throw new Error("Airlabs HTTP fout " + res.status); // netwerkfout

    const json = await res.json();

    // API-limit reached of andere fout → error bubbelt door
    if (json.error) {
      throw new Error(json.error.message);
    }

    const flights = json.response || [];

    // -------------------------------------------
    // Stap 1: alle ICAO airline codes verzamelen
    // -------------------------------------------
    const icaoList = flights.map((f) => f.airline_icao);

    // -------------------------------------------
    // Stap 2: 1 batch call om ALLE airlines op te halen
    // -------------------------------------------
    const airlineMap = await fetchAirlinesBatch(icaoList);

    // -------------------------------------------
    // Stap 3: merge airline naam + logo in elke vlucht
    // -------------------------------------------
    const mergedFlights = flights.map((f) => {
      const info = airlineMap[f.airline_icao] || null;

      return {
        ...f,
        airline_name: info?.name || f.airline_iata || f.airline_icao || "Onbekend",
        airline_logo: info?.logo || null
      };
    });

    return mergedFlights;

  } catch (err) {
    // Belangrijk: error laten doorbubbelen zodat de UI “error state” toont
    console.error("fetchActiveFlights error:", err);
    throw err;
  }
}
