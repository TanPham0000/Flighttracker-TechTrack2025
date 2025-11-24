<script>
  import { flightsStore, selectedFlightStore } from "$lib/utils/flights.js";

  let flights = [];

  $: flights = $flightsStore;

  function selectFlight(e) {
    const idx = Number(e.target.value);
    selectedFlightStore.set(flights[idx] || null);
  }

  function randomFlight() {
    if (!flights.length) return;
    const idx = Math.floor(Math.random() * flights.length);
    selectedFlightStore.set(flights[idx]);
  }
</script>

<section>
  <h2>Vlucht selecteren</h2>

  <select on:change={selectFlight}>
    <option value="">-- kies een vlucht --</option>
    {#each flights as f, index}
      <option value={index}>
        {f.flight_iata || f.flight_icao} — 
        {f.dep_iata || "?"} → {f.arr_iata || "?"}
      </option>
    {/each}
  </select>

  <button on:click={randomFlight}>🎲 Willekeurige vlucht</button>
</section>
