<script>
  export let label = "Button";
</script>

<button>
  {label}
  <slot />
</button>

<style>
  button {
    padding: 0.5rem 1rem;
    border-radius: 9999px;
    border: none;
    background: --primary;
    color: white;
    font-weight: 600;
    cursor: pointer;
  }

  button:hover {
      transition: background-color 0.2s;
    background-color: #0b2661;
  }
</style>
