// -------------------------------------------------
// fetchAirlineInfo.js
// Batch call: haal alle airline ICAO codes in 1 request
// Note: ADSB.lol API doesn't provide airline information,
// so this function now returns an empty object gracefully
// -------------------------------------------------

/**
 * Haal airline-informatie op voor een lijst met ICAO-codes in één batch-call.
 * 
 * Note: The new ADSB.lol API doesn't provide airline information.
 * This function returns an empty object to gracefully handle the missing feature.
 *
 * @param {string[]} icaoList
 * @returns {Promise<Record<string, { name: string; logo: string | null }>>}
 */
export default async function fetchAirlinesBatch(icaoList) {
  if (!icaoList || icaoList.length === 0) return {};

  // ADSB.lol API doesn't provide airline information
  // Return empty object gracefully - the UI will handle this
  return {};
}