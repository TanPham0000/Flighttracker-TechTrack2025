<script>
  import { flightsStore } from "$lib/utils/flights.js";

  $: flights = $flightsStore;

  $: stats = flights.reduce((acc, f) => {
    const s = f.status || "unknown";
    acc[s] = (acc[s] || 0) + 1;
    return acc;
  }, {});
</script>

<section class="stats">
  <h2>Statistieken</h2>
  {console.log(flights)}
  <p><strong>Totaal aantal vluchten:</strong> {flights.length}</p>

  <ul>
    {#each Object.entries(stats) as [key, value]}
      <li>{key}: {value}</li>
    {/each}
  </ul>
</section>

<style>
  .stats {
    padding: 1rem;
    background: #f9fafb;
    border-radius: 10px;
  }
</style>
