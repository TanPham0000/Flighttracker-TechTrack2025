<script>
    let reg = "PH-BVA";
    let photos = [];
  
    async function load() {
      const res = await fetch(`https://api.planespotters.net/pub/photos/reg/${reg}`);
      const json = await res.json();
      photos = json.photos || [];
    }
  </script>
  
  <h1>Planespotter API test</h1>
  
  <input bind:value={reg} />
  <button on:click={load}>Load</button>
  
  {#if photos.length === 0}
    <p>No photos found.</p>
  {:else}
    {#each photos as p}
      <img src={p.thumbnail_large.src} alt="plane" width="200" />
    {/each}
  {/if}
  