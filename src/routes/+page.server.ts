// src/routes/your-route/+page.server.js
export async function load() {
    try {
        const response = await fetch('https://api.adsb.lol/v2/ladd');
        
        if (!response.ok) {
            return { planes: [], error: "API unreachable" };
        }

        const data = await response.json();
        
        // Return the 'ac' array to the frontend
        return {
            planes: data.ac || []
        };
    } catch (e) {
        return { planes: [], error: e.message };
    }
}