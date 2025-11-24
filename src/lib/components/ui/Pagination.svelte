<script>
  import { pagination, filteredFlightsStore } from "$lib/utils/filters.js";

  function prev() {
    if ($pagination.page > 1) {
      pagination.update(p => ({ ...p, page: p.page - 1 }));
    }
  }

  function next() {
    if ($pagination.page * $pagination.perPage < $filteredFlightsStore.total) {
      pagination.update(p => ({ ...p, page: p.page + 1 }));
    }
  }
</script>

<div class="pagination">
  <button on:click={prev} disabled={$pagination.page === 1}>
    ← Vorige
  </button>

  <span>Pagina {$pagination.page}</span>

  <button
    on:click={next}
    disabled={$pagination.page * $pagination.perPage >= $filteredFlightsStore.total}>
    Volgende →
  </button>
</div>

<style>
  .pagination {
    display: flex;
    justify-content: center;
    align-items: center;
    gap: 1rem;
    margin-top: 1rem;
  }
</style>
