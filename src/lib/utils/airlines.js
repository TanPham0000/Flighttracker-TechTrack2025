/**
 * airlines.js
 * -----------
 * Helpers en store om airline-namen overal consistent te tonen.
 *
 * Idee:
 *  - AirLabs /flights endpoint geeft alleen codes (airline_iata / airline_icao)
 *  - Bijv. "OD" of "IGO"
 *  - Via /airlines endpoint kunnen we de volledige naam ophalen ("Batik Air")
 *
 * We cachen die namen in:
 *  - een Svelte store (airlineNameMap)
 *  - localStorage (airline_cache)
 */

import { writable, get } from "svelte/store";
import { getStored, setStored } from "./storage.js";

/**
 * Initialiseer map vanuit localStorage.
 * Structuur: { "KLM": "KLM Royal Dutch Airlines", "OD": "Batik Air", ... }
 */
const initialMap = getStored("airline_cache", {});

/**
 * airlineNameMap
 * ---------------
 * Reactieve map met airline codes -> namen.
 */
export const airlineNameMap = writable(initialMap);

/**
 * normalizeAirline
 * ----------------
 * Bepaalt op een veilige manier welke naam we tonen bij een vlucht.
 *
 * Volgorde:
 *  1. Als flight.airline_name bestaat → gebruik die
 *  2. Anders → kijk in airlineNameMap
 *  3. Anders → toon de code (IATA/ICAO) zelf
 *  4. Als zelfs dat niet kan → "Onbekend"
 *
 * @param {object} flight - Vluchtobject uit AirLabs /flights
 * @returns {string}
 */
export function normalizeAirline(flight) {
  if (!flight) return "Onbekend";

  // 1. Als de vlucht zelf al een naam bevat (verrijkte data)
  if (flight.airline_name) {
    return flight.airline_name;
  }

  // 2. Zoek een code waarop we kunnen matchen
  const code = flight.airline_iata || flight.airline_icao;
  if (!code) return "Onbekend";

  // 3. Probeer de store / cache
  const map = get(airlineNameMap);
  if (map && map[code]) {
    return map[code];
  }

  // 4. Fallback: toon de code zelf
  return code;
}

/**
 * saveAirlineNameToCache
 * ----------------------
 * Sla een gevonden airline naam op onder een code.
 * Dit wordt gebruikt vanuit FlightDetails zodra /airlines data bekend is.
 *
 * @param {string} code - Airline IATA/ICAO code
 * @param {string} fullName - Volledige airline naam
 */
export function saveAirlineNameToCache(code, fullName) {
  if (!code || !fullName) return;

  const current = get(airlineNameMap);
  const updated = { ...current, [code]: fullName };

  airlineNameMap.set(updated);
  setStored("airline_cache", updated);
}
