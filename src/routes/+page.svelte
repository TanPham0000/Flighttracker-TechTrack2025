<script>
  /**
   * +page.svelte (OpenSky versie)
   * ------------------------------
   * Deze pagina vervangt AviationStack door:
   *
   *  ✔ fetchActiveFlights → OpenSky (alleen actieve vliegtuigen)
   *  ✔ caching van data in localStorage
   *  ✔ Refresh knop haalt ALTIJD nieuwe live data op
   *
   * Belangrijk:
   * OpenSky geeft GEEN airport of airline info,
   * dat vangen we op binnen FlightDetails en FlightSelector.
   */

  import { onMount } from "svelte";
  import "./global.css";

  // Nieuwe data functies (OpenSky + AviationAPI)
  import fetchActiveFlights from "$lib/api/flights/fetchActiveFlights.js";   // actieve vliegtuigen
  import fetchAircraftDetails from "$lib/api/flights/fetchAircraftDetails";
  import fetchAirportInfo from "$lib/api/flights/fetchAirportInfo.js";      

  // LocalStorage helpers
  import { getStored, setStored } from "$lib/utils/storage.js";

  // Svelte stores
  import { flightsStore } from "$lib/utils/flights.js";

  // UI componenten
  import FlightSelector from "$lib/components/flight/FlightSelector.svelte";
  import FlightDetails from "$lib/components/flight/FlightDetails.svelte";
  import FlightList from "$lib/components/flight/FlightList.svelte";
  import FlightStats from "$lib/components/flight/FlightStats.svelte";
  import RefreshButton from "$lib/components/ui/RefreshButton.svelte";

  // UI state variabelen
  let loading = true;
  let error = null;
  let lastUpdate = getStored("flight_timestamp", null);

  /**
   * onMount()
   * ----------
   * Bij eerste load:
   *   1. Probeer eerst cached flights uit localStorage
   *   2. Anders → haal nieuwe data op via OpenSky
   */
  onMount(async () => {
    const cachedFlights = getStored("flights", null);

    if (cachedFlights && Array.isArray(cachedFlights) && cachedFlights.length > 0) {
      console.log("📦 Cached actieve vluchten geladen:", cachedFlights.length);
      flightsStore.set(cachedFlights);
      loading = false;
      return;
    }

    // Geen cache → haal live data op
    await loadFreshData();
  });

  /**
   * loadFreshData()
   * ----------------
   * Haalt ALTIJD nieuwe actieve vluchten op via OpenSky.
   * Wordt aangeroepen:
   *   bij eerste load (als er geen cache is)
   *   wanneer gebruiker op 'Ververs Data' klikt
   */
  async function loadFreshData() {
    loading = true;
    error = null;

    try {
      // OpenSky: actieve vluchten in de lucht
      const flights = await fetchActiveFlights();

      console.log("🔄 Nieuwe OpenSky dataset geladen:", flights.length, "actieve vluchten");
      
      // Zet in Svelte store
      flightsStore.set(flights);

      // Cache opslaan
      setStored("flights", flights);

      // Timestamp opslaan
      const now = Date.now();
      setStored("flight_timestamp", now);
      lastUpdate = now;

    } catch (err) {
      console.error("❌ Fout bij ophalen OpenSky vluchten:", err);
      error = err;
    } finally {
      loading = false;
    }
  }
</script>

{#if loading}
  <p>⏳ Live vliegtuigen laden...</p>

{:else if error}
  <p>❌ Er ging iets mis: {error.message}</p>

{:else}
  <!-- Refresh bovenaan -->
  <RefreshButton {lastUpdate} on:refresh={() => loadFreshData()} />

  <!-- Layout -->
  <section class="grid">
    <div class="col">
      <FlightSelector />     <!-- vlucht kiezen -->
      <FlightDetails />      <!-- details van 1 toestel -->
    </div>

    <div class="col">
      <FlightStats />        <!-- statistieken, gebaseerd op OpenSky -->
      <FlightList />         <!-- lijst van actieve vliegtuigen -->
    </div>
  </section>
{/if}

<style>
  .grid {
    display: grid;
    grid-template-columns: repeat(auto-fit, minmax(260px, 1fr));
    gap: 1.5rem;
    margin-top: 1.5rem;
  }

  .col {
    display: flex;
    flex-direction: column;
    gap: 1rem;
  }
</style>
