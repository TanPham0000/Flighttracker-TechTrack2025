/**
 * Safe getter voor localStorage.
 * SvelteKit kan server-side renderen, dus we mogen nooit direct localStorage aanroepen
 * tenzij we checken of window bestaat.
 * @param {string} key - localStorage sleutel
 * @param {any} fallback - standaardwaarde als key niet bestaat
 * @returns {any}
 */
export function getStored(key, fallback = null) {
  if (typeof window === "undefined") return fallback;

  try {
    const value = localStorage.getItem(key);
    return value ? JSON.parse(value) : fallback;
  } catch (error) {
    return fallback;
  }
}

/**
 * Safe setter voor localStorage.
 * @param {string} key - localStorage sleutel
 * @param {any} value - waarde om op te slaan
 */
export function setStored(key, value) {
  if (typeof window === "undefined") return;

  try {
    localStorage.setItem(key, JSON.stringify(value));
  } catch (err) {
    console.error("Kon niet opslaan in localStorage:", err);
  }
}
