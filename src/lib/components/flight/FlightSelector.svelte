<script>
  /**
   * FlightSelector.svelte
   * ----------------------
   * Deze component:
   *  - leest vluchten uit flightsStore (met $flightsStore)
   *  - laat de gebruiker een vlucht kiezen via een <select>
   *  - heeft een knop om een willekeurige vlucht te kiezen
   *  - schrijft de gekozen vlucht weg naar selectedFlightStore
   */

  import { flightsStore, selectedFlightStore } from "$lib/utils/flights.js";

</script>

<section class="selector">
  <h2>Vlucht selecteren</h2>

  <!-- Dropdown met alle vluchten -->
  <select
    on:change={(event) => {
      const index = Number(event.target.value);
      const flights = $flightsStore;

      if (!Number.isFinite(index) || !flights[index]) {
        selectedFlightStore.set(null);
        return;
      }

      selectedFlightStore.set(flights[index]);
    }}
  >
    <option value="">-- kies een vlucht --</option>

    {#each $flightsStore as flight, index}
      <option value={index}>
        {flight.flight?.iata || flight.flight?.number || "Onbekend"} —
        {flight.departure?.airport || flight.departure?.iata || "?"} →
        {flight.arrival?.airport || flight.arrival?.iata || "?"}
      </option>
    {/each}
  </select>

  <!-- Willekeurige vlucht -->
  <button label="🎲 Willekeurige vlucht" on:click={() => {
      const flights = $flightsStore;
      console.log("button pressed");
      
      if (!flights.length) return;
      const randomIndex = Math.floor(Math.random() * flights.length);
      selectedFlightStore.set(flights[randomIndex]);
    }}>🎲 Willekeurige vlucht</button>
</section>

<style>
  .selector {
    display: flex;
    flex-direction: column;
    gap: 0.5rem;
    max-width: 400px;
  }

  select {
    padding: 0.5rem;
    border-radius: 0.5rem;
    font-size: 0.95rem;
  }
</style>