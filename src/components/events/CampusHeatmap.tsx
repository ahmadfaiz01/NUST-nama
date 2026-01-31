"use client";

import dynamic from "next/dynamic";
import { Suspense } from "react";

const LeafletMap = dynamic(() => import("./LeafletMap"), {
    ssr: false,
    loading: () => (
        <div className="w-full h-[500px] bg-nust-blue/5 rounded-xl border-2 border-nust-blue flex items-center justify-center animate-pulse">
            <div className="text-center">
                <div className="text-4xl mb-2">🗺️</div>
                <p className="font-heading text-nust-blue text-xl">Loading Campus Map...</p>
            </div>
        </div>
    ),
});

export function CampusHeatmap() {
    return (
        <div className="w-full h-[500px] relative">
            <Suspense fallback={<div>Loading...</div>}>
                <LeafletMap />
            </Suspense>
        </div>
    );
}
