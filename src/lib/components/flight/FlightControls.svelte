<script>
  /**
   * FlightControls.svelte
   * ----------------------
   * Combineert:
   *  - Vlucht-selectie (dropdown + willekeurige vlucht)
   *  - Filters (airline, vertrek, bestemming)
   *
   * Werkt met:
   *  - flightsStore        (ruwe dataset)
   *  - filteredFlightsStore (voor dropdown)
   *  - selectedFlightStore
   *  - airlineFilter, routeFilter, pagination
   *  - airlineNameMap (voor nette namen in filters)
   */

  import { flightsStore, selectedFlightStore } from "$lib/utils/flights.js";
  import {
    airlineFilter,
    routeFilter,
    pagination,
    filteredFlightsStore
  } from "$lib/utils/filters.js";
  import { airlineNameMap, normalizeAirline } from "$lib/utils/airlines.js";
  import Button from "$lib/components/ui/Button.svelte";

  // afgeleide arrays voor dropdowns
  $: allFlights = $flightsStore;
  $: filteredPage = $filteredFlightsStore;
  $: airlineNames = $airlineNameMap;

  // unieke airline codes voor filter
  $: airlineOptions = [...new Set(
    allFlights.map((f) => f.airline_iata || f.airline_icao).filter(Boolean)
  )].sort();

  // vertrek & bestemming opties
  $: depOptions = [...new Set(allFlights.map((f) => f.dep_iata).filter(Boolean))].sort();
  $: arrOptions = [...new Set(allFlights.map((f) => f.arr_iata).filter(Boolean))].sort();

  function handleSelectChange(event) {
    const index = Number(event.target.value);
    const flightsOnPage = filteredPage.results;

    if (!Number.isFinite(index) || !flightsOnPage[index]) {
      selectedFlightStore.set(null);
      return;
    }

    selectedFlightStore.set(flightsOnPage[index]);
  }

  function pickRandomFlight() {
    const flights = filteredPage.results;
    if (!flights.length) return;

    const randomIndex = Math.floor(Math.random() * flights.length);
    selectedFlightStore.set(flights[randomIndex]);
  }

  function clearFilters() {
    airlineFilter.set(null);
    routeFilter.set({ from: null, to: null });
    pagination.set({ page: 1, perPage: 50 });
  }
</script>

<section class="controls">
  <h2>Vlucht selecteren</h2>

  <!-- Vlucht dropdown -->
  <div class="selector-row">
    <select on:change={handleSelectChange}>
      <option value="">-- kies een vlucht --</option>
      {#each filteredPage.results as flight, index}
        <option value={index}>
          {flight.flight_iata || flight.flight_icao || "Onbekend"} —
          {flight.dep_iata || "?"} → {flight.arr_iata || "?"}
        </option>
      {/each}
    </select>

    <Button label="🎲 Willekeurige vlucht" variant="secondary" on:click={pickRandomFlight} />
  </div>

  <!-- Filters -->
  <section class="filters">
    <h3>Filters</h3>

    <label>
      Airline:
      <select
        on:change={(e) => {
          airlineFilter.set(e.target.value || null);
          pagination.update((p) => ({ ...p, page: 1 }));
        }}>
        <option value="">(alle airlines)</option>
        {#each airlineOptions as code}
          <option value={code}>
            {airlineNames[code] || code}
          </option>
        {/each}
      </select>
    </label>

    <label>
      Van:
      <select
        on:change={(e) => {
          const value = e.target.value || null;
          routeFilter.update((r) => ({ ...r, from: value }));
          pagination.update((p) => ({ ...p, page: 1 }));
        }}>
        <option value="">(alle vertrek luchthavens)</option>
        {#each depOptions as code}
          <option value={code}>{code}</option>
        {/each}
      </select>
    </label>

    <label>
      Naar:
      <select
        on:change={(e) => {
          const value = e.target.value || null;
          routeFilter.update((r) => ({ ...r, to: value }));
          pagination.update((p) => ({ ...p, page: 1 }));
        }}>
        <option value="">(alle bestemmingen)</option>
        {#each arrOptions as code}
          <option value={code}>{code}</option>
        {/each}
      </select>
    </label>

    <Button label="Reset filters" variant="secondary" on:click={clearFilters} />
  </section>
</section>

<style>
  .controls {
    display: flex;
    flex-direction: column;
    gap: 1rem;
  }

  .selector-row {
    display: flex;
    gap: 0.5rem;
    align-items: center;
  }

  select {
    padding: 0.5rem;
    border-radius: 0.5rem;
    border: 1px solid #d1d5db;
    flex: 1;
  }

  .filters {
    padding: 1rem;
    border-radius: 0.75rem;
    background: #eef2ff;
    display: flex;
    flex-direction: column;
    gap: 0.5rem;
  }

  label {
    display: flex;
    flex-direction: column;
    font-size: 0.9rem;
  }
</style>
