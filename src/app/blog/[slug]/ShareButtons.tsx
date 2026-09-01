"use client";

import { useState } from "react";
import { Check, Copy, MessageCircle } from "lucide-react";

export function ShareButtons({ title, url }: { title: string; url: string }) {
    const [copied, setCopied] = useState(false);

    function copyToClipboard() {
        navigator.clipboard.writeText(url);
        setCopied(true);
        setTimeout(() => setCopied(false), 2500);
    }

    const whatsappUrl = `https://api.whatsapp.com/send?text=${encodeURIComponent(
        `Check out this NUST guide: ${title}\n${url}`
    )}`;

    const twitterUrl = `https://twitter.com/intent/tweet?text=${encodeURIComponent(
        `${title} via @NUSTNama\n${url}`
    )}`;

    return (
        <div className="flex items-center gap-2">
            <span className="text-xs font-bold text-nust-blue uppercase mr-1 hidden sm:inline">
                Share:
            </span>

            {/* WhatsApp Share Button */}
            <a
                href={whatsappUrl}
                target="_blank"
                rel="noopener noreferrer"
                aria-label="Share on WhatsApp"
                className="w-9 h-9 rounded-xl bg-green-600 hover:bg-green-700 text-white flex items-center justify-center border-2 border-nust-blue shadow-[2px_2px_0px_var(--nust-blue)] hover:translate-y-[-1px] transition-all cursor-pointer"
            >
                <MessageCircle className="w-4 h-4" />
            </a>

            {/* Twitter / X Share Button */}
            <a
                href={twitterUrl}
                target="_blank"
                rel="noopener noreferrer"
                aria-label="Share on X"
                className="w-9 h-9 rounded-xl bg-black hover:bg-gray-800 text-white flex items-center justify-center border-2 border-nust-blue shadow-[2px_2px_0px_var(--nust-blue)] hover:translate-y-[-1px] transition-all cursor-pointer"
            >
                <svg className="w-4 h-4 fill-current" viewBox="0 0 24 24">
                    <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 23.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z" />
                </svg>
            </a>

            {/* Copy Link Button */}
            <button
                type="button"
                onClick={copyToClipboard}
                aria-label="Copy link"
                className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-white hover:bg-cream text-nust-blue text-xs font-bold border-2 border-nust-blue shadow-[2px_2px_0px_var(--nust-blue)] hover:translate-y-[-1px] transition-all cursor-pointer"
            >
                {copied ? (
                    <>
                        <Check className="w-3.5 h-3.5 text-green-600" />
                        <span className="text-green-700">Copied!</span>
                    </>
                ) : (
                    <>
                        <Copy className="w-3.5 h-3.5 text-nust-blue" />
                        <span>Copy Link</span>
                    </>
                )}
            </button>
        </div>
    );
}
