<script>
  import { selectedFlightStore } from "$lib/utils/flights.js";

  import fetchAircraftDetails from "$lib/api/flights/fetchAircraftDetails.js";
  import fetchAirportInfo from "$lib/api/flights/fetchAirportInfo.js";

  // Caches
  const aircraftCache = new Map();
  const airportCache = new Map();

  // Reactieve state
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

  // Wanneer flight verandert → laad details
  $: if (flight) {
    loadDetails(flight);
  } else {
    // Reset als er geen vlucht is geselecteerd
    aircraft = null;
    depAirport = null;
    arrAirport = null;
  }

  // ------------------------------------------------------------
  // Details ophalen
  // ------------------------------------------------------------
  async function loadDetails(flight) {
    if (!flight) return; // veiligheidscheck

    // ----- Aircraft -----
    if (flight.reg_number) {
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
          aircraft = null;
        } finally {
          loadingAircraft = false;
        }
      }
    } else {
      aircraft = null;
    }

    // ----- Departure Airport -----
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
          depAirport = null;
        } finally {
          loadingAirports = false;
        }
      }
    } else {
      depAirport = null;
    }

    // ----- Arrival Airport -----
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
          arrAirport = null;
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
  <section class="details">
    <h2>✈️ Geen vlucht geselecteerd</h2>
    <p>Klik op een vlucht in de lijst of op de globe om details te zien.</p>
  </section>

{:else}

<section class="details">
  <!-- Titel -->
  <h2>✈️ {flight.flight_iata || flight.flight_icao || "Vlucht"}</h2>

  <!-- Airline -->
  <h3>Airline</h3>
  <p><strong>Naam:</strong> {flight.airline_name || "Onbekend"}</p>

  {#if flight.airline_logo}
    <img src={flight.airline_logo} alt="Airline logo" class="logo" />
  {/if}

  <!-- Aircraft -->
  <h3>Vliegtuig</h3>
  <p><strong>Registratie:</strong> {flight.reg_number || "Onbekend"}</p>

  {#if loadingAircraft}
    <p>Bezig met laden...</p>
  {:else if aircraft}
    <p><strong>Type:</strong> {aircraft.model || "Onbekend"}</p>
    <p><strong>Fabrikant:</strong> {aircraft.manufacturer || "Onbekend"}</p>
    {#if aircraft.image}
      <img src={aircraft.image} alt="Aircraft" class="plane-img" />
    {/if}
  {/if}

  <!-- Route -->
  <h3>Route</h3>
  <p><strong>Van:</strong> {depAirport?.name || flight.dep_iata || "?"}</p>
  <p><strong>Naar:</strong> {arrAirport?.name || flight.arr_iata || "?"}</p>

  <!-- Live Flight Data -->
  <h3>Live vluchtdata</h3>

  <p><strong>Status:</strong> {flight.status || "Onbekend"}</p>

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
