<script>
  import { onMount } from "svelte";
  import { normalizeFlight } from "$lib/utils/normalizer.js";
  import { flightsStore } from "$lib/utils/flights.js";

  import FlightDetails from "$lib/components/flight/FlightDetails.svelte";
  import FlightList from "$lib/components/flight/FlightList.svelte";
  import FlightStats from "$lib/components/flight/FlightStats.svelte";
  import RefreshButton from "$lib/components/ui/RefreshButton.svelte";
  import D3Map from "$lib/components/map/D3Map.svelte";

  // -------------------------------------------------------------
  // INITIAL LOAD bij elke page refresh een verse API call
  
  import { VITE_AIRLABS_API_KEY } from "$lib/config/apiKey.js";

  let lastUpdate = null;
  let loading = false;
  let error = null;

  const API_URL = `https://airlabs.co/api/v9/flights?api_key=${encodeURIComponent(VITE_AIRLABS_API_KEY)}`;

  // -------------------------------------------------------------
  // Fetch and map flight data
  // -------------------------------------------------------------
  async function loadFreshData() {
    loading = true;
    error = null;

    try {
      const res = await fetch(API_URL);
      if (!res.ok) throw new Error(`HTTP ${res.status}`);

      const json = await res.json();

      // Map incoming data through normalizer and store
      if (json?.response && Array.isArray(json.response)) {
        const normalizedFlights = json.response
          .map(normalizeFlight)
          .filter(flight => flight !== null);
        
        flightsStore.set(normalizedFlights);
      }

      lastUpdate = new Date().toISOString();
    } catch (err) {
      console.error("AirLabs fetch error:", err);
      error = err instanceof Error ? err.message : String(err);
    } finally {
      loading = false;
    }
  }

  // Auto-load once on mount (optional)
  onMount(() => {
    loadFreshData();
  });

</script>

<D3Map />

<div class="layout-wrapper">

  <!-- LEFT SIDEBAR -->
  <aside class="left-panel">
    <div class="panel-block">
      <FlightDetails />
    </div>

    <!-- 🔥 RefreshButton stuurt alleen event, parent doet de fetch -->
    <div class="panel-block">
      <RefreshButton {lastUpdate} on:refresh={loadFreshData}/>
    </div>
  </aside>

  <!-- RIGHT CONTENT -->
  <main class="right-panel">
    <FlightStats />
    <FlightList />
  </main>

</div>

<style>
  .layout-wrapper {
    position: relative;
    display: flex;
    justify-content: space-between;
    width: 100%;
    height: 100vh;
    padding: 1rem;
    z-index: 20;
    pointer-events: none;
  }

  .left-panel {
    display: flex;
    pointer-events: auto;
    flex-direction: column;
    gap: 1rem;
    height: 100%;
  }

  .panel-block {
    background: rgba(20, 20, 30, 0.45);
    backdrop-filter: blur(12px);
    border-radius: 12px;
    padding: 1rem;
    pointer-events: auto;
    box-shadow: 0 2px 6px rgba(0,0,0,0.4);
  }

  .right-panel {
    pointer-events: auto;
    overflow-y: auto;
    padding-right: 1rem;
    display: flex;
    align-items: flex-end;
    flex-direction: column;
    gap: 1rem;
    max-width: fit-content;
  }
</style>
