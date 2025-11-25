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
  <p>Geen vluchten gevonden voor deze filters.</p>
{:else}
  <section class="list">
    {#each $filteredFlightsStore.results as flight}
      <article
        class="card"
        on:click={() => selectedFlightStore.set(flight)}
      >
        <h3>Vlucht {flight.flight_iata || flight.flight_icao}</h3>

        <p><strong>Airline:</strong> {normalizeAirline(flight)}</p>

        <p>
          <strong>Route:</strong>
          {flight.dep_iata || "?"} → {flight.arr_iata || "?"}
        </p>

        <p>
          <strong>Vliegtuig:</strong>
          {flight.reg_number || flight.aircraft_icao || "Niet beschikbaar"}
        </p>

        <p><strong>Status:</strong> {flight.status || "Onbekend"}</p>

        <p>
          <strong>Snelheid:</strong>
          {flight.speed ? `${Math.round(flight.speed)} kts` : "—"}
        </p>

        <p>
          <strong>Hoogte:</strong>
          {flight.alt ? `${Math.round(flight.alt)} ft` : "—"}
        </p>
      </article>
    {/each}
  </section>
{/if}

<style>
  .list {
    display: flex;
    flex-direction: column;
    gap: 0.75rem;
  }

  .card {
    padding: 0.75rem 1rem;
    border-radius: 0.75rem;
    background: #dfffff;
    box-shadow: 0 1px 4px rgba(0, 0, 0, 0.08);
    cursor: pointer;
  }

  .card:hover {
    transform: translateY(-1px);
  }

  h3 {
    margin: 0 0 0.25rem 0;
  }

  p {
    margin: 0.15rem 0;
    font-size: 0.9rem;
  }
</style>
