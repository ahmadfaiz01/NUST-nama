import type { Metadata } from "next";
import { ChatPanel } from "@/components/chat/ChatPanel";

export const metadata: Metadata = {
    title: "Ask NUST Nama | Campus rules, fees and forms",
    description:
        "Ask a question about NUST and get an answer from NUST's own handbooks, policies and forms, with a link to the original document.",
};

export default function AskPage() {
    return (
        <div className="container max-w-3xl pb-10">
            <h1 className="font-heading text-4xl text-nust-blue tracking-wide">ASK NUST NAMA</h1>
            <p className="text-sm text-gray-600 mb-4">
                Answers come from NUST&apos;s own documents. Every one carries its source, so you
                can check it yourself.
            </p>
            <div className="h-[70vh] bg-white border-2 border-nust-blue shadow-[6px_6px_0px_var(--nust-blue)] px-4">
                <ChatPanel />
            </div>
        </div>
    );
}
