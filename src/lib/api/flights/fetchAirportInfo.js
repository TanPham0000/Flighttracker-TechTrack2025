// -----------------------------------------
// fetchAirportInfo.js (AviationAPI)
// Haalt gedetailleerde info op over een luchthaven via IATA code
// -----------------------------------------

import { getJson } from "$lib/api/httpClient.js";

/**
 * Haalt informatie op over een airport via IATA-code (bijv. "AMS").
 *
 * @param {string} iata
 * @returns {Promise<any | null>}
 */
export default async function fetchAirportInfo(iata) {
  if (!iata) return null;

  const url = `https://api.aviationapi.com/v1/airports?apt=${encodeURIComponent(iata)}`;

  const json = await getJson(url);

  return json?.[iata] || null;
}
