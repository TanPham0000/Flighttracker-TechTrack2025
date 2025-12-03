// -------------------------------------------------
// fetchActiveFlights.js
// Haalt actieve vluchten op via AirLabs
// Verrijkt met airline namen (batch), klaargemaakt
// voor normalizer in utils.
// -------------------------------------------------

import { VITE_AIRLABS_API_KEY } from "$lib/config/apiKey.js";
import { getJson } from "$lib/api/httpClient.js";

/**
 * Haalt actieve vluchten op van AirLabs API
 * @returns {Promise<{response: any[]}>}
 */
export default async function fetchActiveFlights() {
  const apiKey = VITE_AIRLABS_API_KEY;
  if (!apiKey) {
    throw new Error("VITE_AIRLABS_API_KEY is not set");
  }
  
  const url = `https://airlabs.co/api/v9/flights?api_key=${encodeURIComponent(apiKey)}`;
  const data = await getJson(url);
  return data;
}
