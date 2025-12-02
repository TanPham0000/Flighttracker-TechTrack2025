// -----------------------------------------
// fetchPlaneImages.js
// Haal foto's van een vliegtuig op via registratienummer
// (gebruikt Planespotters API als voorbeeld).
// -----------------------------------------

import { getJson } from "$lib/api/httpClient.js";

/**
 * Haalt een lijst met vliegtuigfoto's op.
 * Zie: https://api.planespotters.net/pub/photos/reg/{REG}
 *
 * @param {string} reg - Registratie, bijv. "PH-BVA"
 * @returns {Promise<any[]>}
 */
export default async function fetchPlaneImages(reg) {
  if (!reg) return [];

  const url = `https://api.planespotters.net/pub/photos/reg/${encodeURIComponent(reg)}`;

  const json = await getJson(url);

  return json?.photos || [];
}


