/**
 * Run: npx tsx scripts/campus-places.test.ts
 *
 * The map is 77 hand-entered coordinates. The failure that actually happens is a
 * mistyped digit putting a pin in Rawalpindi, which looks fine in the diff and
 * obvious on screen. The bounding box is the check that catches it.
 */
import assert from "assert";
import { CAMPUS_PLACES, CATEGORIES, CATEGORY_COLOURS } from "../src/lib/campus_places";

// H-12 campus, with room to spare. Anything outside is a typo.
const BOUNDS = { minLat: 33.63, maxLat: 33.66, minLng: 72.97, maxLng: 73.01 };

const ids = new Set<string>();
for (const p of CAMPUS_PLACES) {
    assert.ok(!ids.has(p.id), `duplicate id: ${p.id}`);
    ids.add(p.id);

    assert.ok(p.name.trim().length > 0, `${p.id} has no name`);
    assert.ok(p.blurb.trim().length > 0, `${p.id} has no blurb`);
    assert.ok(CATEGORIES.includes(p.category), `${p.id} has unknown category ${p.category}`);

    assert.ok(
        p.lat >= BOUNDS.minLat && p.lat <= BOUNDS.maxLat,
        `${p.id} latitude ${p.lat} is off campus`,
    );
    assert.ok(
        p.lng >= BOUNDS.minLng && p.lng <= BOUNDS.maxLng,
        `${p.id} longitude ${p.lng} is off campus`,
    );
}

// Every filter pill must show something. An empty category renders a blank map
// with no explanation, which reads as a broken page.
for (const c of CATEGORIES) {
    assert.ok(
        CAMPUS_PLACES.some((p) => p.category === c),
        `category ${c} has no places`,
    );
    assert.ok(CATEGORY_COLOURS[c], `category ${c} has no colour`);
}

// Two pins within about 10 m of each other overlap into one clickable dot.
for (let i = 0; i < CAMPUS_PLACES.length; i++) {
    for (let j = i + 1; j < CAMPUS_PLACES.length; j++) {
        const a = CAMPUS_PLACES[i];
        const b = CAMPUS_PLACES[j];
        const metres = Math.hypot((a.lat - b.lat) * 111_320, (a.lng - b.lng) * 92_500);
        assert.ok(metres > 10, `${a.id} and ${b.id} are ${metres.toFixed(0)}m apart and will overlap`);
    }
}

console.log(`campus-places: ${CAMPUS_PLACES.length} places, ${CATEGORIES.length} categories, all checks passed`);
