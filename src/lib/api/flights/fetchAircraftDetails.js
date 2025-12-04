// -----------------------------------------
// fetchAircraftDetails.js
// Wordt alleen gebruikt bij één geselecteerde vlucht
// -----------------------------------------

import { VITE_AIRLABS_API_KEY } from "$lib/config/apiKey.js";
import { getJson } from "$lib/api/httpClient.js";
import fetchPlaneImages from "$lib/api/aircraft/fetchPlaneImages.js";

/**
 * Haalt detailinformatie op over een specifiek toestel op basis van registratienummer.
 * Verrijkt, indien mogelijk, met een foto uit de Planespotters API.
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

  const base = json?.response?.[0] || null;
  if (!base) return null;

  // Probeer een foto op te halen via Planespotters op basis van registratie
  try {
    const photos = await fetchPlaneImages(reg);
    const best = Array.isArray(photos) ? photos[0] : null;

    const imageUrl =
      best?.thumbnail_large?.src ||
      best?.thumbnail?.src ||
      best?.link ||
      null;

    return {
      ...base,
      image: imageUrl || base.image || null,
    };
  } catch (err) {
    console.error("Fout bij ophalen vliegtuigfoto (Planespotters):", err);
    // Val terug op alleen de AirLabs data
    return base;
  }
}
