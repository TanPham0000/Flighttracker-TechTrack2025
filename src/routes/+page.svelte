<script>

  import { onMount } from "svelte";
  import "./global.css";

  // Data functies
  import { fetchFlights } from "$lib/api/flights/fetchFlights.js";
  import { getStored, setStored } from "$lib/utils/storage.js";

  // Stores
  import { flightsStore } from "$lib/utils/flights.js";

  // UI componenten
  import FlightSelector from "$lib/components/flight/FlightSelector.svelte";
  import FlightDetails from "$lib/components/flight/FlightDetails.svelte";
  import FlightList from "$lib/components/flight/FlightList.svelte";
  import FlightStats from "$lib/components/flight/FlightStats.svelte";
  import RefreshButton from "$lib/components/ui/RefreshButton.svelte";

    // UI state
  let loading = true;
  let error = null;
  let lastUpdate = getStored("flight_timestamp", null);

  /**
   * onMount
   * -------
   * Bij het laden van de pagina:
   *  1. Probeer localStorage
   *  2. Zo niet → haal verse data op
   */
  onMount(async () => {
    const cachedFlights = getStored("flights", null);

    if (cachedFlights && Array.isArray(cachedFlights) && cachedFlights.length > 0) {
      console.log("✅ Vluchten geladen uit localStorage:", cachedFlights.length);
      flightsStore.set(cachedFlights);
      loading = false;
      return;
    }

    // Geen cache → verse data
    await loadFreshData();
  });

  /**
   * loadFreshData
   * -------------
   * Haalt ALTIJD nieuwe data op van AviationStack.
   * Wordt gebruikt:
   *  - bij eerste load (als er geen cache is)
   *  - bij klikken op "Ververs data"
   */
  async function loadFreshData() {
    loading = true;
    error = null;

    try {
      const flights = await fetchFlights(100); // altijd verse array

      console.log("🔄 Nieuwe dataset ontvangen, aantal vluchten:", flights.length);
      console.log("🔍 Eerste vlucht:", flights[0]);

      // in store
      flightsStore.set(flights);

      // in localStorage
      setStored("flights", flights);

      // timestamp bijwerken
      const now = Date.now();
      setStored("flight_timestamp", now);
      lastUpdate = now;
    } catch (err) {
      console.error("❌ Fout in loadFreshData:", err);
      error = err;
    } finally {
      loading = false;
    }
  }
</script>

{#if loading}
  <p>⏳ Vluchtdata laden...</p>

{:else if error}
  <p>❌ Er ging iets mis bij het ophalen van de vluchtdata: {error.message}</p>

{:else}
  <!-- 🔄 Bovenaan: refresh + timestamp -->
  <RefreshButton {lastUpdate} on:refresh={() => loadFreshData()} />

  <!-- De rest van de pagina -->
  <section class="grid">
    <div class="col">
      <FlightSelector />
      <FlightDetails />
    </div>

    <div class="col">
      <FlightStats />
      <FlightList />
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