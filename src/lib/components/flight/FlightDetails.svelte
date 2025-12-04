<script>
  /**
   * FlightDetails.svelte
   * --------------------
   * Toont alle detailinformatie van de momenteel geselecteerde vlucht.
   *
   * Belangrijk:
   *  - Luistert naar `selectedFlightStore` (één actieve vlucht).
   *  - Haalt aanvullende informatie op bij externe APIs:
   *      * Airline details (naam, land, callsign, logo)
   *      * Aircraft details (model, fabrikant, leeftijd, motoren, image)
   *      * Vertrek- en aankomstluchthavens (stad, land, volledige naam)
   *      * Optioneel: vliegtuigfoto's via Planespotters
   *  - Gebruikt eenvoudige in‑memory caches (Maps) zodat we bij
   *    meerdere clicks op dezelfde vlucht niet onnodig opnieuw fetchen.
   */

  import { selectedFlightStore } from "$lib/utils/flights.js";

  import fetchAircraftDetails from "$lib/api/flights/fetchAircraftDetails.js";
  import fetchAirportInfo from "$lib/api/flights/fetchAirportInfo.js";
  import fetchAirlineDetails from "$lib/api/flights/fetchAirlineDetails.js";
  import fetchPlaneImages from "$lib/api/aircraft/fetchPlaneImages.js";

  // Caches voor reeds opgehaalde data (alleen voor deze sessie in memory)
  const aircraftCache = new Map();
  const airportCache = new Map();
  const airlineCache = new Map();
  const photosCache = new Map();

  // Reactieve state
  /** @type {any} */
  let flight = null;
  /** @type {any} */
  let aircraft = null;
  /** @type {any} */
  let airlineDetails = null;
  /** @type {any} */
  let depAirport = null;
  /** @type {any} */
  let arrAirport = null;

  let loadingAircraft = false;
  let loadingAirports = false;
  let loadingAirline = false;

  /** @type {any[]} */
  let planePhotos = [];
  let loadingPhotos = false;

  // ------------------------------------------------------------
  // Reageer op verandering in de selectedFlightStore
  // ------------------------------------------------------------
  $: flight = $selectedFlightStore;

  // Wanneer flight verandert laad details
  $: if (flight) {
    loadDetails(flight);
  } else {
    // Reset als er geen vlucht is geselecteerd
    aircraft = null;
    airlineDetails = null;
    depAirport = null;
    arrAirport = null;
    planePhotos = [];
  }

  /**
   * Haalt (asynchroon) alle aanvullende details voor een vlucht op.
   * - airlineDetails: via AirLabs /airlines endpoint
   * - aircraft: via AirLabs aircraft endpoint
   * - dep/arr airports: via AviationAPI
   * - planePhotos: via Planespotters
   *
   * @param {any} flight
   */
  async function loadDetails(flight) {
    if (!flight) return; // veiligheidscheck

    // ----- Airline Details -----
    const airlineKey = flight.airline_icao || flight.airline_iata;
    if (airlineKey) {
      if (airlineCache.has(airlineKey)) {
        airlineDetails = airlineCache.get(airlineKey);
      } else {
        loadingAirline = true;
        try {
          const result = await fetchAirlineDetails(flight.airline_icao, flight.airline_iata);
          airlineDetails = result;
          if (result) {
            airlineCache.set(airlineKey, result);
          }
        } catch (err) {
          console.error("Fout bij airline details:", err);
          airlineDetails = null;
        } finally {
          loadingAirline = false;
        }
      }
    } else {
      airlineDetails = null;
    }

    // ----- Aircraft -----
    const regNumber = flight.reg_number;
    if (regNumber && regNumber !== "—" && regNumber !== null) {
      if (aircraftCache.has(regNumber)) {
        aircraft = aircraftCache.get(regNumber);
      } else {
        loadingAircraft = true;
        try {
          const result = await fetchAircraftDetails(regNumber);
          aircraft = result;
          aircraftCache.set(regNumber, result);
        } catch (err) {
          console.error("Fout bij aircraft details:", err);
          aircraft = null;
        } finally {
          loadingAircraft = false;
        }
      }
    } else {
      aircraft = null;
    }

    // ----- Plane Photos (Planespotters) -----
    if (regNumber && regNumber !== "—" && regNumber !== null) {
      if (photosCache.has(regNumber)) {
        planePhotos = photosCache.get(regNumber);
      } else {
        loadingPhotos = true;
        try {
          const photos = await fetchPlaneImages(regNumber);
          planePhotos = Array.isArray(photos) ? photos : [];
          photosCache.set(regNumber, planePhotos);
        } catch (err) {
          console.error("Fout bij ophalen vliegtuigfoto's:", err);
          planePhotos = [];
        } finally {
          loadingPhotos = false;
        }
      }
    } else {
      planePhotos = [];
    }

    // ----- Departure Airport -----
    if (flight.dep_iata) {
      if (airportCache.has(flight.dep_iata)) {
        depAirport = airportCache.get(flight.dep_iata);
      } else {
        loadingAirports = true;
        try {
          const result = await fetchAirportInfo(flight.dep_iata);
          depAirport = result;
          airportCache.set(flight.dep_iata, result);
        } catch (err) {
          console.error("Fout bij departure airport:", err);
          depAirport = null;
        } finally {
          loadingAirports = false;
        }
      }
    } else {
      depAirport = null;
    }

    // ----- Arrival Airport -----
    if (flight.arr_iata) {
      if (airportCache.has(flight.arr_iata)) {
        arrAirport = airportCache.get(flight.arr_iata);
      } else {
        loadingAirports = true;
        try {
          const result = await fetchAirportInfo(flight.arr_iata);
          arrAirport = result;
          airportCache.set(flight.arr_iata, result);
        } catch (err) {
          console.error("Fout bij arrival airport:", err);
          arrAirport = null;
        } finally {
          loadingAirports = false;
        }
      }
    } else {
      arrAirport = null;
    }
  }
