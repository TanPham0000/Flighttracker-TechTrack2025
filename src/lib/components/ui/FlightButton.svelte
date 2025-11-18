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
    background: #2563eb;
    color: white;
    font-weight: 600;
    cursor: pointer;
  }

  button:hover {
    opacity: 0.9;
  }
</style>
