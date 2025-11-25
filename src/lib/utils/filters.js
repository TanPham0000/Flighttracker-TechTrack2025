/**
 * filters.js
 * ----------
 * Bevat Svelte stores voor filters en paginatie,
 * plus een derived store voor gefilterde resultaten.
 */

import { writable, derived } from "svelte/store";
import { flightsStore } from "./flights.js";

/**
 * airlineFilter
 * --------------
 * Bevat een airline-code (IATA of ICAO) of null voor "geen filter".
 */
export const airlineFilter = writable(null);

/**
 * routeFilter
 * -----------
 * Combofilter voor vertrek (from) en bestemming (to).
 * Beide velden zijn IATA-codes (bijv. "AMS", "KUL").
 */
export const routeFilter = writable({
  from: null,
  to: null
});

/**
 * pagination
 * ----------
 * Houdt bij op welke pagina we zitten en hoeveel vluchten we per pagina tonen.
 */
export const pagination = writable({
  page: 1,
  perPage: 50
});

/**
 * filteredFlightsStore
 * --------------------
 * Derived store die flightsStore combineert met filters + paginatie.
 * Output structuur:
 * {
 *   total: <totaal aantal vluchten na filters>,
 *   page: <huidige pagina>,
 *   perPage: <aantal per pagina>,
 *   results: <array met vluchten voor deze pagina>
 * }
 */
export const filteredFlightsStore = derived(
  [flightsStore, airlineFilter, routeFilter, pagination],
  ([$flightsStore, $airlineFilter, $routeFilter, $pagination]) => {
    let list = $flightsStore;

    // Filter op airline-code (iata of icao)
    if ($airlineFilter) {
      list = list.filter(
        (flight) =>
          flight.airline_iata === $airlineFilter ||
          flight.airline_icao === $airlineFilter
      );
    }

    // Filter op vertrek
    if ($routeFilter.from) {
      list = list.filter((flight) => flight.dep_iata === $routeFilter.from);
    }

    // Filter op bestemming
    if ($routeFilter.to) {
      list = list.filter((flight) => flight.arr_iata === $routeFilter.to);
    }

    const total = list.length;

    // Bereken slice voor paginatie
    const startIndex = ($pagination.page - 1) * $pagination.perPage;
    const endIndex = startIndex + $pagination.perPage;
    const results = list.slice(startIndex, endIndex);

    return {
      total,
      page: $pagination.page,
      perPage: $pagination.perPage,
      results
    };
  }
);
