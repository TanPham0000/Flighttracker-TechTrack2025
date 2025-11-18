// src/lib/utils/flights.js
import { writable } from "svelte/store";
/**
 * flightsStore
 * Bevat de volledige lijst met vluchten die we geladen hebben.
 * @type {import('svelte/store').Writable<any[]>}
 */
export const flightsStore = writable(/** @type {any[]} */ ([]));

/**
 * selectedFlightStore
 * Bevat de ene vlucht die de gebruiker heeft geselecteerd.
 * @type {import('svelte/store').Writable<any|null>}
 */
export const selectedFlightStore = writable(null);