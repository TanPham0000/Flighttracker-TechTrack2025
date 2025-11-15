<script>
  /**
   * +page.svelte
   * -------------
   * Hoofdpagina van de FlightTracker.
   *
   * Taken:
   *  - bij het laden: proberen vluchten uit localStorage te halen
   *  - als er geen lokale data is: API call doen naar AviationStack
   *  - resultaat opslaan in flightsStore én in localStorage
   *  - UI-componenten tonen die zelf de logica afhandelen
   */

  import { onMount } from "svelte";
  import { fetchFlights } from "$lib/api/flights/fetchFlights.js";
  import { getStored, setStored } from "$lib/utils/storage.js";
  import { flightsStore } from "$lib/utils/flights.js";

  import FlightSelector from "$lib/components/flight/FlightSelector.svelte";
  import FlightDetails from "$lib/components/flight/FlightDetails.svelte";
  import FlightList from "$lib/components/flight/FlightList.svelte";
  import FlightStats from "$lib/components/flight/FlightStats.svelte";

  let loading = true;
  /** @type {any|null} */
  let error = null;

  onMount(async () => {
    // 1️⃣ Probeer eerst localStorage
    const cached = getStored("flights", null);

    if (cached && Array.isArray(cached) && cached.length > 0) {
      flightsStore.set(cached);
      loading = false;
      return;
    }

    // 2️⃣ Zo niet → API call
    try {
      const flights = await fetchFlights(50);
      flightsStore.set(flights);
      setStored("flights", flights);
    } catch (err) {
      error = err;
    } finally {
      loading = false;
    }
  });
</script>

{#if loading}
  <p>⏳ Vluchtdata laden...</p>
{:else if error}
  <p>❌ Er ging iets mis bij het ophalen van de vluchtdata.</p>
{:else}
  <section class="grid">
    <div class="col">
      <FlightSelector />
      <FlightDetails />
    </div>

    <div class="col">
      <FlightStats />
      <FlightList />
    </div>

    <div class="col">
      
    </div>
  </section>
{/if}

<style>
  .grid {
    display: grid;
    grid-template-columns: repeat(auto-fit, minmax(260px, 1fr));
    gap: 1.5rem;
  }

  .col {
    display: flex;
    flex-direction: column;
    gap: 1rem;
  }
</style>
