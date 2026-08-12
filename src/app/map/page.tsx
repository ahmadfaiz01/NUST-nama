import type { Metadata } from "next";
import CampusMapLoader from "@/components/map/CampusMapLoader";

export const metadata: Metadata = {
    title: "Campus Map | NUST Nama",
    description:
        "Find your way around NUST's H-12 campus: gates, schools, hostels, cafes, mosques, banks and sports grounds, with a line on each telling you what you need to know.",
};

export default function MapPage() {
    return (
        <div className="container max-w-5xl h-[calc(100dvh-7rem)] pb-4 flex flex-col min-h-0 gap-4">
            <div className="shrink-0">
                <h1 className="font-heading text-3xl tracking-wide text-nust-blue leading-none">
                    CAMPUS MAP
                </h1>
                <p className="text-sm text-nust-blue/70 mt-1">
                    Every gate, hostel, cafe and school on H-12. Tap a pin.
                </p>
            </div>

            <CampusMapLoader />
        </div>
    );
}
