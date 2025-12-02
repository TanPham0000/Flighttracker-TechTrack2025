// -----------------------------------------
// fetchAircraftDetails.js
// Wordt alleen gebruikt bij één geselecteerde vlucht
// -----------------------------------------

import { VITE_AIRLABS_API_KEY } from "$lib/config/apiKey.js";
import { getJson } from "$lib/api/httpClient.js";

/**
 * Haalt detailinformatie op over een specifiek toestel op basis van registratienummer.
 *
 * @param {string} reg - Registratienummer, bijv. "PH-BVA"
 * @returns {Promise<any | null>}
 */
export default async function fetchAircraftDetails(reg) {
  if (!reg) return null;

  const url = `https://airlabs.co/api/v9/aircraft?api_key=${VITE_AIRLABS_API_KEY}&reg_number=${encodeURIComponent(
    reg
  )}`;

  const json = await getJson(url);

  if (json?.error) {
    throw new Error(json.error.message || "Airlabs aircraft API error");
  }

  return json?.response?.[0] || null;
}
