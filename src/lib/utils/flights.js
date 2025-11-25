/**
 * flights.js
 * ----------
 * Centrale Svelte stores voor vluchtdata.
 */

import { writable } from "svelte/store";

/**
 * flightsStore
 * -------------
 * Bevat de volledige lijst vluchten die we van AirLabs hebben gekregen.
 */
export const flightsStore = writable([]);

/**
 * selectedFlightStore
 * --------------------
 * Bevat precies één vlucht: de vlucht die de gebruiker geselecteerd heeft
 * via de dropdown of via een klik op een kaart.
 */
export const selectedFlightStore = writable(null);
