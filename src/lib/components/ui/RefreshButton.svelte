<script>
  /**
   * Toont laatste update tijd en een knop om nieuwe data op te halen.
   * Stuurt een 'refresh' event omhoog; de pagina handelt de fetch af.
   */
  import { createEventDispatcher } from "svelte";

  /** @type {string | null} */
  export let lastUpdate = null;
  export let loading = false;

  const dispatch = createEventDispatcher();

  // Formatteer timestamp naar leesbare string
  function formatTimestamp(timestamp) {
    if (!timestamp) return "Nog nooit geladen";

    const date = new Date(timestamp);
    const now = new Date();
    const diffMs = now - date;
    const diffMins = Math.floor(diffMs / 60000);

    if (diffMins < 1) return "Zojuist";
    if (diffMins < 60) return `${diffMins} minuten geleden`;
    
    return date.toLocaleString("nl-NL", {
      dateStyle: "medium",
      timeStyle: "short"
    });
  }

  // Stuurt het refresh-event naar de parent (pagina)
  function handleRefresh() {
    if (!loading) {
      dispatch("refresh");
    }
  }
</script>

<section class="refresh-box">
  <div class="update-info">
    <svg class="icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
      <circle cx="12" cy="12" r="10"/>
      <polyline points="12 6 12 12 16 14"/>
    </svg>
    <div class="update-text">
      <p class="label">Laatste update</p>
      <p class="timestamp">{formatTimestamp(lastUpdate)}</p>
    </div>
  </div>

  <button 
    aria-label="Ververs data" 
    on:click={handleRefresh}
    disabled={loading}
    class:loading
  >
    {#if loading}
      <svg class="spinner" viewBox="0 0 24 24">
        <circle cx="12" cy="12" r="10" stroke="currentColor" stroke-width="2" fill="none" stroke-dasharray="32" stroke-dashoffset="32">
          <animate attributeName="stroke-dasharray" dur="2s" values="0 32;16 16;0 32;0 32" repeatCount="indefinite"/>
          <animate attributeName="stroke-dashoffset" dur="2s" values="0;-16;-32;-32" repeatCount="indefinite"/>
        </circle>
      </svg>
      Laden...
    {:else}
      <svg class="refresh-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
        <polyline points="23 4 23 10 17 10"/>
        <polyline points="1 20 1 14 7 14"/>
        <path d="M3.51 9a9 9 0 0 1 14.85-3.36L23 10M1 14l4.64 4.36A9 9 0 0 0 20.49 15"/>
      </svg>
      Ververs data
    {/if}
  </button>
</section>

<style>
  .refresh-box {
    display: flex;
    flex-direction: column;
    gap: 1rem;
  }

  .update-info {
    display: flex;
    align-items: center;
    gap: 0.75rem;
  }

  .icon {
    width: 20px;
    height: 20px;
    color: var(--color-accent);
    flex-shrink: 0;
  }

  .update-text {
    flex: 1;
  }

  .label {
    font-size: 0.75rem;
    color: var(--color-text-muted);
    text-transform: uppercase;
    letter-spacing: 0.5px;
    margin: 0 0 0.25rem 0;
    font-weight: 500;
  }

  .timestamp {
    font-size: 0.9rem;
    color: var(--color-text-primary);
    margin: 0;
    font-weight: 500;
  }

  button {
    width: 100%;
    padding: 0.75rem 1.25rem;
    border-radius: var(--radius-md);
    border: none;
    background: linear-gradient(135deg, var(--color-accent) 0%, var(--color-accent-hover) 100%);
    color: white;
    font-weight: 600;
    font-size: 0.95rem;
    cursor: pointer;
    transition: all 0.2s ease;
    display: flex;
    align-items: center;
    justify-content: center;
    gap: 0.5rem;
    box-shadow: 0 4px 12px rgba(96, 165, 250, 0.3);
  }

  button:hover:not(:disabled) {
    transform: translateY(-2px);
    box-shadow: 0 6px 20px rgba(96, 165, 250, 0.4);
    background: linear-gradient(135deg, var(--color-accent-hover) 0%, #2563eb 100%);
  }

  button:active:not(:disabled) {
    transform: translateY(0);
  }

  button:disabled {
    opacity: 0.7;
    cursor: not-allowed;
  }

  .refresh-icon {
    width: 18px;
    height: 18px;
    transition: transform 0.3s ease;
  }

  button:hover:not(:disabled) .refresh-icon {
    transform: rotate(180deg);
  }

  .spinner {
    width: 18px;
    height: 18px;
    animation: spin 1s linear infinite;
  }

  @keyframes spin {
    from { transform: rotate(0deg); }
    to { transform: rotate(360deg); }
  }
</style>