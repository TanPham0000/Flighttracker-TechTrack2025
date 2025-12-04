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
  
  /** @type {string | null} */
  let lastUpdate = null;
  let loading = false;
  /** @type {string | null} */ 
  let error = null;

  // -------------------------------------------------------------
  // Fetch and map flight data
  // -------------------------------------------------------------
  async function loadFreshData() {
    loading = true;
    error = null;

    try {
      // Use the API route which handles the AirLabs API call server-side
      const res = await fetch("/api");
      if (!res.ok) {
        const errorData = await res.json().catch(() => ({}));
        throw new Error(errorData.error || `HTTP ${res.status}`);
      }

      const json = await res.json();

      // Map incoming data through normalizer and store
      if (json?.response && Array.isArray(json.response)) {
        const normalizedFlights = json.response
          .map(normalizeFlight)
          .filter((/** @type {any} */ flight) => flight !== null);
        
        flightsStore.set(normalizedFlights);
        lastUpdate = new Date().toISOString();
      } else {
        throw new Error("Invalid response format from API");
      }
    } catch (err) {
      console.error("AirLabs fetch error:", err);
      error = err instanceof Error ? err.message : String(err);
    } finally {
      loading = false;
    }
  }

  // Auto-load once on mount
  onMount(() => {
    loadFreshData();
  });

</script>

<D3Map />

<div class="layout-wrapper">
  <!-- Loading Overlay -->
  {#if loading}
    <div class="loading-overlay">
      <div class="loading-spinner"></div>
      <p>Laden van vluchtdata...</p>
    </div>
  {/if}

  <!-- Error Message -->
  {#if error}
    <div class="error-banner">
      <span class="error-icon">⚠️</span>
      <span class="error-text">Fout bij ophalen data: {error}</span>
      <button class="error-close" on:click={() => error = null}>×</button>
    </div>
  {/if}

  <!-- LEFT SIDEBAR -->
  <aside class="left-panel">
    <div class="panel-block">
      <FlightDetails />
    </div>

    <div class="panel-block">
      <RefreshButton {lastUpdate} {loading} on:refresh={loadFreshData}/>
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
    padding: 1.5rem;
    z-index: 20;
    pointer-events: none;
    gap: 1.5rem;
  }

  .left-panel {
    display: flex;
    pointer-events: auto;
    flex-direction: column;
    gap: 1.25rem;
    height: 100%;
    max-width: 380px;
    min-width: 320px;
  }

  .panel-block {
    background: rgba(15, 23, 42, 0.85);
    backdrop-filter: blur(16px) saturate(180%);
    border-radius: 16px;
    padding: 1.5rem;
    pointer-events: auto;
    box-shadow: 
      0 8px 32px rgba(0, 0, 0, 0.3),
      0 0 0 1px rgba(255, 255, 255, 0.1);
    border: 1px solid rgba(255, 255, 255, 0.1);
    transition: transform 0.2s ease, box-shadow 0.2s ease;
  }

  .panel-block:hover {
    
    box-shadow: 
      0 12px 40px rgba(0, 0, 0, 0.4),
      0 0 0 1px rgba(255, 255, 255, 0.15);
  }

  .right-panel {
    pointer-events: auto;
    overflow-y: auto;
    padding-right: 0.5rem;
    display: flex;
    align-items: flex-end;
    flex-direction: column;
    gap: 1.25rem;
    max-width: fit-content;
  }

  /* Custom scrollbar for right panel */
  .right-panel::-webkit-scrollbar {
    width: 8px;
  }

  .right-panel::-webkit-scrollbar-track {
    background: rgba(15, 23, 42, 0.3);
    border-radius: 4px;
  }

  .right-panel::-webkit-scrollbar-thumb {
    background: rgba(148, 163, 184, 0.5);
    border-radius: 4px;
  }

  .right-panel::-webkit-scrollbar-thumb:hover {
    background: rgba(148, 163, 184, 0.7);
  }

  /* Loading Overlay */
  .loading-overlay {
    position: fixed;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    background: rgba(0, 0, 0, 0.7);
    backdrop-filter: blur(4px);
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    z-index: 1000;
    pointer-events: auto;
    gap: 1rem;
  }

  .loading-overlay p {
    color: white;
    font-size: 1.1rem;
    font-weight: 500;
  }

  .loading-spinner {
    width: 48px;
    height: 48px;
    border: 4px solid rgba(255, 255, 255, 0.2);
    border-top-color: #60a5fa;
    border-radius: 50%;
    animation: spin 0.8s linear infinite;
  }

  @keyframes spin {
    to { transform: rotate(360deg); }
  }

  /* Error Banner */
  .error-banner {
    position: fixed;
    top: 1.5rem;
    left: 50%;
    transform: translateX(-50%);
    background: rgba(239, 68, 68, 0.95);
    backdrop-filter: blur(12px);
    color: white;
    padding: 1rem 1.5rem;
    border-radius: 12px;
    display: flex;
    align-items: center;
    gap: 0.75rem;
    z-index: 1001;
    pointer-events: auto;
    box-shadow: 0 8px 24px rgba(239, 68, 68, 0.4);
    max-width: 90%;
    animation: slideDown 0.3s ease;
  }

  @keyframes slideDown {
    from {
      opacity: 0;
      transform: translateX(-50%) translateY(-20px);
    }
    to {
      opacity: 1;
      transform: translateX(-50%) translateY(0);
    }
  }

  .error-icon {
    font-size: 1.25rem;
  }

  .error-text {
    flex: 1;
    font-weight: 500;
  }

  .error-close {
    background: none;
    border: none;
    color: white;
    font-size: 1.5rem;
    cursor: pointer;
    padding: 0;
    width: 24px;
    height: 24px;
    display: flex;
    align-items: center;
    justify-content: center;
    border-radius: 4px;
    transition: background 0.2s;
  }

  .error-close:hover {
    background: rgba(255, 255, 255, 0.2);
  }

  /* Responsive Design */
  @media (max-width: 1024px) {
    .layout-wrapper {
      flex-direction: column;
      padding: 1rem;
    }

    .left-panel {
      max-width: 100%;
      min-width: auto;
    }

    .right-panel {
      width: 100%;
      align-items: stretch;
    }
  }
</style>
