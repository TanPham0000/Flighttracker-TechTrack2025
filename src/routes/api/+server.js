import fetchActiveFlights from "$lib/api/flights/fetchActiveFlights.js";

export async function GET() {
  try {
    const flights = await fetchActiveFlights(100);
    return new Response(JSON.stringify(flights), {
      headers: { "Content-Type": "application/json" }
    });

  } catch (err) {
    console.error(err); // server console only (OK)
    const message = err instanceof Error ? err.message : "Onbekende serverfout";
    return new Response(JSON.stringify({ error: message }), {
      status: 500
    });
  }
}
