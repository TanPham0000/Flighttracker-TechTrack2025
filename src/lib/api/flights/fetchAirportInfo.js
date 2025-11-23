export async function fetchAirportInfo(iata) {
  if (!iata) return null;

  const url = `https://api.aviationapi.com/v1/airports?iata=${iata}`;

  try {
    const res = await fetch(url);
    if (!res.ok) return null;

    const json = await res.json();
    return json[iata] || null;
  } catch (err) {
    console.error("Airport fetch error:", err);
    return null;
  }
}


export default fetchAirportInfo;