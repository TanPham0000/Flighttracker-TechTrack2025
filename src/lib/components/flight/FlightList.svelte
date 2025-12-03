<script>
  /**
   * FlightList.svelte
   * ------------------
   * Toont een lijst met vluchten op basis van filteredFlightsStore.
   * Gebruikt een inline "card" i.p.v. een apart component.
   */

  import { filteredFlightsStore } from "$lib/utils/filters.js";
  import { selectedFlightStore } from "$lib/utils/flights.js";
  import { normalizeAirline } from "$lib/utils/airlines.js";
</script>

{#if $filteredFlightsStore.total === 0}
  <div class="empty-state">
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
      <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z"/>
      <circle cx="12" cy="10" r="3"/>
    </svg>
    <p>Geen vluchten gevonden voor deze filters.</p>
  </div>
{:else}
  <section class="list">
    {#each $filteredFlightsStore.results as flight}
      <article
        class="card"
        on:click={() => selectedFlightStore.set(flight)}
        role="button"
        tabindex="0"
        on:keydown={(e) => e.key === 'Enter' && selectedFlightStore.set(flight)}
      >
        <h3>{flight.flight_iata || flight.flight_icao || "Onbekend"}</h3>

        <div class="info-grid">
          <div class="info-row">
            <span class="info-label">Airline:</span>
            <span class="info-value">{normalizeAirline(flight) || "—"}</span>
          </div>

          <div class="info-row">
            <span class="info-label">Route:</span>
            <span class="info-value route">
              {flight.dep_iata || "?"} → {flight.arr_iata || "?"}
            </span>
          </div>

          <div class="info-row">
            <span class="info-label">Vliegtuig:</span>
            <span class="info-value">{flight.reg_number || flight.aircraft_icao || "—"}</span>
          </div>

          <div class="info-row">
            <span class="info-label">Status:</span>
            <span class="info-value">{flight.status || "—"}</span>
          </div>

          <div class="info-row">
            <span class="info-label">Snelheid:</span>
            <span class="info-value">{flight.speed ? `${Math.round(flight.speed)} kts` : "—"}</span>
          </div>

          <div class="info-row">
            <span class="info-label">Hoogte:</span>
            <span class="info-value">{flight.alt ? `${Math.round(flight.alt)} ft` : "—"}</span>
          </div>
        </div>
      </article>
    {/each}
  </section>
{/if}

<style>
  .list {
    display: flex;
    flex-direction: column;
    gap: 0.875rem;
    max-height: 70vh;
    overflow-y: auto;
    padding-right: 0.5rem;
  }

  .card {
    padding: 1.25rem;
    border-radius: var(--radius-md);
    background: var(--color-bg-glass);
    backdrop-filter: blur(16px) saturate(180%);
    box-shadow: 
      0 4px 16px rgba(0, 0, 0, 0.2),
      0 0 0 1px rgba(255, 255, 255, 0.1);
    cursor: pointer;
    max-width: fit-content;
    min-width: 280px;
    transition: all 0.2s ease;
    border: 1px solid rgba(255, 255, 255, 0.1);
  }

  .card:hover {
    transform: translateY(-2px);
    box-shadow: 
      0 8px 24px rgba(0, 0, 0, 0.3),
      0 0 0 1px rgba(96, 165, 250, 0.3);
    border-color: rgba(96, 165, 250, 0.3);
  }

  .card:active {
    transform: translateY(0);
  }

  h3 {
    margin: 0 0 0.75rem 0;
    font-size: 1.1rem;
    color: var(--color-text-primary);
    font-weight: 600;
    display: flex;
    align-items: center;
    gap: 0.5rem;
  }

  h3::before {
    content: "✈️";
    font-size: 1rem;
  }

  .info-grid {
    display: grid;
    gap: 0.5rem;
  }

  .info-row {
    display: flex;
    align-items: flex-start;
    gap: 0.5rem;
    font-size: 0.875rem;
  }

  .info-label {
    font-weight: 600;
    color: var(--color-text-muted);
    min-width: 80px;
  }

  .info-value {
    color: var(--color-text-secondary);
    flex: 1;
  }

  .route {
    font-weight: 600;
    color: var(--color-accent);
    font-size: 0.95rem;
  }

  p {
    margin: 0;
  }

  /* Empty state */
  .empty-state {
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    padding: 3rem 2rem;
    text-align: center;
    color: var(--color-text-muted);
    gap: 1rem;
  }

  .empty-state svg {
    width: 64px;
    height: 64px;
    opacity: 0.5;
  }

  .empty-state p {
    font-size: 1rem;
    margin: 0;
  }
</style>
