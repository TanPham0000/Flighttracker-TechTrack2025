// src/lib/config/apiKey.js
// Centrale plek voor API-sleutels, zodat alle fetch-functies dezelfde import gebruiken.
export const VITE_AIRLABS_API_KEY = import.meta.env.VITE_AIRLABS_API_KEY;

// Optioneel object als je liever via apiKey.airlabs leest.
export const apiKey = {
  airlabs: VITE_AIRLABS_API_KEY
};

