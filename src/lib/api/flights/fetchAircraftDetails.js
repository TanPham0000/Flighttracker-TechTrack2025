import { VITE_AIRLABS_API_KEY } from "$lib/config/apiKey.js";

export default async function fetchAircraftDetails(registration) {
  if (!registration) return null;

  const url = `https://airlabs.co/api/v9/aircraft?api_key=${VITE_AIRLABS_API_KEY}&reg_number=${registration}`;

  try {
    const res = await fetch(url);
    if (!res.ok) return null;

    const json = await res.json();

    if (!json.response || !json.response.length) return null;

    const ac = json.response[0];

    return {
      model: ac.model,
      manufacturer: ac.manufacturer,
      type: ac.type,
      engines: ac.engines,
      reg_number: ac.reg_number,
      serial: ac.serial_number,
      age: ac.age,
      image: ac.image?.thumbnail,
    };
  } catch (err) {
    console.error("fetchAircraftDetails error:", err);
    return null;
  }
}