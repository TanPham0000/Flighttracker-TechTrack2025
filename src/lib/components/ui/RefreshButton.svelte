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

  button {
    margin-top: 10px;
    padding: 0.5rem 1rem;
    border-radius: 0.5rem;
    border: 1px solid #3b82f6;
    background-color: #3b82f6;
    color: white;
    font-weight: bold;
    cursor: pointer;
  }

  button:hover {
    background-color: #1c4fbd;
    border-color: #2563eb;
  } 
  p {
    margin: 0;
  }
</style>