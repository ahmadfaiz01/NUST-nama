const fs = require('fs');
const osm = JSON.parse(fs.readFileSync('scripts/osm-nust-places.json', 'utf8'));

console.log("=== Tennis ===");
osm.filter(o => o.name.toLowerCase().includes('tennis')).forEach(o => console.log(o.name, o.lat, o.lng));

console.log("\n=== Hostels in OSM ===");
osm.filter(o => o.name.toLowerCase().includes('hostel') || o.name.toLowerCase().includes('ayesha') || o.name.toLowerCase().includes('fatima') || o.name.toLowerCase().includes('rahmat') || o.name.toLowerCase().includes('raazi') || o.name.toLowerCase().includes('ghazali') || o.name.toLowerCase().includes('beruni') || o.name.toLowerCase().includes('hajveri') || o.name.toLowerCase().includes('zakriya') || o.name.toLowerCase().includes('rumi') || o.name.toLowerCase().includes('zainab') || o.name.toLowerCase().includes('khadija') || o.name.toLowerCase().includes('amna')).forEach(o => console.log(o.name, o.lat, o.lng));

console.log("\n=== Mosques in OSM ===");
osm.filter(o => o.name.toLowerCase().includes('masjid') || o.name.toLowerCase().includes('mosque')).forEach(o => console.log(o.name, o.lat, o.lng));

console.log("\n=== Banks & ATMs in OSM ===");
osm.filter(o => o.name.toLowerCase().includes('hbl') || o.name.toLowerCase().includes('bank') || o.name.toLowerCase().includes('atm')).forEach(o => console.log(o.name, o.lat, o.lng));

console.log("\n=== Sports Grounds in OSM ===");
osm.filter(o => o.name.toLowerCase().includes('ground') || o.name.toLowerCase().includes('court') || o.name.toLowerCase().includes('gym') || o.name.toLowerCase().includes('pool')).forEach(o => console.log(o.name, o.lat, o.lng));
