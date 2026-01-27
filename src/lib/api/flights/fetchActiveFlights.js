// -------------------------------------------------
// fetchActiveFlights.js
// Haalt actieve vluchten op via ADSB.lol API
// Verrijkt met airline namen (batch), klaargemaakt
// voor normalizer in utils.
// -------------------------------------------------


import { getJson } from "$lib/api/httpClient.js";
import { normalizeFlight } from "$lib/utils/normalizer.js";

/**
 * Haalt actieve vluchten op van ADSB.lol API
 * @returns {Promise<{ac: any[]}>}
 */
export default async function fetchActiveFlights(options = {}) {
  const {
    url = "https://api.adsb.lol/v2/ladd",
    transform
  } = options;
  // Haal de ruwe data op van de API of interne proxy
  const data = await getJson(url);

  // ADSB.lol levert meestal een array in data.ac
  const rawFlights = data.ac || [];

  // Optioneel verrijken (bijv. server-side database info)
  const enrichedFlights = typeof transform === "function"
    ? rawFlights.map(transform)
    : rawFlights;

  // Gebruik genormaliseerde data als de API die al meestuurt
  const normalizedFlights = Array.isArray(data.normalized)
    ? data.normalized
    : enrichedFlights
        .map(normalizeFlight)
        .filter((flight) => flight !== null);

  // Geef zowel ruwe als genormaliseerde data terug voor debug/gebruik
  return {
    raw: enrichedFlights,
    normalized: normalizedFlights,
    total: data.total,
    msg: data.msg
  };
}

// Lichtgewicht helper voor de UI zodat +page.svelte schoon blijft
export async function fetchActiveFlightsForUi(options = {}) {
  const result = await fetchActiveFlights(options);

  return {
    flights: result.normalized || [],
    meta: {
      total: result.total || 0,
      rawCount: (result.raw || []).length,
      normalizedCount: (result.normalized || []).length,
      msg: result.msg || null
    }
  };
}
