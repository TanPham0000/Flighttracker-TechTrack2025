import fetchActiveFlights from "$lib/api/flights/fetchActiveFlights.js";
import fetchAirlinesBatch from "$lib/api/flights/fetchAirlineInfo.js";

export async function GET() {
  try {
    const data = await fetchActiveFlights();

    const flights = Array.isArray(data?.response) ? data.response : [];

    // Verzamel alle airline ICAO-codes voor batch lookup
    const icaoList = flights
      .map((f) => f.airline_icao)
      .filter((code) => typeof code === "string" && code.length > 0);

    let airlineMap = {};
    if (icaoList.length > 0) {
      try {
        airlineMap = await fetchAirlinesBatch(icaoList);
      } catch (err) {
        console.error("Fout bij ophalen airline namen:", err);
      }
    }

    // Verrijk elke vlucht met airline_name en airline_logo
    const enrichedResponse = flights.map((flight) => {
      const code = flight.airline_icao;
      const airlineInfo = code ? airlineMap[code] : undefined;

      return {
        ...flight,
        airline_name:
          airlineInfo?.name ?? flight.airline_name ?? null,
        airline_logo:
          airlineInfo?.logo ?? flight.airline_logo ?? null,
      };
    });

    const enrichedData = {
      ...data,
      response: enrichedResponse,
    };

    return new Response(JSON.stringify(enrichedData), {
      headers: {
        "Content-Type": "application/json",
        "Cache-Control": "public, max-age=60",
      },
    });
  } catch (err) {
    console.error(err); // server console only (OK)
    const message = err instanceof Error ? err.message : "Onbekende serverfout";
    return new Response(JSON.stringify({ error: message }), {
      status: 500,
      headers: { "Content-Type": "application/json" },
    });
  }
}
