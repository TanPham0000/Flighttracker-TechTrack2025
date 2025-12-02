// -------------------------------------------------
// fetchActiveFlights.js
// Haalt actieve vluchten op via AirLabs
// Verrijkt met airline namen (batch), klaargemaakt
// voor normalizer in utils.
// -------------------------------------------------

import { VITE_AIRLABS_API_KEY } from "$lib/config/apiKey.js";


// Example: fetch flights data from AirLabs
const apiKey = VITE_AIRLABS_API_KEY;
const url = `https://airlabs.co/api/v9/flights?api_key=${encodeURIComponent(apiKey)}`;
export async function fetchActiveFlights() {
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
fetchActiveFlights();
