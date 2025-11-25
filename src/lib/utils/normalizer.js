// -------------------------------------------------
// normalizeFlight.js
// Maakt AirLabs flight data consistent en bruikbaar
// voor FlightSelector, FlightCard, FlightDetails
// -------------------------------------------------

export function normalizeFlight(raw) {
  if (!raw) return null;

  return {
    // Algemene vlucht info
    id: raw.flight_iata || raw.flight_icao || raw.reg_number,
    flight_iata: raw.flight_iata,
    flight_icao: raw.flight_icao,

    // Airline
    airline_name: raw.airline_name || "Onbekend",
    airline_logo: raw.airline_logo || null,
    airline_iata: raw.airline_iata,
    airline_icao: raw.airline_icao,

    // Route
    dep_iata: raw.dep_iata || null,
    dep_icao: raw.dep_icao || null,
    arr_iata: raw.arr_iata || null,
    arr_icao: raw.arr_icao || null,

    // Aircraft
    reg_number: raw.reg_number || "—",
    aircraft_iata: raw.aircraft_iata,
    aircraft_icao: raw.aircraft_icao,

    // Live data
    status: raw.status || "unknown",
    lat: raw.lat,
    lng: raw.lng,
    alt: raw.alt,
    speed: raw.speed,
    dir: raw.dir,
    updated: raw.updated
  };
}
