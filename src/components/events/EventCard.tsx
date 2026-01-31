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

export function EventCard({ event, index = 0 }: EventCardProps) {
    const startDate = new Date(event.start_time);
    const month = startDate.toLocaleDateString("en-US", { month: "short" });
    const day = startDate.getDate();
    const time = startDate.toLocaleTimeString("en-US", {
        hour: "numeric",
        minute: "2-digit",
        hour12: true,
    });

    // Check if event is happening soon (within 2 hours)
    const now = new Date();
    const hoursUntil = (startDate.getTime() - now.getTime()) / (1000 * 60 * 60);
    const isHappeningSoon = hoursUntil > 0 && hoursUntil <= 2;
    const isLive = hoursUntil <= 0 && new Date(event.end_time) > now;

    return (
        <Link
            href={`/events/${event.id}`}
            className="card group animate-slide-up"
            style={{ animationDelay: `${index * 0.1}s` }}
        >
            {/* Date Badge */}
            <div className="flex items-start justify-between mb-4">
                <div className="flex items-center gap-3">
                    <div className="bg-nust-blue/10 rounded-xl p-2 text-center min-w-[56px]">
                        <div className="font-heading text-2xl text-nust-blue leading-none">
                            {day}
                        </div>
                        <div className="text-xs text-nust-blue uppercase font-medium">
                            {month}
                        </div>
                    </div>
                    <div>
                        <div className="text-sm text-foreground-muted">{time}</div>
                        <div className="text-sm text-foreground-muted truncate max-w-[120px]">
                            {event.venue_name}
                        </div>
                    </div>
                </div>

                {/* Status Badge */}
                {isLive ? (
                    <span className="badge badge-accent animate-pulse-glow">
                        <span className="w-2 h-2 bg-white rounded-full animate-pulse" />
                        LIVE
                    </span>
                ) : isHappeningSoon ? (
                    <span className="badge badge-primary">Soon</span>
                ) : event.is_official ? (
                    <span className="badge badge-outline">Official</span>
                ) : null}
            </div>

            {/* Title */}
            <h4 className="text-foreground group-hover:text-primary transition-colors mb-2 line-clamp-2">
                {event.title}
            </h4>

            {/* Description */}
            <p className="text-sm text-foreground-muted line-clamp-2 mb-4">
                {event.description}
            </p>

            {/* Tags */}
            <div className="flex flex-wrap gap-2 mb-4">
                {event.tags.slice(0, 3).map((tag) => (
                    <span
                        key={tag}
                        className="text-xs px-2 py-1 rounded-full bg-background-secondary text-foreground-muted"
                    >
                        {tag}
                    </span>
                ))}
            </div>

            {/* Footer */}
            <div className="flex items-center justify-between pt-4 border-t border-border">
                <div className="flex items-center gap-3">
                    {/* RSVP Count */}
                    <div className="flex items-center gap-1 text-sm text-foreground-muted">
                        <svg
                            className="w-4 h-4"
                            fill="none"
                            stroke="currentColor"
                            viewBox="0 0 24 24"
                        >
                            <path
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                strokeWidth={2}
                                d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z"
                            />
                        </svg>
                        <span>{event.rsvp_count}</span>
                    </div>

                    {/* Sentiment if available */}
                    {event.sentiment && (
                        <SentimentIndicator sentiment={event.sentiment} />
                    )}
                </div>

                {/* Arrow */}
                <div className="w-8 h-8 rounded-full bg-background-secondary group-hover:bg-primary flex items-center justify-center transition-colors">
                    <svg
                        className="w-4 h-4 text-foreground-muted group-hover:text-white transition-colors"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                    >
                        <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={2}
                            d="M9 5l7 7-7 7"
                        />
                    </svg>
                </div>
            </div>
        </Link>
    );
}

function SentimentIndicator({ sentiment }: { sentiment: "pos" | "neu" | "neg" }) {
    const config = {
        pos: { emoji: "🔥", label: "Vibing", className: "badge-sentiment-pos" },
        neu: { emoji: "😐", label: "Okay", className: "badge-sentiment-neu" },
        neg: { emoji: "😕", label: "Meh", className: "badge-sentiment-neg" },
    };

    const { emoji, label, className } = config[sentiment];

    return (
        <span className={`badge ${className}`}>
            <span>{emoji}</span>
            <span className="hidden sm:inline">{label}</span>
        </span>
    );
}
