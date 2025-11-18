<script>
  /**
   * FlightDetails.svelte
   * ---------------------
   * Toont details van de geselecteerde vlucht.
   * Leest uit selectedFlightStore.
   * Gebruikt getFlightDuration() om de duur te berekenen.
   *
   * Dankzij Svelte's $-syntax wordt dit component automatisch
   * bijgewerkt als selectedFlightStore verandert.
   */

  import { selectedFlightStore } from "$lib/utils/flights.js";
  import { getFlightDuration } from "$lib/api/flights/calculateDuration.js";

  /**
   * Formatteer datum van YYYY-MM-DD naar DD-MM-YYYY
   */
  function formatDate(dateString) {
    if (!dateString) return "Onbekend";
    // Format: 2025-11-19 → 19-11-2025
    const [year, month, day] = dateString.split("-");
    return `${day}-${month}-${year}`;
  }
</script>

{#if !$selectedFlightStore}
  <p>Geen vlucht geselecteerd.</p>
{:else}
  <section class="details">
    <h2>✈️ Vlucht {$selectedFlightStore.flight?.iata || $selectedFlightStore.flight?.number}</h2>

    <p><strong>Datum:</strong> {formatDate($selectedFlightStore.flight_date)}</p>

    <p>
      <strong>Airline:</strong>
      {$selectedFlightStore.airline?.name || "Onbekend"}
    </p>

    <p>
      <strong>Route:</strong>
      {$selectedFlightStore.departure?.airport ||
        $selectedFlightStore.departure?.iata ||
        "?"}
      →
      {$selectedFlightStore.arrival?.airport ||
        $selectedFlightStore.arrival?.iata ||
        "?"}
    </p>

    <p>
      <strong>Vliegtuig:</strong>
      {$selectedFlightStore.aircraft?.registration ||
        "Niet beschikbaar"}
      {#if $selectedFlightStore.aircraft?.iata || $selectedFlightStore.aircraft?.icao}
        ({$selectedFlightStore.aircraft?.iata ||
          $selectedFlightStore.aircraft?.icao})
      {/if}
    </p>

    <p>
      <strong>Duur (geschat):</strong>
      {getFlightDuration($selectedFlightStore)}
    </p>

    <p>
      <strong>Status:</strong>
      {$selectedFlightStore.flight_status || "Onbekend"}
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