<script>
  /**
   * Button.svelte
   * --------------
   * Eenvoudige, herbruikbare knop.
   *
   * Props:
   *  - label: tekst in de knop
   *  - type: HTML type attribuut ("button" | "submit" | "reset")
   *  - variant: stijlvariant ("primary" | "secondary")
   */

  export let label = "Knop";
  export let type = "button";
  export let variant = "primary";
</script>

<button class={`btn ${variant}`} type={type}>
  {#if $$slots.default}
    <slot />
  {:else}
    {label}
  {/if}
</button>

<style>
  .btn {
    padding: 0.5rem 1rem;
    border-radius: 999px;
    border: none;
    cursor: pointer;
    font-size: 0.9rem;
    font-weight: 500;
  }

  .primary {
    background: #2563eb;
    color: white;
  }

  .secondary {
    background: #e5e7eb;
    color: #111827;
  }

  .btn:disabled {
    opacity: 0.5;
    cursor: default;
  }
</style>
