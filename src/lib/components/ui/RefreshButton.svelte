<script>
  /**
   * Toont laatste update tijd en een knop om nieuwe data op te halen.
   * Stuurt een 'refresh' event omhoog; de pagina handelt de fetch af.
   */
  import { createEventDispatcher } from "svelte";

  export let lastUpdate = null;

  const dispatch = createEventDispatcher();

  // Formatteer timestamp naar leesbare string
  function formatTimestamp(timestamp) {
    if (!timestamp) return "Nog nooit geladen";

    return new Date(timestamp).toLocaleString("nl-NL", {
      dateStyle: "medium",
      timeStyle: "short"
    });
  }

  // Stuurt het refresh-event naar de parent (pagina)
  function handleRefresh() {
    dispatch("refresh");
  }
</script>

<section class="refresh-box">
  <p>
    <strong>Laatste update:</strong>
    {formatTimestamp(lastUpdate)}
  </p>

  <button aria-label="Ververs data" on:click={handleRefresh}>
    Ververs data
  </button>
</section>

<style>
  .refresh-box {
    padding: 0.75rem 1rem;
    border-radius: 0.75rem;
    background: var(--button-color, #eef2ff);
    max-width: 350px;
    display: flex;
    flex-direction: column;
    gap: 0.75rem;
  }

  p {
    margin: 0;
  }
</style>
