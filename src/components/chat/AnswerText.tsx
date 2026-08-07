/**
 * Renders an answer.
 *
 * The model is asked for plain text and mostly obeys, but it still slips a
 * `**bold**` in now and then, which showed up as literal asterisks. Rather than
 * pull in a markdown renderer for one construct, handle bold here and strip the
 * rest of the syntax that leaks.
 *
 * Steps get the journey treatment: a numbered rail, so a procedure reads as
 * something you work through rather than a paragraph you parse.
 */

const BOLD = /\*\*(.+?)\*\*/g;
/** "1." / "1)" / "-" / "•" at the start of a line, with the marker captured. */
export const STEP = /^\s*(?:(\d+)[.)]|[-–•*])\s+(.*)$/;

function inline(text: string, key: number) {
    // Split on the bold pairs, keeping the captures: odd indexes are the bold bits.
    const parts = text.split(BOLD);
    return (
        <span key={key}>
            {parts.map((part, i) =>
                i % 2 === 1 ? (
                    <strong key={i} className="font-bold text-nust-blue">
                        {part}
                    </strong>
                ) : (
                    // Any remaining markdown noise is the model's, not the student's.
                    part.replace(/[*_`]/g, "").replace(/^#+\s*/gm, "")
                ),
            )}
        </span>
    );
}

/**
 * The model is told not to paste URLs — the app attaches the form and lists the
 * sources — and ignores that instruction perhaps a third of the time. Stripping
 * them here is the only version that actually holds. A line that was nothing but
 * a link ("Form link: https://…") goes with it.
 */
export function withoutLinks(text: string): string[] {
    return text
        .split("\n")
        .map((line) => line.replace(/https?:\/\/\S+/g, "").replace(/\s{2,}/g, " ").trim())
        // The label may still be wearing its markdown: "**Form link:**".
        .filter((line) => line !== "" && !/^[-*\s]*[\w\s]{0,20}:\**$/.test(line));
}

export function AnswerText({ text }: { text: string }) {
    const lines = withoutLinks(text);

    // Group runs of step lines so a paragraph before them stays a paragraph.
    const blocks: Array<{ type: "p"; text: string } | { type: "steps"; items: string[] }> = [];
    for (const line of lines) {
        const step = line.match(STEP);
        const last = blocks[blocks.length - 1];
        if (step) {
            if (last?.type === "steps") last.items.push(step[2]);
            else blocks.push({ type: "steps", items: [step[2]] });
        } else {
            blocks.push({ type: "p", text: line });
        }
    }

    return (
        <div className="space-y-3 text-sm leading-relaxed">
            {blocks.map((block, i) =>
                block.type === "p" ? (
                    <p key={i} className="break-words">
                        {inline(block.text, i)}
                    </p>
                ) : (
                    <ol key={i} className="space-y-3">
                        {block.items.map((item, j) => (
                            <li key={j} className="flex gap-3">
                                <span className="relative flex flex-col items-center shrink-0">
                                    <span className="h-6 w-6 rounded-full bg-nust-blue text-white text-xs font-bold flex items-center justify-center">
                                        {j + 1}
                                    </span>
                                    {/* The rail, joining this step to the next one. */}
                                    {j < block.items.length - 1 && (
                                        <span className="w-0.5 flex-1 bg-nust-blue/30 mt-1" />
                                    )}
                                </span>
                                <span className="break-words pt-0.5">{inline(item, j)}</span>
                            </li>
                        ))}
                    </ol>
                ),
            )}
        </div>
    );
}
