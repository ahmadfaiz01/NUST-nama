import Link from "next/link";
import { EventCard } from "@/components/events/EventCard";

// Mock data - more events
const allEvents = [
    {
        id: "1",
        title: "SEECS Tech Fest 2026",
        description: "The biggest tech event at NUST featuring hackathons, workshops, and amazing speakers from leading tech companies.",
        start_time: "2026-02-15T10:00:00",
        end_time: "2026-02-15T18:00:00",
        venue_name: "SEECS Auditorium",
        tags: ["Tech", "Hackathon", "Workshop"],
        is_official: true,
        rsvp_count: 234,
        checkin_count: 45,
        sentiment: "pos" as const,
    },
    {
        id: "2",
        title: "Cultural Night: Rang-e-Tehzeeb",
        description: "Celebrate Pakistan's rich cultural heritage with performances, food, and art from all provinces.",
        start_time: "2026-02-10T17:00:00",
        end_time: "2026-02-10T22:00:00",
        venue_name: "Student Center",
        tags: ["Culture", "Music", "Food"],
        is_official: false,
        rsvp_count: 189,
        checkin_count: 0,
        sentiment: null,
    },
    {
        id: "3",
        title: "Career Fair 2026",
        description: "Connect with top companies and explore internship and job opportunities. Bring your CV!",
        start_time: "2026-02-20T09:00:00",
        end_time: "2026-02-20T16:00:00",
        venue_name: "Convention Center",
        tags: ["Career", "Networking", "Jobs"],
        is_official: true,
        rsvp_count: 456,
        checkin_count: 0,
        sentiment: null,
    },
    {
        id: "4",
        title: "Midnight Football Tournament",
        description: "Inter-school football competition under the lights. Are you ready to compete?",
        start_time: "2026-02-08T20:00:00",
        end_time: "2026-02-08T23:59:00",
        venue_name: "Sports Complex",
        tags: ["Sports", "Football", "Competition"],
        is_official: false,
        rsvp_count: 78,
        checkin_count: 12,
        sentiment: "pos" as const,
    },
    {
        id: "5",
        title: "AI/ML Workshop Series",
        description: "Hands-on workshops covering machine learning fundamentals to advanced deep learning concepts.",
        start_time: "2026-02-12T14:00:00",
        end_time: "2026-02-12T18:00:00",
        venue_name: "RCMS Lab 3",
        tags: ["Workshop", "AI", "Learning"],
        is_official: true,
        rsvp_count: 120,
        checkin_count: 0,
        sentiment: null,
    },
    {
        id: "6",
        title: "Open Mic Night",
        description: "Share your poetry, stand-up comedy, or music at our monthly open mic session.",
        start_time: "2026-02-14T19:00:00",
        end_time: "2026-02-14T22:00:00",
        venue_name: "Cafe 101",
        tags: ["Entertainment", "Music", "Poetry"],
        is_official: false,
        rsvp_count: 67,
        checkin_count: 0,
        sentiment: null,
    },
    {
        id: "7",
        title: "NUST Debate Championship",
        description: "Annual inter-university debate championship. Register your team now!",
        start_time: "2026-02-22T09:00:00",
        end_time: "2026-02-23T18:00:00",
        venue_name: "Main Auditorium",
        tags: ["Debate", "Competition", "Academic"],
        is_official: true,
        rsvp_count: 200,
        checkin_count: 0,
        sentiment: null,
    },
    {
        id: "8",
        title: "Photography Walk",
        description: "Join the Photography Society for a campus photography walk and learn composition techniques.",
        start_time: "2026-02-09T16:00:00",
        end_time: "2026-02-09T18:00:00",
        venue_name: "Main Gate",
        tags: ["Photography", "Creative", "Outdoor"],
        is_official: false,
        rsvp_count: 45,
        checkin_count: 0,
        sentiment: null,
    },
];

const categories = ["All", "Tech", "Culture", "Sports", "Career", "Entertainment", "Academic"];

export default function EventsPage() {
    return (
        <div className="min-h-screen bg-cream">
            {/* Hero Banner */}
            <section
                className="py-16 relative"
                style={{
                    backgroundColor: "var(--nust-blue)",
                    backgroundImage: `linear-gradient(var(--nust-orange) 1px, transparent 1px), linear-gradient(90deg, var(--nust-orange) 1px, transparent 1px)`,
                    backgroundSize: "60px 60px",
                }}
            >
                <div className="container">
                    <h1 className="text-5xl md:text-7xl text-white mb-4 drop-shadow-[4px_4px_0px_var(--nust-orange)]">
                        DISCOVER EVENTS
                    </h1>
                    <p className="text-white/80 text-xl max-w-2xl">
                        From tech talks to cultural nights, find everything happening at NUST.
                    </p>
                </div>
            </section>

            {/* Filters */}
            <section className="py-6 border-b-2 border-nust-blue bg-white sticky top-20 z-40">
                <div className="container">
                    <div className="flex flex-wrap gap-3">
                        {categories.map((cat, i) => (
                            <button
                                key={cat}
                                className={`px-4 py-2 rounded-full font-heading text-lg border-2 transition-all ${i === 0
                                        ? "bg-nust-blue text-white border-nust-blue"
                                        : "bg-white text-nust-blue border-nust-blue hover:bg-nust-blue hover:text-white"
                                    }`}
                            >
                                {cat}
                            </button>
                        ))}
                    </div>
                </div>
            </section>

            {/* Events Grid */}
            <section className="py-12">
                <div className="container">
                    <div className="flex items-center justify-between mb-8">
                        <p className="text-nust-blue/60 font-display uppercase tracking-widest">
                            Showing {allEvents.length} events
                        </p>
                        <select className="px-4 py-2 border-2 border-nust-blue rounded-lg font-display bg-white text-nust-blue">
                            <option>Sort by Date</option>
                            <option>Most Popular</option>
                            <option>Happening Soon</option>
                        </select>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8">
                        {allEvents.map((event, index) => (
                            <div key={event.id} className={`transform ${index % 3 === 0 ? 'rotate-1' : index % 3 === 1 ? '-rotate-1' : ''} hover:rotate-0 transition-transform`}>
                                <EventCard event={event} index={index} />
                            </div>
                        ))}
                    </div>

                    {/* Load More */}
                    <div className="text-center mt-12">
                        <button className="btn btn-outline text-lg px-8 py-3">
                            Load More Events
                        </button>
                    </div>
                </div>
            </section>
        </div>
    );
}
