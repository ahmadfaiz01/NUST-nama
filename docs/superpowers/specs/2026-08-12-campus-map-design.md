# Campus map — design

A `/map` page that shows NUST's Islamabad campus as pins a student can filter by
category and tap for a one-line explanation. Modelled on
`orientation.nust.edu.pk/map`, which NUST built for Orientation '26.

## Why

A fresher does not know that SCME is a ten-minute walk from SEECS, that Gate 1
takes cars but not bikes, or which of the nine hostels is theirs. The handbooks
in the chatbot's corpus do not answer any of that — they are policy documents,
not wayfinding. The orientation map answers it, but it is a separate site tied
to one event and it will go stale after the intake.

## What it is

One page, 77 pins, eight categories. Tap a pin, get the name and one line. That
is the whole feature. The reference site has no search, no routing and no
directions, and at 77 pins on a single campus none of those earn their weight.

Categories, with the colours the reference uses:

| Category | Colour | Count |
|---|---|---|
| Gates | `#D85503` | 6 |
| Mosques | `#9FE4FF` | 3 |
| Sports | `#3D66A9` | 16 |
| Hostels | `#F4F1EA` | 15 |
| Schools | `#2A5290` | 17 |
| Cafes | `#E58A4E` | 10 |
| Banks | `#9AA7B8` | 3 |
| Facilities | `#7FD1B9` | 7 |

The hostel colour `#F4F1EA` is near-white and will vanish against the map on its
own; hostel pins need a dark stroke to stay visible. Same check applies to
`#9FE4FF` for mosques.

## Architecture

Three new files and one edit.

```
src/lib/campus_places.ts                the 77 places + the Category union
src/components/map/CampusMap.tsx        'use client'. Leaflet, markers, filter pills
src/components/map/CampusMapLoader.tsx  'use client'. Holds the ssr:false dynamic()
src/app/map/page.tsx                    page shell + metadata
src/components/layout/NavBar.tsx        edited: one nav link
scripts/campus-places.test.ts           the data checks
```

`CampusPlace` is:

```ts
export type Category =
  | "Gates" | "Mosques" | "Sports" | "Hostels"
  | "Schools" | "Cafes" | "Banks" | "Facilities";

export interface CampusPlace {
  id: string;        // kebab-case, unique, stable — it is the React key
  name: string;
  category: Category;
  lat: number;
  lng: number;
  blurb: string;     // one line. What a student needs, not what the building is
}
```

### Why a file and not a table

The data changes about once a year, when a cafe opens or a hostel is renamed. A
Supabase table would mean a migration, RLS policies and an admin CRUD screen —
three moving parts to maintain so that an edit can skip a commit. A commit is
the right edit mechanism for data that changes annually.

### Why a separate file from `nust_venues.ts`

`nust_venues.ts` feeds the venue dropdown on `/post-event` and carries a
`keywords` field for matching typed input. It holds 28 places, all of which are
places you can hold an event at. The map needs gates, banks and mosques, which
are not event venues, and does not need keyword matching. Merging them would
give one file where half the fields are irrelevant to half the rows.

They do overlap on about 20 places, and duplicated data drifts. Accepted for
now, with the note below.

### Rendering

Leaflet reads `window` at module scope, so `CampusMap` must be imported through
`next/dynamic` with `ssr: false`. Next 16 rejects `ssr: false` inside a Server
Component outright — the page 500s with "not allowed with next/dynamic in
Server Components" — so the `dynamic()` call lives in `CampusMapLoader`, a
one-line client component, and `page.tsx` stays a Server Component and keeps its
`metadata` export.

`CampusMap` holds one piece of state: the selected category, or `null` for All.
Markers are `CircleMarker` — the reference uses circles, they need no icon
assets, and colour-by-category is one prop. Each carries a `Popup` with the name
and blurb.

Tiles come from CARTO's voyager basemap, the same one the reference uses. It is
free for reasonable use and needs no API key, unlike Mapbox or Google.

The recenter button calls `map.setView` on the campus centre at zoom 15, which
is the zoom at which all 77 pins fit.

## Data provenance and accuracy

Coordinates were derived on 12 August 2026 from the reference map's own marker
positions, by reading each Leaflet circle's screen position and converting
through the Web Mercator tile grid. That is accurate to roughly 10–20 m —
enough to identify a building, not enough for anything that matters more.

Where OpenStreetMap has the same feature mapped, the OSM coordinate is
preferred, since it is surveyed rather than inferred.

Place names and positions are facts and are reused directly. The one-line
descriptions on the reference site are text NUST's orientation team wrote; the
facts in them are reused, the wording is rewritten.

## Testing

`scripts/campus-places.test.ts`, in the style of the existing
`scripts/answer-text.test.ts` — plain asserts, run with `npx tsx`, no framework.
It asserts:

- every `id` is unique
- every coordinate sits inside the campus bounding box, roughly 33.63–33.66 N
  and 72.97–73.01 E
- every place has a non-empty blurb and a valid category
- every one of the eight categories has at least one place, so a filter pill can
  never render an empty map

The realistic failure is a typo'd digit dropping a pin into Rawalpindi. The
bounding-box assert is the check that catches it.

## Not doing

- **Search.** 77 pins, one screen, eight filters. Add it if the list grows.
- **Routing or directions.** Leaflet does not do it without a routing service,
  and the campus is a fifteen-minute walk end to end.
- **Events on the map.** `events` already has `venue_lat`/`venue_lng`, so a
  layer showing what is on today is a natural second step. It is a different
  feature with a different data source, and this page is useful without it.
- **An admin editor.** See "why a file and not a table".

## Known issue, out of scope

`nust_venues.ts` places SEECS at `33.6433, 72.9916`. Both the reference map and
OSM put it near `33.6425, 72.9904`, about 150 m south-west. Several other
entries in that file look similarly approximate, which means event pins on
`/events` have been slightly wrong. Correcting it is a separate change; this
spec only notes it.
