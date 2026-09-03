const fs = require('fs');

const fileContent = fs.readFileSync('src/lib/campus_places.ts', 'utf8');
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

console.log(`Checking ${places.length} places for boundary and sanity...`);
const outOfBounds = places.filter(p => p.lat < 33.633 || p.lat > 33.652 || p.lng < 72.978 || p.lng > 73.003);
console.log(`Out of campus bounds [33.633..33.652, 72.978..73.003]:`, outOfBounds.length);

places.forEach(p => {
    // Check reasonable precision
    const latDec = p.lat.toString().split('.')[1]?.length || 0;
    const lngDec = p.lng.toString().split('.')[1]?.length || 0;
    if (latDec < 3 || lngDec < 3) {
        console.log(`Low precision: ${p.name} [${p.lat}, ${p.lng}]`);
    }
});
