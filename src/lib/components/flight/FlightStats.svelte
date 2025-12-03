<script>
  /**
   * FlightStats.svelte
   * -------------------
   * Toont eenvoudige statistieken op basis van alle vluchten in flightsStore.
   * Bijv:
   *  - totaal aantal vluchten
   *  - aantal per status (en-route, landed, scheduled, etc.)
   */

  import { flightsStore } from "$lib/utils/flights.js";

  $: flights = $flightsStore;
  $: total = flights.length;

  $: statusCounts = flights.reduce((acc, flight) => {
    const status = flight.status || "unknown";
    acc[status] = (acc[status] || 0) + 1;
    return acc;
  }, {});
</script>

<section class="stats">
  <div class="header">
    <svg class="icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
      <path d="M3 3v18h18"/>
      <path d="M18 7l-5 5-4-4-3 3"/>
    </svg>
    <h2>Statistieken</h2>
  </div>

  <div class="total-card">
    <div class="total-label">Totaal vluchten</div>
    <div class="total-value">{total.toLocaleString('nl-NL')}</div>
  </div>

  {#if Object.keys(statusCounts).length > 0}
    <div class="status-section">
      <h3>Per status</h3>
      <ul class="status-list">
        {#each Object.entries(statusCounts) as [status, count]}
          <li class="status-item">
            <span class="status-name">{status}</span>
            <span class="status-count">{count}</span>
          </li>
        {/each}
      </ul>
    </div>
  {/if}
</section>

<style>
  .stats {
    padding: 1.5rem;
    border-radius: var(--radius-md);
    background: var(--color-bg-glass);
    backdrop-filter: blur(16px) saturate(180%);
    box-shadow: 
      0 4px 16px rgba(0, 0, 0, 0.2),
      0 0 0 1px rgba(255, 255, 255, 0.1);
    border: 1px solid rgba(255, 255, 255, 0.1);
    max-width: fit-content;
    min-width: 280px;
  }

  .header {
    display: flex;
    align-items: center;
    gap: 0.75rem;
    margin-bottom: 1.5rem;
  }

  .icon {
    width: 24px;
    height: 24px;
    color: var(--color-accent);
  }

  h2 {
    margin: 0;
    font-size: 1.25rem;
    font-weight: 600;
  }

  .total-card {
    background: linear-gradient(135deg, rgba(96, 165, 250, 0.1) 0%, rgba(59, 130, 246, 0.1) 100%);
    border: 1px solid rgba(96, 165, 250, 0.2);
    border-radius: var(--radius-md);
    padding: 1.25rem;
    margin-bottom: 1.5rem;
    text-align: center;
  }

  .total-label {
    font-size: 0.875rem;
    color: var(--color-text-muted);
    text-transform: uppercase;
    letter-spacing: 0.5px;
    margin-bottom: 0.5rem;
    font-weight: 500;
  }

  .total-value {
    font-size: 2rem;
    font-weight: 700;
    color: var(--color-accent);
    line-height: 1;
  }

  .status-section {
    margin-top: 1.5rem;
  }

  h3 {
    font-size: 0.875rem;
    text-transform: uppercase;
    letter-spacing: 0.5px;
    color: var(--color-text-muted);
    margin: 0 0 0.75rem 0;
    font-weight: 600;
  }

  .status-list {
    list-style: none;
    padding: 0;
    margin: 0;
    display: flex;
    flex-direction: column;
    gap: 0.5rem;
  }

  .status-item {
    display: flex;
    justify-content: space-between;
    align-items: center;
    padding: 0.625rem 0.875rem;
    background: rgba(255, 255, 255, 0.03);
    border-radius: var(--radius-sm);
    font-size: 0.875rem;
  }

  .status-name {
    color: var(--color-text-secondary);
    text-transform: capitalize;
  }

  .status-count {
    color: var(--color-text-primary);
    font-weight: 600;
    background: rgba(96, 165, 250, 0.2);
    padding: 0.25rem 0.625rem;
    border-radius: 12px;
    font-size: 0.75rem;
  }
</style>
