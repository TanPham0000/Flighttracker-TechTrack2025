// -------------------------------------------------
// normalizeFlight.js
// Maakt ADSB.lol flight data consistent en bruikbaar
// voor FlightSelector, FlightCard, FlightDetails
// -------------------------------------------------

export function normalizeFlight(raw) {
  if (!raw) return null;

  return {
    // Algemene vlucht info
    id: raw.hex,
    flight_iata: raw.flight || raw.hex,
    flight_icao: raw.flight || raw.hex,

    // Airline (not available in ADSB.lol)
    airline_name: "Unknown",
    airline_logo: null,
    airline_iata: null,
    airline_icao: null,

    // Route (not available)
    dep_iata: null,
    dep_icao: null,
    arr_iata: null,
    arr_icao: null,

    // Aircraft
    reg_number: raw.r || raw.hex,
    aircraft_iata: raw.t,
    aircraft_icao: raw.t,

    // Live data
    status: "en-route", // assume
    lat: raw.lat,
    lng: raw.lon,
    alt: raw.alt_baro,
    speed: raw.gs,
    dir: raw.track,
    updated: Date.now() / 1000 - raw.seen // approximate
  };
}
