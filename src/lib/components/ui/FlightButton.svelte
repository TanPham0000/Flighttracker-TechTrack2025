<script>
  export let label = "Button";
  import { flightsStore } from "$lib/utils/flights.js";  

  function handleClick() {
    // Voorbeeld: log de huidige vluchten in de console
    flightsStore.subscribe((flights) => {
      console.log("Huidige vluchten:", flights);
    })();
  }
</script>

<button on:click={handleClick}>
  {label}
  <slot />
</button>

<style>
  button {
    padding: 0.5rem 1rem;
    border-radius: 9999px;
    border: none;
    background: #2563eb;
    color: white;
    font-weight: 600;
    cursor: pointer;
  }

  button:hover {
    opacity: 0.9;
  }
</style>
