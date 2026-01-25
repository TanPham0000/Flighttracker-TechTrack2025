import { getJson } from "$lib/api/httpClient.js";

export async function GET() {
  try {
    // Fetch from OpenSky Network API (no CORS issues server-side)
    const url = "https://opensky-network.org/api/states/all";
    const data = await getJson(url);

    // Transform OpenSky data to ADSB.lol-like format
    const ac = data.states.map(state => ({
      hex: state[0],
      flight: state[1],
      lat: state[6],
      lon: state[5],
      alt_baro: state[7],
      gs: state[9],
      track: state[10],
      seen: Date.now() / 1000 - state[4],
      r: state[0], // approximate registration
      t: null, // aircraft type not available
    }));

    return new Response(JSON.stringify({ ac }), {
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