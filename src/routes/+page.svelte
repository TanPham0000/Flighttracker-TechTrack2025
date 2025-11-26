<script>
  import { onMount } from "svelte";
  import fetchActiveFlights from "$lib/api/flights/fetchActiveFlights.js";
  import { normalizeFlight } from "$lib/utils/normalizer.js";

  import { getStored, setStored } from "$lib/utils/storage.js";
  import { flightsStore } from "$lib/utils/flights.js";

  import FlightDetails from "$lib/components/flight/FlightDetails.svelte";
  import FlightList from "$lib/components/flight/FlightList.svelte";
  import FlightStats from "$lib/components/flight/FlightStats.svelte";
  import RefreshButton from "$lib/components/ui/RefreshButton.svelte";
  import D3Map from "$lib/components/map/D3Map.svelte";

  let loading = true;
  let error = null;
  let lastUpdate = getStored("flight_timestamp", null);

  // -----------------------------------------
  // INITIAL LOAD
  // -----------------------------------------
  onMount(async () => {
    const cached = getStored("flights", null);

    if (cached && Array.isArray(cached) && cached.length > 0) {
      flightsStore.set(cached);
      loading = false;
      return;
    }

    await loadFreshData();
  });

  // -----------------------------------------
  // Fetch ALWAYS live AirLabs data
  // -----------------------------------------
  async function loadFreshData() {
    loading = true;
    error = null;

    try {
      const raw = await fetchActiveFlights(1000);

      // Normaliseer dataset
      const normalized = raw.map((f) => normalizeFlight(f));

      flightsStore.set(normalized);
      setStored("flights", normalized);

      const now = Date.now();
      setStored("flight_timestamp", now);
      lastUpdate = now;

    } catch (err) {
      console.error("Load error:", err);
      error = err;
    } finally {
      loading = false;
    }
  }
</script>

<div class="layout-wrapper">

  <!-- LEFT SIDEBAR -->
  <aside class="left-panel">
    <div class="panel-block">
      <FlightDetails />
    </div>
    <div class="panel-block">
      <RefreshButton {lastUpdate} on:refresh={refreshData}/>
    </div>

  </aside>

  <!-- RIGHT CONTENT -->
  <main class="right-panel">
    <FlightStats />
    <FlightList />
  </main>

</div>

<style>
  /* Entire page overlay */
  .layout-wrapper {
    position: relative;
    display: flex;
    justify-content: space-between;
    width: 100%;
    height: 100vh;
    padding: 1rem;
    z-index: 10; /* Boven globe */
  }

  /* LEFT COLUMN */
  .left-panel {
    display: flex;
    flex-direction: column;
    gap: 1rem;
    height: 100%;
  }

  /* Modular glass panels */
  .panel-block {
    background: rgba(20, 20, 30, 0.45);
    backdrop-filter: blur(12px);
    border-radius: 12px;
    padding: 1rem;
    box-shadow: 0 2px 6px rgba(0,0,0,0.4);
  }

  /* RIGHT COLUMN */
  .right-panel {
    overflow-y: auto;
    padding-right: 1rem;
    display: flex;
    align-items: flex-end ;
    flex-direction: column;
    gap: 1rem;
    max-width: fit-content;
  }
</style>