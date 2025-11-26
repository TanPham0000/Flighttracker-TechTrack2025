<script>
  import { onMount } from "svelte";
  import fetchActiveFlights from "$lib/api/flights/fetchActiveFlights.js";
  import { normalizeFlight } from "$lib/utils/normalizer.js";

  import { getStored, setStored } from "$lib/utils/storage.js";
  import { flightsStore } from "$lib/utils/flights.js";

  import FlightSelector from "$lib/components/flight/FlightSelector.svelte";
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


{#if loading}
  <p>⏳ Actieve vluchten ophalen...</p>

{:else if error}
  <p>❌ Fout bij ophalen: {error.message}</p>

{:else}
  
  <RefreshButton {lastUpdate} on:refresh={() => loadFreshData()} />
    <div>
      <D3Map />
    </div>
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
  .page {
    max-width: 1200px;
    margin: 0 auto;
    padding: 2rem 1rem 3rem;
    font-family: system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", sans-serif;
  }

  h1 {
    text-align: center;
    margin-bottom: 1.5rem;
  }

  .refresh {
    padding: 1rem;
    border-radius: 0.75rem;
    background: #eff6ff;
    display: flex;
    align-items: center;
    justify-content: space-between;
    max-width: 450px;
    margin: 0 auto 1.5rem auto;
  }

  .grid {
    display: grid;
    grid-template-columns: repeat(auto-fit, minmax(280px, 1fr));
    gap: 1.5rem;
  }

  .col {
    display: flex;
    flex-direction: column;
    gap: 1rem;
  }
</style>
