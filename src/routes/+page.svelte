<script>
  import { onMount } from "svelte";
  import "./global.css";

  // Data fetching
  import fetchActiveFlights from "$lib/api/flights/fetchActiveFlights.js";

  // LocalStorage utils
  import { getStored, setStored } from "$lib/utils/storage.js";

  // Svelte stores
  import { flightsStore } from "$lib/utils/flights.js";

  // UI components
  import FlightSelector from "$lib/components/flight/FlightSelector.svelte";
  import FlightDetails from "$lib/components/flight/FlightDetails.svelte";
  import FlightList from "$lib/components/flight/FlightList.svelte";
  import FlightStats from "$lib/components/flight/FlightStats.svelte";
  import RefreshButton from "$lib/components/ui/RefreshButton.svelte";
  import FlightFilters from "$lib/components/flight/FlightFilters.svelte";

  // UI state
  let loading = true;
  let error = null;
  let lastUpdate = getStored("flight_timestamp", null);

  /**
   * INIT: laad eerst cache, anders haal verse data op
   */
  onMount(async () => {
    const cached = getStored("flights", null);

    if (cached && Array.isArray(cached) && cached.length > 0) {
      console.log("📦 Cached AirLabs data geladen:", cached.length, "vluchten");
      flightsStore.set(cached);
      loading = false;
      return;
    }

    // geen cache → verse data
    await loadFreshData();
  });

  /**
   * Haalt ALTIJD nieuwe data op
   */
  async function loadFreshData() {
    loading = true;
    error = null;

    try {
      const flights = await fetchActiveFlights(100);

      console.log("✈️ AirLabs dataset:", flights.length, "actieve vluchten");
      console.log("Voorbeeld:", flights[0]);

      flightsStore.set(flights);
      setStored("flights", flights);

      const now = Date.now();
      lastUpdate = now;
      setStored("flight_timestamp", now);

    } catch (err) {
      console.error("❌ Fout bij AirLabs fetch:", err);
      error = err;
    } finally {
      loading = false;
    }
  }
</script>

{#if loading}
  <p>⏳ Live vluchtdata halen...</p>

{:else if error}
  <p>❌ Er ging iets mis bij het ophalen van data: {error.message}</p>

{:else}
  <!-- Refresh -->
  <RefreshButton {lastUpdate} on:refresh={() => loadFreshData()} />

  <section class="grid">
    <div class="col">
      <FlightSelector />
      <FlightFilters />
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
