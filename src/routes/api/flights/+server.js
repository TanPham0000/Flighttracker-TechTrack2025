export async function GET() {
  try {
    const response = await fetch("https://opensky-network.org/api/states/all");
    const data = await response.json();

    // OpenSky gebruikt .states in plaats van .ac
    const rawStates = data.states || [];
    const mappedPlanes = rawStates.map((s) => ({
      hex: s[0],
      flight: s[1]?.trim(),
      r: s[0], // OpenSky metadata endpoint gebruikt hex vaak als reg fallback
      t: null, // OpenSky states geeft geen type (moet via metadata API)
      lat: s[6],
      lon: s[5],
      alt_baro: s[7],
      gs: s[9],
      track: s[10]
    }));

    return new Response(JSON.stringify({ ac: mappedPlanes, total: mappedPlanes.length }), {
      headers: {
        "Content-Type": "application/json",
        "Cache-Control": "public, max-age=60"
      }
    });
  } catch (err) {
    console.error(err);
    const message = err instanceof Error ? err.message : "Unknown server error";
    return new Response(JSON.stringify({ error: message }), {
      status: 500,
      headers: { "Content-Type": "application/json" }
    });
  }
}
