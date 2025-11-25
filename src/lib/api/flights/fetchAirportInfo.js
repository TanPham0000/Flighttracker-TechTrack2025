// -----------------------------------------
// fetchAirportInfo.js (AviationAPI)
// Haalt gedetailleerde info op over een luchthaven via IATA code
// -----------------------------------------

export default async function fetchAirportInfo(iata) {
  if (!iata) return null;

  const url = `https://api.aviationapi.com/v1/airports?apt=${iata}`;

  const res = await fetch(url);
  const json = await res.json();

  return json[iata] || null;
}
