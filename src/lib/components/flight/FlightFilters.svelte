<script>
  import { airlineFilter, routeFilter, pagination } from "$lib/utils/filters.js";
  import { flightsStore } from "$lib/utils/flights.js";

  let airlines = [];
  let routesFrom = [];
  let routesTo = [];

  $: {
    const flights = $flightsStore;

    airlines = [...new Set(flights.map(f => f.airline_iata || f.airline_icao))].filter(Boolean);

    routesFrom = [...new Set(flights.map(f => f.dep_iata))].filter(Boolean);
    routesTo   = [...new Set(flights.map(f => f.arr_iata))].filter(Boolean);
  }

  function clearFilters() {
    airlineFilter.set(null);
    routeFilter.set({ from: null, to: null });
    pagination.set({ page: 1, perPage: 50 });
  }
</script>

<section class="filters">
  <h3>Filters</h3>

  <label>
    Airline:
    <select on:change={(e) => airlineFilter.set(e.target.value || null)}>
      <option value="">(alle airlines)</option>
      {#each airlines as air}
        <option value={air}>{air}</option>
      {/each}
    </select>
  </label>

  <label>
    Van:
    <select on:change={(e) => routeFilter.update(v => ({ ...v, from: e.target.value || null }))}>
      <option value="">(alle vertrek luchthavens)</option>
      {#each routesFrom as r}
        <option value={r}>{r}</option>
      {/each}
    </select>
  </label>

  <label>
    Naar:
    <select on:change={(e) => routeFilter.update(v => ({ ...v, to: e.target.value || null }))}>
      <option value="">(alle bestemmingen)</option>
      {#each routesTo as r}
        <option value={r}>{r}</option>
      {/each}
    </select>
  </label>

  <button on:click={clearFilters}>Reset filters</button>
</section>

<style>
  .filters {
    display: flex;
    flex-direction: column;
    gap: 0.5rem;
    padding: 1rem;
    background: #eef2ff;
    border-radius: 10px;
  }

  label {
    display: flex;
    flex-direction: column;
    font-size: 0.9rem;
  }
</style>
