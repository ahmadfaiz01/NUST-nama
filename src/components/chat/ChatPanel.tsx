"use client";

import { useState, useRef, useEffect } from "react";
import Link from "next/link";
import { Citation, FormCard } from "./Citation";
import { AnswerText } from "./AnswerText";
import type { Source } from "@/lib/chat/agent";

type Turn = {
    question: string;
    answer: string;
    sources: Source[];
    status: string | null;
    error?: boolean;
};

const TOOL_LABELS: Record<string, string> = {
    search_sections: "Searching NUST handbooks…",
    read_section: "Reading the full section…",
    find_forms: "Looking for the form…",
    search_events: "Checking campus events…",
    get_my_rsvps: "Checking your RSVPs…",
};

const EXAMPLES = [
    "How many classes can I miss?",
    "How do I freeze a semester?",
    "What events are on this week?",
];

/**
 * Forms shown as attachments, one card per document — several sections of the
 * same PDF come back as separate sources and would otherwise stack up as three
 * identical download cards.
 */
function forms(turn: Turn): Source[] {
    const byUrl = new Map<string, Source>();
    for (const source of turn.sources) {
        if (source.doc_type === "form" && source.url) byUrl.set(source.url, source);
    }
    return [...byUrl.values()];
}

/**
 * Citations, capped. A question the corpus answers badly makes the model search
 * four times over, and twelve pills under a thin answer reads as twelve reasons
 * not to trust it.
 */
const MAX_REFERENCES = 6;

function references(turn: Turn): Source[] {
    return turn.sources
        .filter((source) => source.doc_type !== "form" || !source.url)
        .slice(0, MAX_REFERENCES);
}

