import type { Source } from "@/lib/chat/agent";

/** July: NUST's academic year rolls over in the autumn. */
const ACADEMIC_YEAR_START = new Date(
    new Date().getMonth() >= 6 ? new Date().getFullYear() : new Date().getFullYear() - 1,
    6,
    1,
);

function isStale(published: string | null): boolean {
    if (!published) return true;
    return new Date(published) < ACADEMIC_YEAR_START;
}

export function Citation({ source }: { source: Source }) {
    const pages =
        source.page_start === null
            ? null
            : source.page_end && source.page_end !== source.page_start
                ? `pp. ${source.page_start}–${source.page_end}`
                : `p. ${source.page_start}`;

    return (
        <li className="border-l-2 border-nust-orange pl-3 py-1 text-xs break-words">
            <span className="font-bold text-nust-blue">{source.title ?? "NUST document"}</span>
            {source.heading_path && (
                // Only the last segment. The full path is a chain of six headings
                // carrying whatever text ran on from the PDF, which reads as noise
                // and overflows at 375px; the leaf is the bit that located the answer.
                <span className="block text-gray-600 break-words">
                    {source.heading_path.split(">").pop()?.trim()}
                </span>
            )}
            <span className="block text-gray-500">
                {[pages, source.published_at?.slice(0, 10)].filter(Boolean).join(" · ")}
            </span>
            {source.url && (
                <a
                    href={source.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-nust-blue underline break-all"
                >
                    Open the original on nust.edu.pk
                </a>
            )}
            {isStale(source.published_at) && (
                <span className="block mt-1 text-[11px] text-amber-700">
                    ⚠ Published before this academic year — confirm fees and deadlines with the office.
                </span>
            )}
        </li>
    );
}
