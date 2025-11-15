/**
 * Combineert vluchtdata (AviationStack) met vliegtuigfoto’s (Planespotters).
 * Zo ontstaat er één verrijkte dataset voor de UI.
 */

import { fetchPlaneImageByHex } from "$lib/api/aircraft/fetchPlaneImages.js";

export async function mergeFlightDataWithImages(flights) {
  const enrichedFlights = await Promise.all(
    flights.map(async (flight) => {
      const hexCode =
        flight.aircraft?.icao24 ||
        flight.icao24 ||
        flight.hex ||
        null;

      const imageUrl = await fetchPlaneImageByHex(hexCode);

      return { ...flight, imageUrl };
    })
  );

  return enrichedFlights;
} 