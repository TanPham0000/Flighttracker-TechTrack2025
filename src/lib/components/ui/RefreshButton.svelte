<script>
  /**
   * RefreshButton.svelte
   * -----------------------------------------
   * Toont:
   *  - De datum/tijd van de laatste data refresh
   *  - Een knop om nieuwe data op te halen
   *
   * Props:
   *  - lastUpdate  (timestamp, ms)
   *
   * Events:
   *  - refresh → roept een parent-functie aan om data opnieuw te laden
   */

  import { createEventDispatcher } from "svelte";
  import fetchFlights from "$lib/api/flights/fetchFlights.js";

  export let lastUpdate = null;

  const dispatch = createEventDispatcher();

  /**
   * Format timestamp naar leesbare string.
   */

  function formatTimestamp(timestamp) {
    if (!timestamp) return "Nog nooit geladen";

    return new Date(timestamp).toLocaleString("nl-NL", {
      dateStyle: "medium",
      timeStyle: "short"

    });

  }

  /**
   * Stuurt het refresh-event naar de parent (pagina).
   */
  function handleRefresh() {
    dispatch("refresh");
    fetchFlights();
  }
</script>

<section class="refresh-box">
  <p>
    <strong>Laatste update:</strong>
    {formatTimestamp(lastUpdate)}
  </p>

  <button label="🔄 Ververs data" on:click={handleRefresh}>🔄 Ververs data</button>
</section>

<style>
  .refresh-box {
    padding: 0.75rem 1rem;
    border-radius: 0.75rem;
    background: #f3f4f6;
    max-width: 350px;
    display: flex;
    flex-direction: column;
    gap: 0.75rem;
  }

  p {
    margin: 0;
  }
</style>
