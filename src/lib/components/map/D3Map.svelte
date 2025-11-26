<script>
  /**
   * Globe Visualization Component
   * ------------------------------
   * Deze component tekent een 3D-achtige wereldbol met een orthographic map projection.
   * Bovenop de bol worden actieve vluchten (coördinaten uit AirLabs API) geplaatst als rode stippen.
   *
   * Features:
   *  Orthographic globe (bovenste helft zichtbaar, achterkant verborgen)
   *  Drag-to-rotate
   *  Zoom-to-scale
   *  Dynamische puntgrootte
   *  Clipping (stip zichtbaar alleen als op voorkant globe)
   */

  import { onMount, onDestroy } from "svelte";
  import { flightsStore } from "$lib/utils/flights.js"; // bevat actieve vluchten
  import * as d3 from "d3";                              // D3 voor projectie, svg en interactie
  import { feature } from "topojson-client";             // Landen uit topojson

  // Houdt referentie naar het DOM-element
  let container;

  // Data & D3 state
  let flights = [];
  let svg;
  let projection;
  let path;
  let flightsLayer;
  let selectedFlight;

  let globeReady = false; 

  // Begin rotatie en zichtbare schaal van de globe
  let currentRotation = [0, -20]; // λ (lon), φ (lat)
  let currentScale = 170;         // default zoom factor

  /**
   * Subscription op flightsStore
   * ----------------------------
   * Iedere keer dat nieuwe vluchtdata binnenkomt:
   *  - update lokale flights variabele
   *  - herteken vluchten op de globe
   */
  const unsubscribe = flightsStore.subscribe((value) => {
    flights = value || [];
    updateFlights();
  });

  onDestroy(unsubscribe);

  // ===========================================================
  // INIT: Globe tekenen zodra component in DOM staat
  // ===========================================================

  onMount(async () => {
    const width = 600;
    const height = 600;

    // Begin met het aanmaken van een SVG canvas
    svg = d3
      .select(container)
      .append("svg")
      .attr("viewBox", `0 0 ${width} ${height}`);

    /**
     * D3 Orthographic Projection
     * --------------------------
     * - Lijkt op een 3D globe
     * - Rotate werkt alsof je de aarde draait
     * - clipAngle(90) zorgt ervoor dat enkel de voorkant zichtbaar is
     */
    projection = d3.geoOrthographic()
      .scale(currentScale)
      .translate([width / 2, height / 2])
      .rotate(currentRotation)
      .clipAngle(90); // zorgt dat landen aan achterkant niet getekend worden

    path = d3.geoPath(projection);

    // Groepen voor globe en vluchten
    const globeLayer = svg.append("g");
    flightsLayer = svg.append("g");

    // ---------------------------------------------------------
    // OCEAAN
    // ---------------------------------------------------------
    globeLayer.append("circle")
      .attr("cx", width / 2)
      .attr("cy", height / 2)
      .attr("r", currentScale)
      .attr("fill", "#2a2a2b");

    // ---------------------------------------------------------
    // LANDEN binnenhalen en tekenen
    // ---------------------------------------------------------
    const worldRes = await fetch("https://unpkg.com/world-atlas@2/countries-110m.json");
    const worldJson = await worldRes.json();
    const countries = feature(worldJson, worldJson.objects.countries);

    globeLayer.selectAll(".country")
      .data(countries.features)
      .enter()
      .append("path")
      .attr("d", path)
      .attr("fill", "#e0ffe0")
      .attr("stroke", "#8ad88a")
      .attr("stroke-width", 1);

    // ---------------------------------------------------------
    // Drag rotate globe
    // ---------------------------------------------------------
    svg.call(
      d3.drag().on("drag", (event) => {
        const sensitivity = 0.25;
        currentRotation[0] += event.dx * sensitivity;
        currentRotation[1] -= event.dy * sensitivity;
        projection.rotate(currentRotation);
        redrawGlobe();
      })
    );

    // ---------------------------------------------------------
    // Zoom schaal globe
    // ---------------------------------------------------------
    svg.call(
      d3.zoom().on("zoom", (event) => {
        const newScale = 170 * event.transform.k;

        // Limieten zodat globe niet te klein/groot wordt
        currentScale = Math.max(30, Math.min(newScale, 900));

        projection.scale(currentScale);
        redrawGlobe();
      })
    );

    globeReady = true;
    updateFlights();
  });

  // ===========================================================
  // Globe hertekenen (landen en bol)
  // ===========================================================
  function redrawGlobe() {
    svg.selectAll("path").attr("d", path);

    // oceaan cirkel opnieuw schalen
    svg.select("circle").attr("r", currentScale);

    updateFlights();
  }

  // ===========================================================
  // Helper: Bepaal of vliegtuig zichtbaar is op de globe
  // ===========================================================
  function isPointVisible(lon, lat) {
    /**
     * d3.geoDistance vergelijkt twee punten op basis van grootcirkel-afstand.
     *  - Als de afstand > pie/2 (90°), ligt het punt op de achterkant.
     */

    const rotate = projection.rotate();

    // centrum van de globe (voor de huidige rotatie)
    const center = [-rotate[0], -rotate[1]];

    const distance = d3.geoDistance([lon, lat], center);

    return distance < Math.PI / 2;
  }

  // ===========================================================
  // Vluchten tekenen
  // ===========================================================
  function updateFlights() {
    if (!globeReady || !flightsLayer) return;

    // Dynamische puntgrootte zodat ze niet huge worden bij inzoomen
    const size = Math.max(2, 3 * (170 / currentScale));

    // Filter alleen vluchten met echte GPS coordinaten
    const flightsWithCoords = flights.filter(
      f => typeof f.lat === "number" && typeof f.lng === "number"
    );

    // Data-binding voor alle stippen
    const points = flightsLayer
      .selectAll("circle.flight-point")
      .data(flightsWithCoords, d => d.flight_iata || d.flight_icao);

    points.exit().remove(); // verwijder oude elementen

    // ENTER nieuwe punten
    const enter = points.enter()
      .append("circle")
      .attr("class", "flight-point")
      .attr("fill", "#ff3b3b")
      .attr("stroke", "white")
      .attr("stroke-width", 1)
      .on("mouseover", function () {
        // Grote gele highlight bij hover
        d3.select(this).attr("fill", "yellow").attr("r", 6);
      })
      .on("mouseout", function () {
        d3.select(this).attr("fill", "#ff3b3b").attr("r", size);
      })
      .on("click", (_, d) => {
  selectedFlightStore.set(d);  // ⬅️ Belangrijk
});

    // MERGE (update bestaande + nieuwe)
    enter.merge(points)
      .attr("r", size)
      .attr("cx", d => projection([d.lng, d.lat])[0])
      .attr("cy", d => projection([d.lng, d.lat])[1])
      .style("display", d => isPointVisible(d.lng, d.lat) ? null : "none");
      
  }
</script>

<div class="globe-wrapper" bind:this={container}></div>

<style>
  .globe-wrapper {
    width: 100%;
    max-width: 100%;
    margin: 0 auto;
    overflow: hidden;
  }

  .flight-point {
    transition: all 0.2s ease;
    cursor: pointer;
  }

</style>
