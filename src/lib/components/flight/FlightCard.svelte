<script>
  /**
   * FlightCard.svelte
   * ----------------------------------------------
   * Dit component toont:
   *  - airline naam
   *  - vluchtcode
   *  - vertrek & aankomst IATA code
   *  - registratie (indien beschikbaar)
   *  - hoogte / snelheid
   */

  export let flight;
</script>

<section class="card">
  <!-- Vluchtnummer -->
  <h3>
    Vlucht {flight.flight_iata || flight.flight_icao || "Onbekend"}
  </h3>

  <!-- Airline -->
  <p>
    <strong>Airline:</strong>
    {flight.airline_name}
  </p>

  <!-- Route -->
  <p>
    <strong>Route:</strong>
    {(flight.dep_iata || flight.dep_icao || "?" )} →
    {(flight.arr_iata || flight.arr_icao || "?" )}
  </p>

  <!-- Aircraft (registratie) -->
  <p>
    <strong>Vliegtuig:</strong>
    {flight.reg_number || "Onbekend"}
  </p>

  <!-- Snelheid -->
  <p>
    <strong>Snelheid:</strong>
    {Number.isFinite(flight.speed) ? `${Math.round(flight.speed)} kts` : "—"}
  </p>

  <!-- Hoogte -->
  <p>
    <strong>Hoogte:</strong>
    {Number.isFinite(flight.alt) ? `${Math.round(flight.alt)} ft` : "—"}
  </p>

  <!-- Status -->
  <p>
    <strong>Status:</strong>
    {flight.status || "Onbekend"}
  </p>
</section>

<style>
  .card {
    padding: 0.8rem 1rem;
    border-radius: 0.75rem;
    background: #e5f9ff;
    box-shadow: 0 1px 4px rgba(0,0,0,0.08);
    display: flex;
    flex-direction: column;
    gap: 0.25rem;
  }

  h3 {
    margin: 0;
    font-size: 1.05rem;
  }

  p {
    margin: 0.2rem 0;
    font-size: 0.9rem;
  }
</style>
