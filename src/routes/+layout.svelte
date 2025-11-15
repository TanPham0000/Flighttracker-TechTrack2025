<script>
  // Geen logica hier, alleen layout.
</script>

<header>
  <h1>FlightTracker</h1>
</header>

<main>
  <slot />
</main>

<style>
  header {
    padding: 1rem;
    text-align: center;
    background: #f3f4f6;
  }

  main {
    min-height: 80vh;
    padding: 2rem;
  }

  h1 {
    margin: 0;
  }
</style>
