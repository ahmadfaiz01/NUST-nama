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

/**
 * Some PDFs carry the university's own name as their title, which tells a
 * student nothing about which form they are downloading. The filename does.
 */
function displayTitle(source: Source): string {
    const title = source.title?.trim();
    const generic = !title || /^national university|^nust$/i.test(title);
    if (!generic) return title;

    const file = source.url?.split("/").pop()?.replace(/\.pdf$/i, "");
    if (!file) return title || "NUST document";
    return decodeURIComponent(file).replace(/[-_]+/g, " ").replace(/\s+/g, " ").trim();
}

function pageLabel(source: Source): string | null {
    if (source.page_start === null) return null;
    return source.page_end && source.page_end !== source.page_start
        ? `pp. ${source.page_start}–${source.page_end}`
        : `p. ${source.page_start}`;
}

/**
 * A form the student actually has to download. Rendered as an attachment card
 * rather than a citation: a student asking how to recheck a paper wants the PDF
 * in front of them, not a footnote pointing at one.
 */
export function FormCard({ source }: { source: Source }) {
    return (
        <div className="border-2 border-nust-blue bg-white shadow-[3px_3px_0px_var(--nust-blue)]">
            <p className="bg-nust-orange text-nust-blue text-xs font-bold uppercase tracking-wide px-3 py-1">
                Here&apos;s your form
            </p>
            <div className="flex items-center gap-3 p-3">
                <span className="text-3xl shrink-0" aria-hidden>
                    📄
                </span>
                <div className="min-w-0 flex-1">
                    <p className="font-bold text-nust-blue text-sm break-words leading-tight">
                        {displayTitle(source)}
                    </p>
                    <p className="text-xs text-gray-500">
                        PDF from nust.edu.pk
                        {source.published_at && ` · ${source.published_at.slice(0, 4)}`}
                    </p>
                </div>
                <a
                    href={source.url ?? "#"}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="shrink-0 bg-nust-blue text-white text-xs font-bold rounded-full px-4 py-2 hover:bg-nust-orange hover:text-nust-blue transition-colors"
                >
                    Open PDF
                </a>
            </div>
        </div>
    );
}

/**
 * One source, as a pill. The full heading path and page live in the tooltip —
 * on the page they only ever pushed the answer off the screen.
 */
export function Citation({ source }: { source: Source }) {
    const detail = [source.heading_path?.split(">").pop()?.trim(), pageLabel(source)]
        .filter(Boolean)
        .join(" · ");

    return (
        <a
            href={source.url ?? "#"}
            target="_blank"
            rel="noopener noreferrer"
            title={detail || undefined}
            className="inline-flex items-center gap-1 max-w-full rounded-full border border-nust-blue/40 bg-white px-2.5 py-1 text-[11px] text-nust-blue hover:border-nust-blue hover:bg-nust-orange/10 transition-colors"
        >
            {isStale(source.published_at) && (
                <span title="Published before this academic year — confirm with the office" aria-hidden>
                    ⚠
                </span>
            )}
            <span className="truncate">{displayTitle(source)}</span>
            {pageLabel(source) && (
                <span className="text-gray-500 shrink-0">{pageLabel(source)}</span>
            )}
        </a>
    );
}
