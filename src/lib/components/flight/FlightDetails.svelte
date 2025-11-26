<script>
  /**
   * FlightDetails.svelte — HERWERKTE VERSIE
   * --------------------------------------------------------
   * Dit component toont volledige details van de geselecteerde vlucht.
   *
   * De vlucht is ALTIJD al genormaliseerd door normalizeFlight.js:
   *  - flight.flight_iata / flight.flight_icao
   *  - flight.airline_name (volledige naam via batch)
   *  - flight.airline_logo  (via batch)
   *  - flight.reg_number
   *  - dep_iata / arr_iata
   *  - status, speed, alt, heading
   *
   * Extra data wordt hier opgehaald:
   *  ✔ fetchAircraftDetails   (model, fabrikant, afbeelding)
   *  ✔ fetchAirportInfo       (volledige luchthavennamen)
   *
   * Dit component maakt ZO MIN MOGELIJK API calls:
   *  - caching met Maps voorkomt dubbele requests
   *  - geen calls als registratie / IATA ontbreekt
   */

  import { selectedFlightStore } from "$lib/utils/flights.js";

  import fetchAircraftDetails from "$lib/api/flights/fetchAircraftDetails.js";
  import fetchAirportInfo from "$lib/api/flights/fetchAirportInfo.js";

  // Interne caches om API calls te beperken
  const aircraftCache = new Map();
  const airportCache = new Map();

  // Huidige flight + verrijkte data
  let flight = null;
  let aircraft = null;
  let depAirport = null;
  let arrAirport = null;

  let loadingAircraft = false;
  let loadingAirports = false;

  // ------------------------------------------------------------
  // Reageer op verandering in de selectedFlightStore
  // ------------------------------------------------------------
  $: flight = $selectedFlightStore;

  // Wanneer er een nieuwe vlucht gekozen wordt, laad details
  $: if (flight) {
    loadDetails(flight);
  } else {
    aircraft = null;
    depAirport = null;
    arrAirport = null;
  }

  /**
   * Laad alle aanvullende gegevens voor deze vlucht:
   *  - Aircraft info via registratie
   *  - Airport info via IATA codes
   *
   * Maak efficiënt gebruik van de caches.
   */
  async function loadDetails(flight) {
    // ------ Vliegtuig info ophalen ------
    if (flight.reg_number) {
      // Cache check
      if (aircraftCache.has(flight.reg_number)) {
        aircraft = aircraftCache.get(flight.reg_number);
      } else {
        loadingAircraft = true;
        try {
          const result = await fetchAircraftDetails(flight.reg_number);
          aircraft = result;
          aircraftCache.set(flight.reg_number, result);
        } catch (err) {
          console.error("Fout bij aircraft details:", err);
        } finally {
          loadingAircraft = false;
        }
      }
    } else {
      aircraft = null;
    }

    // ------ Vertrek luchthaven ------
    if (flight.dep_iata) {
      if (airportCache.has(flight.dep_iata)) {
        depAirport = airportCache.get(flight.dep_iata);
      } else {
        loadingAirports = true;
        try {
          const result = await fetchAirportInfo(flight.dep_iata);
          depAirport = result;
          airportCache.set(flight.dep_iata, result);
        } catch (err) {
          console.error("Fout bij departure airport:", err);
        } finally {
          loadingAirports = false;
        }
      }
    } else {
      depAirport = null;
    }

    // ------ Aankomst luchthaven ------
    if (flight.arr_iata) {
      if (airportCache.has(flight.arr_iata)) {
        arrAirport = airportCache.get(flight.arr_iata);
      } else {
        loadingAirports = true;
        try {
          const result = await fetchAirportInfo(flight.arr_iata);
          arrAirport = result;
          airportCache.set(flight.arr_iata, result);
        } catch (err) {
          console.error("Fout bij arrival airport:", err);
        } finally {
          loadingAirports = false;
        }
      }
    } else {
      arrAirport = null;
    }
  }
</script>

{#if !flight}
  <p>Geen vlucht geselecteerd.</p>

{:else}
<section class="details">
{#if $selectedFlightStore}
  <h2>✈️ {$selectedFlightStore.flight_iata || $selectedFlightStore.flight_icao}</h2>
  <p>Registratie: {$selectedFlightStore.reg_number}</p>
  <p>Airline: {$selectedFlightStore.airline_name}</p>
  ...
{:else}
  <p>Geen vlucht geselecteerd.</p>
{/if}
  <!-- Titel met vluchtcode -->
  <h2>✈️ {flight.flight_iata || flight.flight_icao}</h2>

  <!-- Airline info uit batch -->
  <h3>Airline</h3>
  <p><strong>Naam:</strong> {flight.airline_name}</p>

  {#if flight.airline_logo}
    <img src={flight.airline_logo} alt="Airline logo" class="logo" />
  {/if}

  <!-- Aircraft info -->
  <h3>Vliegtuig</h3>
  <p><strong>Registratie:</strong> {flight.reg_number || "Onbekend"}</p>

  
  <!-- Route -->
  <h3>Route</h3>
  <p><strong>Van:</strong> {depAirport?.name || flight.dep_iata || "?"}</p>
  <p><strong>Naar:</strong> {arrAirport?.name || flight.arr_iata || "?"}</p>

  <!-- Live flight data -->
  <h3>Live vluchtdata</h3>
  <p><strong>Status:</strong> {flight.status}</p>

  <p>
    <strong>Hoogte:</strong>
    {Number.isFinite(flight.alt) ? `${flight.alt} ft` : "—"}
  </p>
  <p>
    <strong>Snelheid:</strong>
    {Number.isFinite(flight.speed) ? `${flight.speed} kts` : "—"}
  </p>
  <p>
    <strong>Heading:</strong>
    {Number.isFinite(flight.dir) ? `${flight.dir}°` : "—"}
  </p>

</section>
{/if}

<style>
  .details {
    padding: 1rem;
    border-radius: 0.75rem;
    background: #eef2ff;
  }

  h3 {
    margin-bottom: 0.25rem;
  }

  .logo {
    max-width: 120px;
    margin: 0.5rem 0;
  }

  .plane-img {
    max-width: 100%;
    border-radius: 0.5rem;
    margin: 0.5rem 0;
  }

  p {
    margin: 0.1rem 0;
  }
</style>
