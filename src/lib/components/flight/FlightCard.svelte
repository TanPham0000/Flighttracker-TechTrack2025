<script>
  /**
   * FlightCard.svelte
   * ------------------
   * Toont een compacte samenvatting van een vlucht.
   * Verwacht een "flight" prop met de structuur van AviationStack.
   */

  export let flight;
</script>

<section class="card">
    <h3>Vlucht {flight.flight?.iata || flight.flight?.number}</h3>
    <p>
      <strong>Airline:</strong>
      {flight.airline?.name || "Onbekend"}
    </p>

    <p>
      <strong>Route:</strong>
      {flight.departure?.airport || "?"} → {flight.arrival?.airport || "?"}
        {flight.departure?.iata ||
        "?"}
      →
      {flight.arrival?.airport ||
        flight.arrival?.iata || "?"}
    </p>

    <p>
      <strong>Vliegtuig:</strong>
      {flight.aircraft?.registration ||
        "Niet beschikbaar"}
      {#if flight.aircraft?.iata || flight.aircraft?.icao}
        ({flight.aircraft?.iata ||
          flight.aircraft?.icao})
      {/if}
    </p>
    <p>
      <strong>Status:</strong>
      {flight.flight_status || "Onbekend"}
    </p>
  </section>
<style>
  .card {
    padding: 0.75rem 1rem;
    border-radius: 0.75rem;
    background: #f3f4f6;
    box-shadow: 0 1px 4px rgba(0, 0, 0, 0.08);
  }

  h3 {
    margin: 0 0 0.25rem 0;
  }

  p {
    margin: 0.15rem 0;
    font-size: 0.9rem;
  }
</style>
