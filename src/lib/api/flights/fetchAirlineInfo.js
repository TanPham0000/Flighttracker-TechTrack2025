  import { VITE_AIRLABS_API_KEY } from "$lib/config/apiKey.js";

  export default async function fetchAirlineInfo(icao) {
    if (!icao) return null;

    const url = `https://airlabs.co/api/v9/airlines?api_key=${VITE_AIRLABS_API_KEY}&icao_code=${icao}`;

    try {
      const res = await fetch(url);
      if (!res.ok) return null;

      const json = await res.json();

      if (!json.response || !json.response.length) return null;

      const al = json.response[0];

      return {
        name: al.name,
        fleet: al.fleet_size,
        logo: al.logo_url,
        callsign: al.callsign,
        country: al.country_name,
      };
    } catch (err) {
      console.error("fetchAirlineInfo error:", err);
      return null;
    }
  }