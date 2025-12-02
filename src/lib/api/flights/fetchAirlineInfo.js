// -------------------------------------------------
// fetchAirlineInfo.js
// Batch call: haal alle airline ICAO codes in 1 request
// -------------------------------------------------

import { VITE_AIRLABS_API_KEY } from "$lib/config/apiKey.js";
import { getJson } from "$lib/api/httpClient.js";

/**
 * Haal airline-informatie op voor een lijst met ICAO-codes in één batch-call.
 *
 * @param {string[]} icaoList
 * @returns {Promise<Record<string, { name: string; logo: string | null }>>}
 */
export default async function fetchAirlinesBatch(icaoList) {
  if (!icaoList || icaoList.length === 0) return {};

  // Unieke ICAO codes:
  const unique = [...new Set(icaoList.filter(Boolean))];

  // AirLabs supports: &icao_code=KLM&icao_code=UAE...
  const query = "&icao_code=" + unique.join("&icao_code=");

  const url = `https://airlabs.co/api/v9/airlines?api_key=${VITE_AIRLABS_API_KEY}${query}`;

  const json = await getJson(url);

  if (!json?.response) return {};

  // Bouw een map zodat lookup snel is
  const map = {};

  json.response.forEach(a => {
    map[a.icao_code] = {
      name: a.name,
      logo: a.logo_url
    };
  });

  return map;
}