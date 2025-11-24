<script>
  /**
   * FlightCard.svelte
   * ----------------------------------
   * Toont een compacte weergave van een vlucht.
   */

  export let flight;
</script>

<section class="card">
  <h3>
    Vlucht {flight.flight_iata || flight.flight_icao || "Onbekend"}
  </h3>

  <p><strong>Airline:</strong> {flight.airline_iata || flight.airline_icao || "Onbekend"}</p>

  <p>
    <strong>Route:</strong>
    {(flight.dep_iata || "?")} →
    {(flight.arr_iata || "?")}
  </p>

  <p>
    <strong>Vliegtuig:</strong>
    {flight.reg_number || flight.aircraft_icao || "Niet beschikbaar"}
  </p>

  <p><strong>Status:</strong> {flight.status || "Onbekend"}</p>

  <p>
    <strong>Snelheid:</strong>
    {flight.speed ? Math.round(flight.speed) + " kts" : "—"}
  </p>

  <p>
    <strong>Hoogte:</strong>
    {flight.alt ? Math.round(flight.alt) + " ft" : "—"}
  </p>
</section>

<style>
  .card {
    padding: 1rem;
    background: #dfffff;
    border-radius: 10px;
    box-shadow: 0 2px 6px rgba(0, 0, 0, 0.1);
  }

  h3 {
    margin: 0 0 0.25rem 0;
  }

  p {
    margin: 0.3rem 0;
  }
</style>
