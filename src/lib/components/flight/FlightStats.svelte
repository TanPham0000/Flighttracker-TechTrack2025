<script>
  /**
   * FlightStats.svelte
   * -------------------
   * Toont eenvoudige statistieken op basis van alle vluchten in flightsStore.
   * Bijv:
   *  - totaal aantal vluchten
   *  - aantal per status (en-route, landed, scheduled, etc.)
   */

  import { flightsStore } from "$lib/utils/flights.js";

  $: flights = $flightsStore;
  $: total = flights.length;

  $: statusCounts = flights.reduce((acc, flight) => {
    const status = flight.status || "unknown";
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
  }

  ul {
    padding-left: 1.25rem;
    margin: 0.5rem 0 0;
  }
</style>
