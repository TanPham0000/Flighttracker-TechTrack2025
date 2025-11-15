<script>
  /**
   * FlightDetails.svelte
   * ---------------------
   * Toont details van de geselecteerde vlucht.
   * Leest uit selectedFlightStore.
   * Gebruikt getFlightDuration() om de duur te berekenen.
   */

  import { selectedFlightStore } from "$lib/utils/flights.js";
  import { getFlightDuration } from "$lib/api/flights/calculateDuration.js";
  import { onDestroy } from "svelte";

  let flight = null;

  const unsubscribe = selectedFlightStore.subscribe((value) => {
    flight = value;
  });

  onDestroy(unsubscribe);
</script>

{#if !flight}
  <p>Geen vlucht geselecteerd.</p>
{:else}
  <section class="details">
    <h2>✈️ Vlucht {flight.flight?.iata || flight.flight?.number}</h2>

    <p><strong>Datum:</strong> {flight.flight_date}</p>

    <p>
      <strong>Airline:</strong>
      {flight.airline?.name || "Onbekend"}
    </p>

    <p>
      <strong>Route:</strong>
      {flight.departure?.airport || flight.departure?.iata || "?"}
      →
      {flight.arrival?.airport || flight.arrival?.iata || "?"}
    </p>

    <p>
      <strong>Vliegtuig:</strong>
      {flight.aircraft?.registration || "Niet beschikbaar"}
    </p>

    <p>
      <strong>Duur (geschat):</strong>
      {getFlightDuration(flight)}
    </p>
  </section>
{/if}

<style>
  .details {
    padding: 1rem;
    border-radius: 0.75rem;
    background: #eef2ff;
    max-width: 450px;
  }

  p {
    margin: 0.25rem 0;
  }
</style>
