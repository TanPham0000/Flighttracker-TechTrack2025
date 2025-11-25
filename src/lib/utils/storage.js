/**
 * storage.js
 * ----------
 * Kleine hulpfuncties om veilig met localStorage te werken.
 * Belangrijk: SvelteKit kan ook server-side renderen, dus we
 * moeten altijd checken of `window` bestaat.
 */

/**
 * Lees een waarde uit localStorage en parse deze als JSON.
 *
 * @param {string} key - De sleutel waaronder de data is opgeslagen.
 * @param {any} fallback - Waarde die teruggegeven wordt als er niets gevonden is of er een fout optreedt.
 * @returns {any}
 */
export function getStored(key, fallback = null) {
  if (typeof window === "undefined") return fallback;

  try {
    const raw = localStorage.getItem(key);
    return raw ? JSON.parse(raw) : fallback;
  } catch (error) {
    console.warn("Kon localStorage niet lezen voor key:", key, error);
    return fallback;
  }
}

/**
 * Sla een waarde op in localStorage als JSON.
 *
 * @param {string} key
 * @param {any} value
 */
export function setStored(key, value) {
  if (typeof window === "undefined") return;

  try {
    localStorage.setItem(key, JSON.stringify(value));
  } catch (error) {
    console.error("Kon niet opslaan in localStorage voor key:", key, error);
  }
}
