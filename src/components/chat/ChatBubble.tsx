"use client";

import { useState } from "react";
import { ChatPanel } from "./ChatPanel";

/** Floating launcher. Renders the same panel as /ask, compact. */
export function ChatBubble() {
    const [open, setOpen] = useState(false);

    return (
        <>
            {open && (
                <div className="fixed inset-x-2 bottom-20 sm:inset-x-auto sm:right-4 sm:w-96 h-[70vh] max-h-[560px] z-50 flex flex-col bg-cream border-2 border-nust-blue shadow-[6px_6px_0px_var(--nust-blue)]">
                    <div className="flex items-center justify-between bg-nust-blue text-white px-3 py-2">
                        <span className="font-heading tracking-wide">ASK NUST NAMA</span>
                        <button onClick={() => setOpen(false)} aria-label="Close chat" className="px-2">
                            ✕
                        </button>
                    </div>
                    <ChatPanel compact />
                </div>
            )}

            <button
                onClick={() => setOpen((o) => !o)}
                aria-label="Ask NUST Nama"
                className="fixed bottom-4 right-4 z-50 h-14 w-14 rounded-full bg-nust-orange text-nust-blue text-2xl font-bold border-2 border-nust-blue shadow-[3px_3px_0px_var(--nust-blue)] hover:translate-y-[2px] hover:shadow-none transition-all"
            >
                {open ? "✕" : "?"}
            </button>
        </>
    );
}
