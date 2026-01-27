const EARTH_RADIUS_NM = 3440.065;

function toRadians(deg) {
  return (deg * Math.PI) / 180;
}

function distanceNm(lat1, lon1, lat2, lon2) {
  const dLat = toRadians(lat2 - lat1);
  const dLon = toRadians(lon2 - lon1);
  const a =
    Math.sin(dLat / 2) ** 2 +
    Math.cos(toRadians(lat1)) * Math.cos(toRadians(lat2)) * Math.sin(dLon / 2) ** 2;
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  return EARTH_RADIUS_NM * c;
}

export async function GET({ url }) {
  try {
    const response = await fetch("https://opensky-network.org/api/states/all");
    const data = await response.json();

    // OpenSky gebruikt .states in plaats van .ac
    const rawStates = data.states || [];

    const lat = Number(url.searchParams.get("lat"));
    const lon = Number(url.searchParams.get("lon"));
    const radiusNm = Number(url.searchParams.get("radius") || "250");

    if (!Number.isFinite(lat) || !Number.isFinite(lon)) {
      return new Response(JSON.stringify({ ac: [], total: 0, radius_nm: null }), {
        headers: { "Content-Type": "application/json" }
      });
    }

    const filteredStates = rawStates.filter((s) => {
      const sLat = Number(s[6]);
      const sLon = Number(s[5]);
      if (!Number.isFinite(sLat) || !Number.isFinite(sLon)) return false;
      return distanceNm(lat, lon, sLat, sLon) <= radiusNm;
    });

    const mappedPlanes = filteredStates.map((s) => ({
      hex: s[0],
      flight: s[1]?.trim(),
      country: s[2],
      r: s[0], // OpenSky metadata endpoint gebruikt hex vaak als reg fallback
      t: null, // Tijdstip niet beschikbaar in deze endpoint
      lat: s[6],
      lon: s[5],
      alt_baro: s[7],
      gs: s[9],
      track: s[10]
    }));

    return new Response(
      JSON.stringify({
        ac: mappedPlanes,
        total: mappedPlanes.length,
        radius_nm: radiusNm
      }),
      {
        headers: {
          "Content-Type": "application/json",
          "Cache-Control": "public, max-age=60"
        }
      }
    );
  } catch (err) {
    console.error(err);
    const message = err instanceof Error ? err.message : "Unknown server error";
    return new Response(JSON.stringify({ error: message }), {
      status: 500,
      headers: { "Content-Type": "application/json" }
    });
  }
}
