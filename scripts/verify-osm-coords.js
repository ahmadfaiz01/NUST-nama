const https = require('https');
const fs = require('fs');

const overpassQuery = `[out:json][timeout:30];
(
  node["name"](33.633,72.978,33.652,73.003);
  way["name"](33.633,72.978,33.652,73.003);
);
out center;`;

const url = 'https://overpass-api.de/api/interpreter?data=' + encodeURIComponent(overpassQuery);

console.log("Fetching OpenStreetMap coordinates for NUST H-12...");

const options = {
    headers: {
        'User-Agent': 'NustNama-Auditor/1.0 (https://nustnama.life)'
    }
};

https.get(url, options, (res) => {
    let raw = '';
    res.on('data', chunk => raw += chunk);
    res.on('end', () => {
        try {
            const data = JSON.parse(raw);
            console.log(`Received ${data.elements ? data.elements.length : 0} OSM elements.`);
            const results = [];
            for (const el of data.elements || []) {
                const lat = el.lat || (el.center && el.center.lat);
                const lon = el.lon || (el.center && el.center.lon);
                const name = el.tags && (el.tags.name || el.tags['name:en'] || el.tags.operator);
                if (name && lat && lon) {
                    results.push({ name, lat: Number(lat.toFixed(5)), lng: Number(lon.toFixed(5)), tags: el.tags });
                }
            }
            results.sort((a, b) => a.name.localeCompare(b.name));
            fs.writeFileSync('scripts/osm-nust-places.json', JSON.stringify(results, null, 2));
            console.log(`Saved ${results.length} named places to scripts/osm-nust-places.json`);
            results.slice(0, 30).forEach(r => console.log(`${r.name}: [${r.lat}, ${r.lng}]`));
        } catch (err) {
            console.error("Parse error:", err.message, raw.slice(0, 200));
        }
    });
}).on('error', (e) => {
    console.error("Network error:", e.message);
});