export function ChatPanel({ compact = false }: { compact?: boolean }) {
    const [question, setQuestion] = useState("");
    const [turns, setTurns] = useState<Turn[]>([]);
    const [busy, setBusy] = useState(false);
    const scrollerRef = useRef<HTMLDivElement>(null);

    // Scroll the message list itself. `scrollIntoView` on a child walks up every
    // scrollable ancestor and drags the whole page down with it, which is what
    // made this jump around on every streamed update.
    useEffect(() => {
        const scroller = scrollerRef.current;
        if (scroller) scroller.scrollTop = scroller.scrollHeight;
    }, [turns]);

    async function ask(text: string) {
        const asked = text.trim();
        if (!asked || busy) return;
        setBusy(true);
        setQuestion("");
        setTurns((t) => [...t, { question: asked, answer: "", sources: [], status: "Thinking…" }]);

        const update = (patch: Partial<Turn>) =>
            setTurns((t) => t.map((turn, i) => (i === t.length - 1 ? { ...turn, ...patch } : turn)));

        try {
            const response = await fetch("/api/ask", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ question: asked }),
            });

            if (!response.ok || !response.body) {
                const { error } = await response.json().catch(() => ({ error: null }));
                update({
                    status: null,
                    error: true,
                    answer: error ?? "Something went wrong. Try again shortly.",
                });
                return;
            }

            // The route sends server-sent events; a chunk can hold part of a frame
            // or several, so keep a buffer and only parse complete ones.
            const reader = response.body.getReader();
            const decoder = new TextDecoder();
            let buffer = "";

            for (;;) {
                const { done, value } = await reader.read();
                if (done) break;
                buffer += decoder.decode(value, { stream: true });
                const frames = buffer.split("\n\n");
                buffer = frames.pop() ?? "";

                for (const frame of frames) {
                    if (!frame.startsWith("data: ")) continue;
                    const event = JSON.parse(frame.slice(6));
                    if (event.type === "tool") {
                        update({ status: TOOL_LABELS[event.name] ?? "Working…" });
                    } else if (event.type === "busy") {
                        update({ status: null, error: true, answer: event.text });
                    } else if (event.type === "answer") {
                        update({ status: null, answer: event.text, sources: event.sources ?? [] });
                    }
                }
            }
        } catch {
            update({ status: null, error: true, answer: "Lost the connection. Try again." });
        } finally {
            setBusy(false);
        }
    }

    return (
        <div className="flex flex-col h-full min-h-0">
            <div
                ref={scrollerRef}
                className={`flex-1 min-h-0 overflow-y-auto space-y-4 ${compact ? "p-3" : "p-4"}`}
            >
                {turns.length === 0 && (
                    <div className="text-sm text-gray-600 space-y-3">
                        <div className="flex items-center gap-3 p-3.5 bg-white border-2 border-nust-blue rounded-2xl shadow-[3px_3px_0px_var(--nust-blue)]">
                            <div className="w-12 h-12 rounded-full border-2 border-nust-blue bg-white overflow-hidden shadow-xs shrink-0 flex items-center justify-center">
                                <img src="/images/bot-avatar.png" alt="NUST Nama Mascot" className="w-full h-full object-cover scale-110" />
                            </div>
                            <div>
                                <h3 className="font-heading text-lg text-nust-blue leading-tight">Hey! I&apos;m your NUST AI Guide</h3>
                                <p className="text-xs text-nust-blue/70 font-sans mt-0.5">
                                    Ask about campus rules, fees, forms, or what&apos;s happening!
                                </p>
                            </div>
                        </div>

                        <p className="text-xs text-nust-blue/70 font-medium px-1">
                            Every answer comes directly from official NUST documents and handbooks. Try asking:
                        </p>
                        <div className="flex flex-wrap gap-2">
                            {EXAMPLES.map((example) => (
                                <button
                                    key={example}
                                    onClick={() => ask(example)}
                                    className="border-2 border-nust-blue rounded-full px-3 py-1.5 text-xs font-sans font-medium bg-white text-nust-blue hover:bg-nust-orange hover:text-white transition-colors cursor-pointer shadow-[2px_2px_0px_var(--nust-blue)]"
                                >
                                    {example}
                                </button>
                            ))}
                        </div>
                    </div>
                )}

                {turns.map((turn, i) => (
                    <div key={i} className="space-y-2">
                        {/* Student, right — the usual side for "mine" in every chat app */}
                        <div className="flex justify-end">
                            <p className="max-w-[85%] bg-nust-blue text-white text-sm rounded-2xl rounded-br-sm px-3.5 py-2.5 break-words font-sans">
                                {turn.question}
                            </p>
                        </div>

                        <div className="flex justify-start items-start gap-2">
                            <div className="w-7 h-7 rounded-full border border-nust-blue bg-white overflow-hidden shadow-xs shrink-0 mt-0.5 flex items-center justify-center">
                                <img src="/images/bot-avatar.png" alt="Bot" className="w-full h-full object-cover scale-110" />
                            </div>

                            <div className="max-w-[88%] bg-white border-2 border-nust-blue rounded-2xl rounded-tl-sm px-3.5 py-2.5 space-y-2 shadow-[2px_2px_0px_rgba(27,58,107,0.1)]">
                                {turn.status && (
                                    <p className="text-sm text-gray-500 animate-pulse font-sans">{turn.status}</p>
                                )}

                                {turn.answer &&
                                    (turn.error ? (
                                        <p className="text-sm text-amber-700 font-sans">{turn.answer}</p>
                                    ) : (
                                        <AnswerText text={turn.answer} />
                                    ))}

                                {/* Forms first and unfolded: they are the thing the
                                    student came for, not a reference for the answer. */}
                                {forms(turn).length > 0 && (
                                    <div className="space-y-2 pt-1">
                                        {forms(turn).map((source) => (
                                            <FormCard key={source.section_id} source={source} />
                                        ))}
                                    </div>
                                )}

                                {references(turn).length > 0 && (
                                    <details className="text-xs">
                                        <summary className="cursor-pointer text-nust-blue font-bold">
                                            Where this came from ({references(turn).length})
                                        </summary>
                                        <div className="mt-2 flex flex-wrap gap-1.5">
                                            {references(turn).map((source) => (
                                                <Citation key={source.section_id} source={source} />
                                            ))}
                                        </div>
                                    </details>
                                )}
                            </div>
                        </div>
                    </div>
                ))}
            </div>

            <form
                onSubmit={(e) => {
                    e.preventDefault();
                    ask(question);
                }}
                className="flex gap-2 border-t-2 border-nust-blue bg-white p-3"
            >
                <input
                    value={question}
                    onChange={(e) => setQuestion(e.target.value)}
                    placeholder="Ask about NUST…"
                    className="flex-1 min-w-0 border-2 border-nust-blue rounded-full px-4 py-2 text-sm outline-none focus:border-nust-orange"
                />
                <button
                    type="submit"
                    disabled={busy || !question.trim()}
                    className="bg-nust-orange text-nust-blue font-bold rounded-full px-4 py-2 text-sm disabled:opacity-50"
                >
                    {busy ? "…" : "Ask"}
                </button>
            </form>

            {compact && (
                <Link href="/ask" className="text-xs text-nust-blue underline px-3 pb-2">
                    Open the full page
                </Link>
            )}
        </div>
    );
}
