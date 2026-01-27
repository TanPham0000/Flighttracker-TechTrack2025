// -----------------------------------------
// fetchAircraftDetails.js
// Wordt alleen gebruikt bij één geselecteerde vlucht
// Note: ADSB.lol API doesn't provide detailed aircraft info,
// so this function now returns null gracefully
// -----------------------------------------

/**
 * Haalt detailinformatie op over een specifiek toestel op basis van registratienummer.
 * 
 * Note: The new ADSB.lol API doesn't provide detailed aircraft information.
 * This function returns null to gracefully handle the missing feature.
 *
 * @param {string} reg - Registratienummer, bijv. "PH-BVA"
 * @returns {Promise<any | null>}
 */
export default async function fetchAircraftDetails(reg) {
  if (!reg) return null;

  // ADSB.lol API doesn't provide detailed aircraft information
  // Return null gracefully - the UI will handle this
  return null;
}
