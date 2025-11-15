// src/lib/api/fetchFlights.js

import { apiKey } from "$lib/config/apiKey.js";

/**
 * fetchFlights
  * Haalt vluchtdata op van de AviationStack API.
 * We retourneren direct de "data" array met vluchten.
 *
 * @param {number} limit - maximaal aantal vluchten om op te halen
 * @returns {Promise<any[]>} - array met vluchtobjecten uit AviationStack
 */
export async function fetchFlights(limit = 10000) {
  const url = `https://api.aviationstack.com/v1/flights?access_key=${apiKey.aviationstack}&limit=${limit}`;

  try {
    const response = await fetch(url);

    // Basis HTTP check
    if (!response.ok) {
      console.error("❌ HTTP fout bij AviationStack:", response.status);
      return [];
    }

    const json = await response.json();

    // Check of we een geldige data array terugkrijgen
    if (!json || !Array.isArray(json.data)) {
      console.warn("⚠️ Onverwachte response van AviationStack:", json);
      return [];
    }
    return json.data;
  } catch (error) {
    console.error("❌ Kon vluchtdata niet ophalen:", error);
    return [];
  }
  console.log(fetchFlights);

}
export default fetchFlights;
