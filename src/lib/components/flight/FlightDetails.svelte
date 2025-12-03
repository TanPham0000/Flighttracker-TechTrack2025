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

  // Wanneer flight verandert laad details
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
    <div class="empty-state">
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
        <path d="M21 16v-2l-8-5V3.5c0-.83-.67-1.5-1.5-1.5S10 2.67 10 3.5V9l-8 5v2l8-2.5V19l-2 1.5V21l3.5-1 3.5 1v-1.5L13 19v-5.5l8 2.5z"/>
      </svg>
      <h2>Geen vlucht geselecteerd</h2>
      <p>Klik op een vlucht in de lijst of op de globe om details te zien.</p>
    </div>
  </section>

{:else}

<section class="details">
  <!-- Titel -->
  <h2>
    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
      <path d="M21 16v-2l-8-5V3.5c0-.83-.67-1.5-1.5-1.5S10 2.67 10 3.5V9l-8 5v2l8-2.5V19l-2 1.5V21l3.5-1 3.5 1v-1.5L13 19v-5.5l8 2.5z"/>
    </svg>
    {flight.flight_iata || flight.flight_icao || "Vlucht"}
  </h2>

  <!-- Airline -->
  <div class="section">
    <h3>Airline</h3>
    <div class="info-row">
      <span class="info-label">Naam:</span>
      <span class="info-value">{flight.airline_name || "—"}</span>
    </div>
    {#if flight.airline_logo}
      <img src={flight.airline_logo} alt="Airline logo" class="logo" />
    {/if}
  </div>

  <!-- Aircraft -->
  <div class="section">
    <h3>Vliegtuig</h3>
    <div class="info-row">
      <span class="info-label">Registratie:</span>
      <span class="info-value">{flight.reg_number || "—"}</span>
    </div>

    {#if loadingAircraft}
      <p class="loading-text">Bezig met laden...</p>
    {:else if aircraft}
      <div class="info-row">
        <span class="info-label">Type:</span>
        <span class="info-value">{aircraft.model || "—"}</span>
      </div>
      <div class="info-row">
        <span class="info-label">Fabrikant:</span>
        <span class="info-value">{aircraft.manufacturer || "—"}</span>
      </div>
      {#if aircraft.image}
        <img src={aircraft.image} alt="Aircraft" class="plane-img" />
      {/if}
    {/if}
  </div>

  <!-- Route -->
  <div class="section">
    <h3>Route</h3>
    <div class="info-row">
      <span class="info-label">Van:</span>
      <span class="info-value">{depAirport?.name || flight.dep_iata || "—"}</span>
    </div>
    <div class="info-row">
      <span class="info-label">Naar:</span>
      <span class="info-value">{arrAirport?.name || flight.arr_iata || "—"}</span>
    </div>
  </div>

  <!-- Live Flight Data -->
  <div class="section">
    <h3>Live vluchtdata</h3>
    <div class="info-row">
      <span class="info-label">Status:</span>
      <span class="info-value">{flight.status || "—"}</span>
    </div>
    <div class="info-row">
      <span class="info-label">Hoogte:</span>
      <span class="info-value">{Number.isFinite(flight.alt) ? `${Math.round(flight.alt).toLocaleString('nl-NL')} ft` : "—"}</span>
    </div>
    <div class="info-row">
      <span class="info-label">Snelheid:</span>
      <span class="info-value">{Number.isFinite(flight.speed) ? `${Math.round(flight.speed)} kts` : "—"}</span>
    </div>
    <div class="info-row">
      <span class="info-label">Heading:</span>
      <span class="info-value">{Number.isFinite(flight.dir) ? `${Math.round(flight.dir)}°` : "—"}</span>
    </div>
  </div>
</section>

{/if}

<style>
  .details {
    padding: 1.5rem;
    border-radius: var(--radius-md);
    background: var(--color-bg-glass);
    backdrop-filter: blur(16px) saturate(180%);
    box-shadow: 
      0 4px 16px rgba(0, 0, 0, 0.2),
      0 0 0 1px rgba(255, 255, 255, 0.1);
    border: 1px solid rgba(255, 255, 255, 0.1);
    max-height: 80vh;
    overflow-y: auto;
  }

  .empty-state {
    text-align: center;
    padding: 2rem 1rem;
    color: var(--color-text-muted);
  }

  .empty-state svg {
    width: 64px;
    height: 64px;
    margin: 0 auto 1rem;
    opacity: 0.5;
  }

  .empty-state h2 {
    font-size: 1.25rem;
    margin-bottom: 0.5rem;
    color: var(--color-text-secondary);
  }

  .empty-state p {
    font-size: 0.9rem;
    margin: 0;
  }

  h2 {
    font-size: 1.5rem;
    margin: 0 0 1.5rem 0;
    display: flex;
    align-items: center;
    gap: 0.5rem;
    color: var(--color-text-primary);
  }

  h3 {
    font-size: 1rem;
    margin: 1.5rem 0 0.75rem 0;
    color: var(--color-accent);
    font-weight: 600;
    text-transform: uppercase;
    letter-spacing: 0.5px;
    font-size: 0.875rem;
    padding-bottom: 0.5rem;
    border-bottom: 1px solid rgba(255, 255, 255, 0.1);
  }

  h3:first-of-type {
    margin-top: 0;
  }

  .info-row {
    display: flex;
    gap: 0.5rem;
    margin: 0.5rem 0;
    font-size: 0.9rem;
  }

  .info-label {
    font-weight: 600;
    color: var(--color-text-muted);
    min-width: 100px;
  }

  .info-value {
    color: var(--color-text-secondary);
    flex: 1;
  }

  .logo {
    max-width: 140px;
    margin: 0.75rem 0;
    border-radius: var(--radius-sm);
    box-shadow: 0 2px 8px rgba(0, 0, 0, 0.2);
  }

  .plane-img {
    max-width: 100%;
    border-radius: var(--radius-md);
    margin: 0.75rem 0;
    box-shadow: 0 4px 16px rgba(0, 0, 0, 0.3);
  }

  .loading-text {
    color: var(--color-text-muted);
    font-style: italic;
    font-size: 0.875rem;
  }

  .section {
    margin-bottom: 1.5rem;
  }

  p {
    margin: 0.5rem 0;
  }
</style>
