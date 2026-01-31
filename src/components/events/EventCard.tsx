import Link from "next/link";

interface Event {
    id: string;
    title: string;
    description: string;
    start_time: string;
    end_time: string;
    venue_name: string;
    tags: string[];
    is_official: boolean;
    rsvp_count: number;
    checkin_count: number;
    sentiment: "pos" | "neu" | "neg" | null;
}

interface EventCardProps {
    event: Event;
    index?: number;
}

export function EventCard({ event }: EventCardProps) {
    const startDate = new Date(event.start_time);
    const month = startDate.toLocaleDateString("en-US", { month: "short" });
    const day = startDate.getDate();
    const time = startDate.toLocaleTimeString("en-US", {
        hour: "numeric",
        minute: "2-digit",
        hour12: true,
    });

    return (
        <Link
            href={`/events/${event.id}`}
            className="block h-full"
        >
            <div className="card h-full flex flex-col bg-white border-2 border-nust-blue shadow-[4px_4px_0px_var(--nust-blue)] hover:shadow-[8px_8px_0px_var(--nust-blue)] hover:-translate-y-1 transition-all duration-200 relative overflow-hidden group">

                {/* Top Tape 'Sticker' detail (Purely decorative) */}
                <div className="absolute -top-3 left-1/2 -translate-x-1/2 w-12 h-6 bg-nust-orange/20 rotate-1 z-0"></div>

                {/* Date & Badge Row */}
                <div className="flex justify-between items-start mb-4 relative z-10">
                    <div className="bg-nust-blue text-white rounded-lg p-2 text-center shadow-sm border border-nust-blue min-w-[60px]">
                        <span className="block font-heading text-2xl leading-none">{day}</span>
                        <span className="block font-display text-xs font-bold uppercase">{month}</span>
                    </div>

                    {event.is_official && (
                        <span className="badge badge-accent shadow-[2px_2px_0px_rgba(0,0,0,0.1)]">Official</span>
                    )}
                </div>

                {/* Content */}
                <div className="flex-1">
                    <h3 className="font-heading text-2xl text-nust-blue mb-2 leading-none group-hover:text-nust-orange transition-colors">
                        {event.title}
                    </h3>

                    <div className="flex items-center gap-2 text-sm text-foreground-muted mb-3 font-medium">
                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>
                        @{time}
                    </div>

                    {/* Venue formatted like a location sticker */}
                    <div className="inline-block bg-nust-blue/5 text-nust-blue text-xs font-bold px-2 py-1 rounded border border-nust-blue/20 mb-3">
                        📍 {event.venue_name}
                    </div>

                    <p className="text-sm text-foreground-muted line-clamp-2">
                        {event.description}
                    </p>
                </div>

                {/* Footer actions */}
                <div className="mt-4 pt-3 border-t-2 border-dashed border-gray-200 flex items-center justify-between">
                    <div className="flex items-center gap-1 text-sm font-bold text-nust-blue">
                        <span>👥 {event.rsvp_count} going</span>
                    </div>

                    <div className="w-8 h-8 rounded-full bg-nust-orange text-white flex items-center justify-center border-2 border-nust-orange group-hover:bg-white group-hover:text-nust-orange transition-colors">
                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14 5l7 7m0 0l-7 7m7-7H3" /></svg>
                    </div>
                </div>

            </div>
        </Link>
    );
}
