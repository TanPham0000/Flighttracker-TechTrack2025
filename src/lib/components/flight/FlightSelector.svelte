<script>
  /**
   * FlightSelector.svelte
   * ----------------------
   * Deze component:
   *  - leest de lijst met vluchten uit flightsStore
   *  - laat de gebruiker een vlucht kiezen via een <select>
   *  - heeft een knop om een willekeurige vlucht te kiezen
   *  - schrijft de gekozen vlucht weg naar selectedFlightStore
   */

  import { flightsStore, selectedFlightStore } from "$lib/utils/flights.js";
  import FlightButton from "../ui/FlightButton.svelte";
  import { onDestroy } from "svelte";

  let flights = [];

  const unsubscribe = flightsStore.subscribe((value) => {
    flights = value;
  });

  onDestroy(unsubscribe);

  // Wordt aangeroepen als de gebruiker een vlucht kiest uit de dropdown
  function handleSelect(event) {
    const index = Number(event.target.value);

    if (!Number.isFinite(index) || !flights[index]) {
      selectedFlightStore.set(null);
      return;
    }

    selectedFlightStore.set(flights[index]);
  }

  // Willekeurige vlucht kiezen
  function pickRandomFlight() {
    if (!flights.length) return;
    const randomIndex = Math.floor(Math.random() * flights.length);
    selectedFlightStore.set(flights[randomIndex]);
  }
</script>

<section class="selector">
  <h2>Vlucht selecteren</h2>

  <select on:change={handleSelect}>
    <option value="">-- kies een vlucht --</option>
    {#each flights as flight, index}
      <option value={index}>
        {flight.flight?.iata || flight.flight?.number || "Onbekend"} — 
        {flight.departure?.airport || "?"} → {flight.arrival?.airport || "?"}
      </option>
    {/each}
  </select>

  <FlightButton label="🎲 Willekeurige vlucht" on:click={pickRandomFlight} />
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
