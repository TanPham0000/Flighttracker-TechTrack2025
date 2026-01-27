// -------------------------------------------------
// fetchActiveFlights.js
// Haalt actieve vluchten op via ADSB.lol API
// Verrijkt met airline namen (batch), klaargemaakt
// voor normalizer in utils.
// -------------------------------------------------


import { getJson } from "$lib/api/httpClient.js";

/**
 * Haalt actieve vluchten op van ADSB.lol API
 * @returns {Promise<{ac: any[]}>}
 */
export default async function fetchActiveFlights() {
  const url = `https://api.adsb.lol/v2/all`;
  const data = await getJson(url);
  return data;
}
