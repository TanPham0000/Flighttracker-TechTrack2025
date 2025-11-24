<script>
  /**
   * FlightDetails.svelte
   * --------------------------------------
   * Toont uitgebreide vluchtinformatie.
   * Haalt airline info + aircraft info + airport info op.
   */

  import { selectedFlightStore } from "$lib/utils/flights.js";
  import fetchAircraftDetails from "$lib/api/flights/fetchAircraftDetails.js";
  import fetchAirlineInfo from "$lib/api/flights/fetchAirlineInfo.js";
  import fetchAirportInfo from "$lib/api/flights/fetchAirportInfo.js";

  let flight = null;
  let airline = null;
  let aircraft = null;
  let depAirport = null;
  let arrAirport = null;

  // wanneer user vlucht selecteert → fetch extras
  $: if ($selectedFlightStore) {
    flight = $selectedFlightStore;
    loadDetails();
  }

  async function loadDetails() {
    if (!flight) return;

    airline = await fetchAirlineInfo(flight.airline_icao);
    aircraft = await fetchAircraftDetails(flight.reg_number);
    depAirport = await fetchAirportInfo(flight.dep_iata);
    arrAirport = await fetchAirportInfo(flight.arr_iata);
  }
</script>

{#if !flight}
  <p>Geen vlucht geselecteerd.</p>
{:else}
  <section class="details">
    <h2>✈️ {flight.flight_iata || flight.flight_icao}</h2>

    <h3>Airline</h3>
    <p><strong>Naam:</strong> {airline?.name || "Onbekend"}</p>
    {#if airline?.logo}
      <img src={airline.logo} alt="logo" class="logo"/>
    {/if}

    <h3>Vliegtuig</h3>
    <p><strong>Registratie:</strong> {flight.reg_number}</p>
    <p><strong>Model:</strong> {aircraft?.model || "Onbekend"}</p>
    <p><strong>Fabrikant:</strong> {aircraft?.manufacturer || "Onbekend"}</p>
    {#if aircraft?.image}
      <img src={aircraft.image} class="plane-img" />
    {/if}

    <h3>Route</h3>
    <p>
      <strong>Van:</strong> {depAirport?.name || flight.dep_iata}
    </p>
    <p>
      <strong>Naar:</strong> {arrAirport?.name || flight.arr_iata}
    </p>

    <h3>Live vluchtdata</h3>
    <p><strong>Status:</strong> {flight.status}</p>
    <p><strong>Hoogte:</strong> {flight.alt || "—"} ft</p>
    <p><strong>Snelheid:</strong> {flight.speed || "—"} kts</p>
    <p><strong>Heading:</strong> {flight.dir || "—"}°</p>
  </section>
{/if}

<style>
  .details {
    padding: 1rem;
    background: #eef2ff;
    border-radius: 10px;
  }
  .logo {
    max-width: 120px;
    margin: 0.5rem 0;
  }
  .plane-img {
    max-width: 100%;
    border-radius: 6px;
    margin: 0.5rem 0;
  }
</style>
