import { EventCalendar } from "@/components/events/EventCalendar";

// Mock events with various dates
const calendarEvents = [
    {
        id: "1",
        title: "SEECS Tech Fest 2026",
        description: "The biggest tech event at NUST featuring hackathons, workshops, and amazing speakers.",
        start_time: "2026-02-15T10:00:00",
        end_time: "2026-02-15T18:00:00",
        venue_name: "SEECS Auditorium",
        tags: ["Tech", "Hackathon"],
        is_official: true,
        rsvp_count: 234,
        checkin_count: 0,
        sentiment: null,
    },
    {
        id: "2",
        title: "Cultural Night",
        description: "Celebrate Pakistan's rich cultural heritage.",
        start_time: "2026-02-10T17:00:00",
        end_time: "2026-02-10T22:00:00",
        venue_name: "Student Center",
        tags: ["Culture"],
        is_official: false,
        rsvp_count: 189,
        checkin_count: 0,
        sentiment: null,
    },
    {
        id: "3",
        title: "Career Fair",
        description: "Connect with top companies.",
        start_time: "2026-02-20T09:00:00",
        end_time: "2026-02-20T16:00:00",
        venue_name: "Convention Center",
        tags: ["Career"],
        is_official: true,
        rsvp_count: 456,
        checkin_count: 0,
        sentiment: null,
    },
    {
        id: "4",
        title: "Football Match",
        description: "SEECS vs SMME friendly.",
        start_time: "2026-02-08T20:00:00",
        end_time: "2026-02-08T22:00:00",
        venue_name: "Sports Complex",
        tags: ["Sports"],
        is_official: false,
        rsvp_count: 78,
        checkin_count: 0,
        sentiment: null,
    },
    {
        id: "5",
        title: "AI Workshop",
        description: "Introduction to Machine Learning.",
        start_time: "2026-02-12T14:00:00",
        end_time: "2026-02-12T17:00:00",
        venue_name: "RCMS Lab",
        tags: ["Workshop", "AI"],
        is_official: true,
        rsvp_count: 120,
        checkin_count: 0,
        sentiment: null,
    },
    {
        id: "6",
        title: "Open Mic Night",
        description: "Poetry and music.",
        start_time: "2026-02-14T19:00:00",
        end_time: "2026-02-14T22:00:00",
        venue_name: "Cafe 101",
        tags: ["Entertainment"],
        is_official: false,
        rsvp_count: 67,
        checkin_count: 0,
        sentiment: null,
    },
    {
        id: "7",
        title: "Debate Finals",
        description: "NUST Debate Championship finals.",
        start_time: "2026-02-15T14:00:00",
        end_time: "2026-02-15T18:00:00",
        venue_name: "Main Auditorium",
        tags: ["Competition"],
        is_official: true,
        rsvp_count: 150,
        checkin_count: 0,
        sentiment: null,
    },
];

export default function CalendarPage() {
    return (
        <div
            className="min-h-screen"
            style={{
                backgroundColor: "var(--cream)",
                backgroundImage: `linear-gradient(var(--nust-blue) 1px, transparent 1px), linear-gradient(90deg, var(--nust-blue) 1px, transparent 1px)`,
                backgroundSize: "100px 100px",
            }}
        >
            {/* Header */}
            <section className="py-12 bg-nust-blue">
                <div className="container">
                    <h1 className="text-4xl md:text-6xl text-white drop-shadow-[4px_4px_0px_var(--nust-orange)]">
                        EVENT CALENDAR
                    </h1>
                    <p className="font-display text-white/70 text-lg mt-2">
                        Plan ahead • Never miss an event
                    </p>
                </div>
            </section>

            {/* Calendar */}
            <section className="py-12">
                <div className="container">
                    <EventCalendar events={calendarEvents} />
                </div>
            </section>
        </div>
    );
}
