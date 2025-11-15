<script>
  /**
   * FlightList.svelte
   * ------------------
   * Toont een lijst met FlightCards op basis van flightsStore.
   * Geen logica, puur visuele weergave.
   */

  import { flightsStore } from "$lib/utils/flights.js";
  import FlightCard from "./FlightCard.svelte";

  /** @type {any[]} */
  let flights = [];
  const unsubscribe = flightsStore.subscribe((value) => {
    flights = value;
  });

  // opruimen als component verdwijnt
  import { onDestroy } from "svelte";
  onDestroy(unsubscribe);
</script>

{#if flights.length === 0}
  <p>Er zijn nog geen vluchten geladen.</p>
{:else}
  <section class="list">
    {#each flights as flight}
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
