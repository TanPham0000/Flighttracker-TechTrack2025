// src/routes/api/flights/+server.js
import { json } from '@sveltejs/kit';
import fs from 'fs';
import path from 'path';

const LOG_PATH = path.resolve('data/flight_history.jsonl');

export async function GET() {
    try {
        const response = await fetch('https://opensky-network.org/api/states/all');
        const data = await response.json();
        const rawPlanes = data.ac || [];
        const timestamp = Date.now();

        const enrichedPlanes = rawPlanes.map(plane => {
            const meta = database.getAircraft(plane.hex.toLowerCase()) || {};
            const enriched = {
                ...plane,
                airline_name: meta.operator || "Private",
                owner: meta.owner || "Unknown",
                built: meta.built || "N/A",
                model: meta.model || plane.t || "Unknown",
                recorded_at: timestamp
            };

            // --- FILING LOGIC ---
            // We append each plane to a local file for historical analysis
            // Use a try-catch for file IO to prevent API crashes
            try {
                fs.appendFileSync(LOG_PATH, JSON.stringify(enriched) + '\n');
            } catch (e) { /* silent log error */ }

            return enriched;
        });

        return json({ ac: enrichedPlanes, total: data.total });
    } catch (err) {
        return json({ error: err.message }, { status: 500 });
    }
}