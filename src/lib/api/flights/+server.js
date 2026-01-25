// src/routes/api/flights/+server.js
import { json } from '@sveltejs/kit';

export async function GET() {
    try {
        const response = await fetch('https://api.adsb.lol/v2/ladd');
        if (!response.ok) return json({ error: 'External API Error' }, { status: 500 });
        
        const data = await response.json();
        return json(data); // Send the data back to frontend
    } catch (err) {
        return json({ error: err.message }, { status: 500 });
    }
}