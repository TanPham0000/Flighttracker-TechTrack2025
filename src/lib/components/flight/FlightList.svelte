<script>
  /**
   * FlightList.svelte
   * ------------------
   * Toont een lijst met FlightCards op basis van flightsStore.
   * Geen logica, puur visuele weergave.
   */
  import { filteredFlightsStore } from "$lib/utils/filters.js";
  import FlightCard from "./FlightCard.svelte";
</script>

{#if $filteredFlightsStore.total === 0}
  <p>Geen vluchten gevonden.</p>
{:else}
  <section class="list">
    {#each $filteredFlightsStore.results as flight}
      <FlightCard {flight} />
    {/each}
  </section>
{/if}


<style>
  .list {
    display: flex;
    flex-direction: column;
    gap: 0.75rem;
  }
</style>
