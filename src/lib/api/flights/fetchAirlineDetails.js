// -----------------------------------------
// fetchAirlineDetails.js
// Haalt gedetailleerde airline informatie op via ICAO of IATA code
// -----------------------------------------

import { VITE_AIRLABS_API_KEY } from "$lib/config/apiKey.js";
import { getJson } from "$lib/api/httpClient.js";

/**
 * Haalt gedetailleerde informatie op over een airline via ICAO of IATA code.
 *
 * @param {string} icao - ICAO code (bijv. "KLM")
 * @param {string} iata - IATA code (bijv. "KL")
 * @returns {Promise<any | null>}
 */
export default async function fetchAirlineDetails(icao, iata) {
  if (!icao && !iata) return null;

  let url;
  if (icao) {
    url = `https://airlabs.co/api/v9/airlines?api_key=${VITE_AIRLABS_API_KEY}&icao_code=${encodeURIComponent(icao)}`;
  } else if (iata) {
    url = `https://airlabs.co/api/v9/airlines?api_key=${VITE_AIRLABS_API_KEY}&iata_code=${encodeURIComponent(iata)}`;
  }

  const json = await getJson(url);

  if (json?.error) {
    throw new Error(json.error.message || "Airlabs airline API error");
  }

  return json?.response?.[0] || null;
}

