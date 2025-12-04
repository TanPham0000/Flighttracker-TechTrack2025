// Very simple Planespotters fetcher (for testing)

export default async function fetchPlaneImages(reg) {
  if (!reg) return [];

  const url = `https://api.planespotters.net/pub/photos/reg/${reg}`;

  const res = await fetch(url);
  const json = await res.json();

  return json.photos || [];
}
