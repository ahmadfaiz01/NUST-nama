import type { Metadata } from "next";
import CampusMapLoader from "@/components/map/CampusMapLoader";

export const metadata: Metadata = {
    title: "Campus Map | NUST Nama",
    description:
        "Find your way around NUST's H-12 campus: gates, schools, hostels, cafes, mosques, banks and sports grounds, with a line on each telling you what you need to know.",
};

export default function MapPage() {
    return (
        <div
            className="min-h-screen pb-12"
            style={{
                backgroundColor: "var(--cream)",
                backgroundImage: `linear-gradient(var(--nust-blue) 1px, transparent 1px), linear-gradient(90deg, var(--nust-blue) 1px, transparent 1px)`,
                backgroundSize: "100px 100px",
            }}
        >
            {/* Hero Banner */}
            <section className="py-10 bg-nust-blue">
                <div className="container">
                    <h1 className="text-5xl md:text-6xl text-white mb-2 drop-shadow-[4px_4px_0px_var(--nust-orange)] font-heading leading-tight">
                        CAMPUS MAP
                    </h1>
                    <p className="font-display text-white/70 text-lg md:text-xl max-w-2xl leading-normal">
                        Every gate, hostel, cafe, school and facility on H-12. Tap or hover any pin to explore.
                    </p>
                </div>
            </section>

            {/* Map Section */}
            <section className="py-8">
                <div className="container">
                    <CampusMapLoader />
                </div>
            </section>
        </div>
    );
}
