import fetchActiveFlights from "$lib/api/flights/fetchActiveFlights.js";

export async function GET() {
  try {
    const data = await fetchActiveFlights();
    return new Response(JSON.stringify(data), {
      headers: { 
        "Content-Type": "application/json",
        "Cache-Control": "public, max-age=60"
      }
    });

  } catch (err) {
    console.error(err); // server console only (OK)
    const message = err instanceof Error ? err.message : "Onbekende serverfout";
    return new Response(JSON.stringify({ error: message }), {
      status: 500,
      headers: { "Content-Type": "application/json" }
    });
  }
}
