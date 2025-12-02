// -------------------------------------------------
// httpClient.js
// Kleine helper om JSON van externe APIs op te halen
// met consistente error-afhandeling.
// -------------------------------------------------

/**
 * Doe een fetch en parse automatisch als JSON met
 * nette foutmeldingen.
 *
 * @param {string} url
 * @param {RequestInit} [options]
 * @returns {Promise<any>}
 */
export async function getJson(url, options = {}) {
  const res = await fetch(url, {
    // server-side fetch, geen CORS-issues in SvelteKit endpoints
    ...options
  });

  if (!res.ok) {
    // Probeer server body te lezen voor debug
    let extra = "";
    try {
      const text = await res.text();
      if (text) extra = ` - body: ${text.slice(0, 200)}`;
    } catch {
      // negeer parse fouten
    }
    throw new Error(`HTTP fout ${res.status} ${res.statusText}${extra}`);
  }

  try {
    return await res.json();
  } catch (err) {
    throw new Error("Kon response niet als JSON parsen");
  }
}


