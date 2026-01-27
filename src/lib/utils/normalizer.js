// -------------------------------------------------
// normalizeFlight.js
// Maakt ADSB.lol flight data consistent en bruikbaar
// voor FlightSelector, FlightCard, FlightDetails
// -------------------------------------------------

export function normalizeFlight(raw) {
  if (!raw) return null;

  // Skip flights without coordinates (can't display on map)
  if (typeof raw.lat !== 'number' || typeof raw.lon !== 'number' || 
      isNaN(raw.lat) || isNaN(raw.lon)) {
    return null;
  }

  // Handle altitude - can be number or "ground" string
  let altitude = null;
  if (typeof raw.alt_baro === 'number') {
    altitude = raw.alt_baro;
  } else if (raw.alt_baro === 'ground') {
    altitude = 0;
  }

  // Clean flight number (remove extra spaces)
  const flightNumber = raw.flight ? raw.flight.trim() : null;

  return {
    // Algemene vlucht info
    id: raw.hex,
    flight_iata: flightNumber || raw.hex,
    flight_icao: flightNumber || raw.hex,

    // Airline (not available in ADSB.lol)
    airline_name: raw.airline_name || "Unknown",
    airline_logo: raw.airline_logo || raw.logo || null,
    airline_iata: raw.airline_iata || null,
    airline_icao: raw.airline_icao || null,

    // Route (not available)
    dep_iata: null,
    dep_icao: null,
    arr_iata: null,
    arr_icao: null,

    // Aircraft
    reg_number: raw.r || raw.hex,
    aircraft_iata: raw.aircraft_iata || raw.t,
    aircraft_icao: raw.aircraft_icao || raw.t,
    aircraft_image: raw.aircraft_image || raw.image || null,

    // Live data
    status: altitude === 0 ? "ground" : "en-route",
    lat: raw.lat,
    lng: raw.lon,
    alt: altitude,
    speed: raw.gs || 0,
    dir: raw.track || 0,
    updated: raw.seen ? Date.now() / 1000 - raw.seen : Date.now() / 1000
  };
}
