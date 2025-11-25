// -----------------------------------------
// fetchAircraftDetails.js
// Wordt alleen gebruikt bij één geselecteerde vlucht
// -----------------------------------------

import { VITE_AIRLABS_API_KEY } from "$lib/config/apiKey.js";

export default async function fetchAircraftDetails(reg) {
  if (!reg) return null;

  const url = `https://airlabs.co/api/v9/aircraft?api_key=${VITE_AIRLABS_API_KEY}&reg_number=${reg}`;

  const res = await fetch(url);
  const json = await res.json();

  return json?.response?.[0] || null;
}
