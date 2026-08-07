"use client";

import { useState, useRef, useEffect } from "react";
import Link from "next/link";
import { Citation } from "./Citation";
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
                    <div className="text-sm text-gray-600">
                        <p className="mb-3">
                            Ask about NUST&apos;s rules, fees, forms or what&apos;s on campus. Every
                            answer comes from NUST&apos;s own documents, with a link to the original.
                        </p>
                        <div className="flex flex-wrap gap-2">
                            {EXAMPLES.map((example) => (
                                <button
                                    key={example}
                                    onClick={() => ask(example)}
                                    className="border-2 border-nust-blue rounded-full px-3 py-1 text-xs bg-white hover:bg-nust-orange hover:text-nust-blue transition-colors"
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
                            <p className="max-w-[85%] bg-nust-blue text-white text-sm rounded-2xl rounded-br-sm px-3 py-2 break-words">
                                {turn.question}
                            </p>
                        </div>

                        <div className="flex justify-start">
                            <div className="max-w-[90%] bg-white border-2 border-nust-blue rounded-2xl rounded-bl-sm px-3 py-2 space-y-2">
                                {turn.status && (
                                    <p className="text-sm text-gray-500 animate-pulse">{turn.status}</p>
                                )}

                                {turn.answer && (
                                    <p
                                        className={`text-sm leading-relaxed whitespace-pre-wrap break-words ${turn.error ? "text-amber-700" : ""
                                            }`}
                                    >
                                        {turn.answer}
                                    </p>
                                )}

                                {turn.sources.length > 0 && (
                                    <details className="text-xs">
                                        <summary className="cursor-pointer text-nust-blue font-bold">
                                            Where this came from ({turn.sources.length})
                                        </summary>
                                        <ul className="mt-2 space-y-2">
                                            {turn.sources.map((source) => (
                                                <Citation key={source.section_id} source={source} />
                                            ))}
                                        </ul>
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
