"use client";

import dynamic from "next/dynamic";

/**
 * Leaflet reads `window` while its module is evaluating, so CampusMap can only
 * load in the browser. Next 16 rejects `ssr: false` inside a Server Component,
 * so the dynamic() call has to sit in a client module — this one — and
 * app/map/page.tsx keeps its metadata export by rendering this instead.
 */
const CampusMap = dynamic(() => import("./CampusMap"), {
    ssr: false,
    loading: () => (
        <div className="flex-1 min-h-0 border-2 border-nust-blue bg-cream flex items-center justify-center">
            <p className="font-display text-sm uppercase tracking-widest text-nust-blue/60">
                Loading map…
            </p>
        </div>
    ),
});

export default function CampusMapLoader() {
    return <CampusMap />;
}
