const fs = require('fs');

const osmData = JSON.parse(fs.readFileSync('scripts/osm-nust-places.json', 'utf8'));

// Import campus places by parsing or requiring
const fileContent = fs.readFileSync('src/lib/campus_places.ts', 'utf8');

// Regex match each place in CAMPUS_PLACES
const placeRegex = /\{\s*id:\s*"([^"]+)",\s*name:\s*"([^"]+)",\s*category:\s*"([^"]+)",\s*lat:\s*([0-9.]+),\s*lng:\s*([0-9.]+),\s*blurb:\s*"([^"]+)"\s*\}/g;

let match;
const places = [];
while ((match = placeRegex.exec(fileContent)) !== null) {
    places.push({
        id: match[1],
        name: match[2],
        category: match[3],
        lat: parseFloat(match[4]),
        lng: parseFloat(match[5]),
        blurb: match[6]
    });
}

console.log(`Found ${places.length} campus places in codebase.`);

// Haversine formula in meters
function distanceMeters(lat1, lon1, lat2, lon2) {
    const R = 6371e3;
    const φ1 = lat1 * Math.PI / 180;
    const φ2 = lat2 * Math.PI / 180;
    const Δφ = (lat2 - lat1) * Math.PI / 180;
    const Δλ = (lon2 - lon1) * Math.PI / 180;
    const a = Math.sin(Δφ / 2) * Math.sin(Δφ / 2) +
              Math.cos(φ1) * Math.cos(φ2) *
              Math.sin(Δλ / 2) * Math.sin(Δλ / 2);
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
    return Math.round(R * c);
}

// Compare each place
const comparisons = [];

for (const p of places) {
    // Find closest OSM match with similar name or nearby
    const candidates = [];
    for (const osm of osmData) {
        const dist = distanceMeters(p.lat, p.lng, osm.lat, osm.lng);
        const nameMatch = osm.name.toLowerCase().includes(p.name.toLowerCase()) ||
                          p.name.toLowerCase().includes(osm.name.toLowerCase()) ||
                          (p.id && osm.name.toLowerCase().includes(p.id.toLowerCase()));
        
        candidates.push({ osm, dist, nameMatch });
    }

    // Sort by name match then distance
    candidates.sort((a, b) => {
        if (a.nameMatch && !b.nameMatch) return -1;
        if (!a.nameMatch && b.nameMatch) return 1;
        return a.dist - b.dist;
    });

    const best = candidates[0];
    comparisons.push({
        place: p,
        bestOsm: best.osm,
        dist: best.dist,
        nameMatch: best.nameMatch
    });
}

console.log("\n=== Direct Name Matches from OpenStreetMap ===");
const namedMatches = comparisons.filter(c => c.nameMatch);
namedMatches.forEach(c => {
    console.log(`${c.place.name} (${c.place.category})`);
    console.log(`  Current: [${c.place.lat}, ${c.place.lng}]`);
    console.log(`  OSM:     [${c.bestOsm.lat}, ${c.bestOsm.lng}] (${c.bestOsm.name}) -> Diff: ${c.dist}m`);
    if (c.dist > 30) {
        console.log(`  ⚠️ ADJUSTMENT SUGGESTED: diff > 30m!`);
    }
});

console.log("\n=== Places without direct OSM name match ===");
const unmatched = comparisons.filter(c => !c.nameMatch);
console.log(`Count: ${unmatched.length}`);
unmatched.slice(0, 20).forEach(c => {
    console.log(`- ${c.place.name} (${c.place.category}) at [${c.place.lat}, ${c.place.lng}], nearest OSM is '${c.bestOsm.name}' (${c.dist}m away)`);
});
