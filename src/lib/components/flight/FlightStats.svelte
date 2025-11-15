<script>
  /**
   * FlightStats.svelte
   * -------------------
   * Toont wat simpele statistieken over de geladen vluchten.
   * Bijvoorbeeld:
   *  - totaal aantal vluchten
   *  - hoeveel 'scheduled', 'active', 'landed', etc.
   */

  import { flightsStore } from "$lib/utils/flights.js";
  import { onDestroy } from "svelte";

  /** @type {any[]} */
  let flights = [];

  const unsubscribe = flightsStore.subscribe((value) => {
    flights = value;
  });

  onDestroy(unsubscribe);

  $: total = flights.length;

  $: statusCounts = flights.reduce((acc, flight) => {
    const status = flight.flight_status || "unknown";
    acc[status] = (acc[status] || 0) + 1;
    return acc;
  }, {});
</script>

<section class="stats">
  <h2>Statistieken</h2>

  <p><strong>Totaal aantal vluchten:</strong> {total}</p>

  <ul>
    {#each Object.entries(statusCounts) as [status, count]}
      <li>{status}: {count}</li>
    {/each}
  </ul>
</section>

<style>
  .stats {
    padding: 1rem;
    border-radius: 0.75rem;
    background: #f9fafb;
    max-width: 350px;
  }

  ul {
    padding-left: 1.25rem;
    margin: 0.5rem 0 0;
  }
</style>
