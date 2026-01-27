import { getJson } from "$lib/api/httpClient.js";

export async function GET() {
  try {
    // Fetch from ADSB.lol API (no CORS issues server-side)
    const url = "https://api.adsb.lol/v2/ladd";
    const data = await getJson(url);

    return new Response(JSON.stringify(data), {
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