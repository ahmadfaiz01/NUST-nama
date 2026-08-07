import type { Metadata } from "next";
import { ChatPanel } from "@/components/chat/ChatPanel";

export const metadata: Metadata = {
    title: "Ask NUST Nama | Campus rules, fees and forms",
    description:
        "Ask a question about NUST and get an answer from NUST's own handbooks, policies and forms, with a link to the original document.",
};

export default function AskPage() {
    return (
        // The panel scrolls internally, so the page itself must not: a chat that
        // scrolls the whole window pushes the input box off the screen mid-answer.
        <div className="container max-w-3xl h-[calc(100dvh-7rem)] pb-4 flex flex-col min-h-0">
            <div className="flex-1 min-h-0 flex flex-col bg-cream border-2 border-nust-blue shadow-[6px_6px_0px_var(--nust-blue)] overflow-hidden">
                <div className="flex items-center gap-3 bg-nust-blue text-white px-4 py-3 shrink-0">
                    <span className="text-2xl" aria-hidden>
                        🤖
                    </span>
                    <div className="min-w-0">
                        <h1 className="font-heading text-2xl tracking-wide leading-none">
                            ASK NUST NAMA
                        </h1>
                        <p className="text-xs text-white/70 truncate">
                            Answers from NUST&apos;s own handbooks, policies and forms
                        </p>
                    </div>
                </div>

                <ChatPanel />
            </div>
        </div>
    );
}
