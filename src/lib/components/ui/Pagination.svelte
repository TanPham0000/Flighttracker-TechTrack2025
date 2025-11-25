<script>
  /**
   * Pagination.svelte
   * -----------------
   * Toont een "Vorige / Volgende" paginatiebalk.
   * Werkt met de pagination store en filteredFlightsStore.
   */

  import { pagination, filteredFlightsStore } from "$lib/utils/filters.js";
  import Button from "./Button.svelte";

  $: page = $pagination.page;
  $: perPage = $pagination.perPage;
  $: total = $filteredFlightsStore.total;

  const hasPrev = () => page > 1;
  const hasNext = () => page * perPage < total;

  function goPrev() {
    if (!hasPrev()) return;
    pagination.update((p) => ({ ...p, page: p.page - 1 }));
  }

  function goNext() {
    if (!hasNext()) return;
    pagination.update((p) => ({ ...p, page: p.page + 1 }));
  }
</script>

<div class="pagination">
  <Button
    label="← Vorige"
    variant="secondary"
    on:click={goPrev}
    disabled={!hasPrev()}
  />

  <span>Pagina {page}</span>

  <Button
    label="Volgende →"
    variant="secondary"
    on:click={goNext}
    disabled={!hasNext()}
  />
</div>

<style>
  .pagination {
    display: flex;
    align-items: center;
    justify-content: center;
    gap: 1rem;
    margin-top: 1rem;
  }
</style>
