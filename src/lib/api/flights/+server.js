// src/routes/api/flights/+server.js
export async function GET() {
    try {
        const response = await fetch('https://opensky-network.org/api/states/all');
        const data = await response.json();
        
        // OpenSky gebruikt .states in plaats van .ac
        const rawStates = data.states || [];

        // Map de OpenSky array naar een object structuur
        const mappedPlanes = rawStates.map(s => ({
            hex: s[0],
            flight: s[1]?.trim(),
            r: s[0], // OpenSky metadata endpoint gebruikt hex vaak als reg fallback
            t: null, // OpenSky states geeft geen type (moet via metadata API)
            lat: s[6],
            lon: s[5],
            alt_baro: s[7],
            gs: s[9],
            track: s[10]
        }));

        return json({ ac: mappedPlanes, total: mappedPlanes.length });
    } catch (err) {
        return json({ error: err.message }, { status: 500 });
    }
}