</script>

{#if !flight}
  <section class="details">
    <div class="empty-state">
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
        <path d="M21 16v-2l-8-5V3.5c0-.83-.67-1.5-1.5-1.5S10 2.67 10 3.5V9l-8 5v2l8-2.5V19l-2 1.5V21l3.5-1 3.5 1v-1.5L13 19v-5.5l8 2.5z"/>
      </svg>
      <h2>Geen vlucht geselecteerd</h2>
      <p>Klik op een vlucht in de lijst of op de globe om details te zien.</p>
    </div>
  </section>

{:else}

<section class="details">
  <!-- Titel -->
  <h2>
    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
      <path d="M21 16v-2l-8-5V3.5c0-.83-.67-1.5-1.5-1.5S10 2.67 10 3.5V9l-8 5v2l8-2.5V19l-2 1.5V21l3.5-1 3.5 1v-1.5L13 19v-5.5l8 2.5z"/>
    </svg>
    {flight.flight_iata || flight.flight_icao || "Vlucht"}
  </h2>
  
  <!-- Airline Section -->
  <section class="detail-section">
    <h3>Airline</h3>
    {#if loadingAirline}
      <p class="loading-text">Airline informatie laden...</p>
    {:else if airlineDetails || flight.airline_name}
      <div class="info-grid">
        <div class="info-row">
          <span class="info-label">Naam:</span>
          <span class="info-value">{airlineDetails?.name || flight.airline_name || "—"}</span>
        </div>
        {#if airlineDetails}
          {#if airlineDetails.iata_code}
            <div class="info-row">
              <span class="info-label">IATA Code:</span>
              <span class="info-value">{airlineDetails.iata_code}</span>
            </div>
          {/if}
          {#if airlineDetails.icao_code}
            <div class="info-row">
              <span class="info-label">ICAO Code:</span>
              <span class="info-value">{airlineDetails.icao_code}</span>
            </div>
          {/if}
          {#if airlineDetails.country_code}
            <div class="info-row">
              <span class="info-label">Land:</span>
              <span class="info-value">{airlineDetails.country_code}</span>
            </div>
          {/if}
          {#if airlineDetails.callsign}
            <div class="info-row">
              <span class="info-label">Callsign:</span>
              <span class="info-value">{airlineDetails.callsign}</span>
            </div>
          {/if}
        {:else}
          {#if flight.airline_iata}
            <div class="info-row">
              <span class="info-label">IATA Code:</span>
              <span class="info-value">{flight.airline_iata}</span>
            </div>
          {/if}
          {#if flight.airline_icao}
            <div class="info-row">
              <span class="info-label">ICAO Code:</span>
              <span class="info-value">{flight.airline_icao}</span>
            </div>
          {/if}
        {/if}
      </div>
      {#if airlineDetails?.logo_url || flight.airline_logo}
        <img src={airlineDetails?.logo_url || flight.airline_logo} alt="Airline logo" class="logo" />
      {/if}
    {:else}
      <p class="loading-text">Geen airline informatie beschikbaar</p>
    {/if}
  </section>

  <!-- Aircraft Section -->
  <section class="detail-section">
    <h3>Vliegtuig</h3>
    <div class="info-grid">
      {#if flight.reg_number && flight.reg_number !== "—"}
        <div class="info-row">
          <span class="info-label">Registratie:</span>
          <span class="info-value">{flight.reg_number}</span>
        </div>
      {/if}
      {#if flight.aircraft_icao}
        <div class="info-row">
          <span class="info-label">Aircraft ICAO:</span>
          <span class="info-value">{flight.aircraft_icao}</span>
        </div>
      {/if}
      {#if flight.aircraft_iata}
        <div class="info-row">
          <span class="info-label">Aircraft IATA:</span>
          <span class="info-value">{flight.aircraft_iata}</span>
        </div>
      {/if}
    </div>

    {#if loadingAircraft}
      <p class="loading-text">Vliegtuigdetails laden...</p>
    {:else if aircraft}
      <div class="info-grid">
        {#if aircraft.model}
          <div class="info-row">
            <span class="info-label">Model:</span>
            <span class="info-value">{aircraft.model}</span>
          </div>
        {/if}
        {#if aircraft.manufacturer}
          <div class="info-row">
            <span class="info-label">Fabrikant:</span>
            <span class="info-value">{aircraft.manufacturer}</span>
          </div>
        {/if}
        {#if aircraft.prod_line}
          <div class="info-row">
            <span class="info-label">Productielijn:</span>
            <span class="info-value">{aircraft.prod_line}</span>
          </div>
        {/if}
        {#if aircraft.age}
          <div class="info-row">
            <span class="info-label">Leeftijd:</span>
            <span class="info-value">{aircraft.age} jaar</span>
          </div>
        {/if}
        {#if aircraft.engines_count}
          <div class="info-row">
            <span class="info-label">Aantal motoren:</span>
            <span class="info-value">{aircraft.engines_count}</span>
          </div>
        {/if}
        {#if aircraft.engines_type}
          <div class="info-row">
            <span class="info-label">Motortype:</span>
            <span class="info-value">{aircraft.engines_type}</span>
          </div>
        {/if}
        {#if aircraft.serial_number}
          <div class="info-row">
            <span class="info-label">Serienummer:</span>
            <span class="info-value">{aircraft.serial_number}</span>
          </div>
        {/if}
      </div>
      {#if aircraft.image}
        <img src={aircraft.image} alt="Aircraft" class="plane-img" />
      {/if}
    {:else if flight.reg_number && flight.reg_number !== "—"}
      <p class="loading-text">Geen vliegtuigdetails beschikbaar voor {flight.reg_number}</p>
    {/if}
  </section>

  <!-- PlaneSpotters photos -->
  {#if flight.reg_number && flight.reg_number !== "—"}
    <section class="detail-section">
      <h3>Vliegtuigfoto's</h3>
      {#if loadingPhotos}
        <p class="loading-text">Foto's laden...</p>
      {:else if planePhotos.length > 0}
        <div class="plane-photo-gallery">
          {#each planePhotos.slice(0, 3) as photo}
            <img 
              src={photo.thumbnail_large?.src || photo.thumbnail?.src || photo.link} 
              alt={`Aircraft ${flight.reg_number}`}
              class="plane-gallery-img"
              loading="lazy"/>
          {/each}
        </div>
        {#if planePhotos.length > 3}
          <p class="photo-count">+{planePhotos.length - 3} meer foto's beschikbaar</p>
        {/if}
      {:else}
        <p class="loading-text">Geen foto's gevonden voor {flight.reg_number}</p>
      {/if}
    </section>
  {/if}

  <!-- Route Section -->
  <section class="detail-section">
    <h3>Route</h3>
    <div class="info-grid">
      <div class="info-row">
        <span class="info-label">Van:</span>
        <span class="info-value">{depAirport?.name || flight.dep_iata || "—"}</span>
      </div>
      {#if depAirport}
        {#if depAirport.city}
          <div class="info-row">
            <span class="info-label">Stad:</span>
            <span class="info-value">{depAirport.city}</span>
          </div>
        {/if}
        {#if depAirport.country}
          <div class="info-row">
            <span class="info-label">Land:</span>
            <span class="info-value">{depAirport.country}</span>
          </div>
        {/if}
      {/if}
      <div class="info-row">
        <span class="info-label">Naar:</span>
        <span class="info-value">{arrAirport?.name || flight.arr_iata || "—"}</span>
      </div>
      {#if arrAirport}
        {#if arrAirport.city}
          <div class="info-row">
            <span class="info-label">Stad:</span>
            <span class="info-value">{arrAirport.city}</span>
          </div>
        {/if}
        {#if arrAirport.country}
          <div class="info-row">
            <span class="info-label">Land:</span>
            <span class="info-value">{arrAirport.country}</span>
          </div>
        {/if}
      {/if}
    </div>
  </section>

  <!-- Live Flight Data Section -->
  <section class="detail-section">
    <h3>Live vluchtdata</h3>
    <div class="info-grid">
      <div class="info-row">
        <span class="info-label">Status:</span>
        <span class="info-value">{flight.status || "—"}</span>
      </div>
      {#if Number.isFinite(flight.alt)}
        <div class="info-row">
          <span class="info-label">Hoogte:</span>
          <span class="info-value">{Math.round(flight.alt).toLocaleString('nl-NL')} ft</span>
        </div>
      {/if}
      {#if Number.isFinite(flight.speed)}
        <div class="info-row">
          <span class="info-label">Snelheid:</span>
          <span class="info-value">{Math.round(flight.speed)} kts</span>
        </div>
      {/if}
      {#if Number.isFinite(flight.dir)}
        <div class="info-row">
          <span class="info-label">Heading:</span>
          <span class="info-value">{Math.round(flight.dir)}°</span>
        </div>
      {/if}
      {#if flight.updated}
        <div class="info-row">
          <span class="info-label">Laatste update:</span>
          <span class="info-value">{new Date(flight.updated * 1000).toLocaleString('nl-NL')}</span>
        </div>
      {/if}
    </div>
  </section>
</section>

{/if}

<style>
  .details {
    padding: 1.5rem;
    border-radius: var(--radius-md);
    background: var(--color-bg-glass);
    backdrop-filter: blur(16px) saturate(180%);
    box-shadow: 
      0 4px 16px rgba(0, 0, 0, 0.2),
      0 0 0 1px rgba(255, 255, 255, 0.1);
    border: 1px solid rgba(255, 255, 255, 0.1);
    max-height: 80vh;
    overflow-y: auto;
  }

  .empty-state {
    text-align: center;
    padding: 2rem 1rem;
    color: var(--color-text-muted);
  }

  .empty-state svg {
    width: 64px;
    height: 64px;
    margin: 0 auto 1rem;
    opacity: 0.5;
  }

  .empty-state h2 {
    font-size: 1.25rem;
    margin-bottom: 0.5rem;
    color: var(--color-text-secondary);
  }

  .empty-state p {
    font-size: 0.9rem;
    margin: 0;
  }

  h2 {
    font-size: 1.5rem;
    margin: 0 0 1.5rem 0;
    display: flex;
    align-items: center;
    gap: 0.5rem;
    color: var(--color-text-primary);
  }

  h3 {
    font-size: 1rem;
    margin: 1.5rem 0 0.75rem 0;
    color: var(--color-accent);
    font-weight: 600;
    text-transform: uppercase;
    letter-spacing: 0.5px;
    font-size: 0.875rem;
    padding-bottom: 0.5rem;
    border-bottom: 1px solid rgba(255, 255, 255, 0.1);
  }

  h3:first-of-type {
    margin-top: 0;
  }

  .info-row {
    display: flex;
    gap: 0.5rem;
    margin: 0.5rem 0;
    font-size: 0.9rem;
  }

  .info-label {
    font-weight: 600;
    color: var(--color-text-muted);
    min-width: 100px;
  }

  .info-value {
    color: var(--color-text-secondary);
    flex: 1;
  }

  .logo {
    max-width: 140px;
    margin: 0.75rem 0;
    border-radius: var(--radius-sm);
    box-shadow: 0 2px 8px rgba(0, 0, 0, 0.2);
  }

  .plane-img {
    max-width: 100%;
    border-radius: var(--radius-md);
    margin: 0.75rem 0;
    box-shadow: 0 4px 16px rgba(0, 0, 0, 0.3);
  }

  .plane-photo-gallery {
    display: grid;
    grid-template-columns: repeat(auto-fit, minmax(150px, 1fr));
    gap: 0.75rem;
    margin-top: 0.75rem;
  }

  .plane-gallery-img {
    width: 100%;
    height: auto;
    border-radius: var(--radius-sm);
    box-shadow: 0 2px 8px rgba(0, 0, 0, 0.2);
    cursor: pointer;
    transition: transform 0.2s ease, box-shadow 0.2s ease;
    object-fit: cover;
    aspect-ratio: 4/3;
  }

  .plane-gallery-img:hover {
    transform: scale(1.05);
    box-shadow: 0 4px 12px rgba(0, 0, 0, 0.3);
  }

  .photo-count {
    margin-top: 0.5rem;
    font-size: 0.8rem;
    color: var(--color-text-muted);
    font-style: italic;
  }

  .loading-text {
    color: var(--color-text-muted);
    font-style: italic;
    font-size: 0.875rem;
  }

  .detail-section {
    margin-bottom: 1.5rem;
    padding-bottom: 1.5rem;
    border-bottom: 1px solid rgba(255, 255, 255, 0.05);
  }

  .detail-section:last-child {
    border-bottom: none;
    margin-bottom: 0;
    padding-bottom: 0;
  }

  .info-grid {
    display: flex;
    flex-direction: column;
    gap: 0.5rem;
  }

  p {
    margin: 0.5rem 0;
  }
</style>
