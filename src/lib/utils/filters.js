import { writable, derived } from "svelte/store";
import { flightsStore } from "./flights.js";

// --------- FILTER STORES ---------
export const airlineFilter = writable(null); // "KLM", "RYR", "DLH"
export const routeFilter = writable({ from: null, to: null });

// --------- PAGINATION STORE ---------
export const pagination = writable({
  page: 1,
  perPage: 50, // aantal per pagina
});

// --------- FILTERED FLIGHTS ---------
export const filteredFlightsStore = derived(
  [flightsStore, airlineFilter, routeFilter, pagination],
  ([$flightsStore, $airlineFilter, $routeFilter, $pagination]) => {
    let flights = $flightsStore;

    // Filter: Airline
    if ($airlineFilter) {
      flights = flights.filter(
        (f) =>
          f.airline_iata === $airlineFilter ||
          f.airline_icao === $airlineFilter
      );
    }

    // Filter: Route
    if ($routeFilter.from) {
      flights = flights.filter((f) => f.dep_iata === $routeFilter.from);
    }

    if ($routeFilter.to) {
      flights = flights.filter((f) => f.arr_iata === $routeFilter.to);
    }

    // Pagination
    const start = ($pagination.page - 1) * $pagination.perPage;
    const end = start + $pagination.perPage;

    return {
      total: flights.length,
      page: $pagination.page,
      perPage: $pagination.perPage,
      results: flights.slice(start, end),
    };
  }
);
