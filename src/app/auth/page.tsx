"use client";

import Link from "next/link";
import { useState } from "react";
import { useSearchParams } from "next/navigation";
import { Suspense } from "react";
import { createClient } from "@/lib/supabase/client";

// ─── Google icon SVG ─────────────────────────────────────────────────────────
function GoogleIcon() {
    return (
        <svg width="20" height="20" viewBox="0 0 24 24" aria-hidden="true">
            <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" />
            <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" />
            <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l3.66-2.84z" />
            <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" />
        </svg>
    );
}

function AuthForm() {
    const searchParams = useSearchParams();
    const errorParam = searchParams.get("error");

    const getErrorDisplay = (raw: string | null) => {
        if (!raw) return null;
        const msg = decodeURIComponent(raw).toLowerCase();
        if (msg.includes("access denied") || msg.includes("only @nust") || msg.includes("nust.edu.pk")) {
            return { type: "info" as const, text: "Only official @nust.edu.pk and NUST school accounts are permitted." };
        }
        if (msg.includes("invalid_callback") || msg.includes("invalid callback")) {
            return { type: "info" as const, text: "Only official @nust.edu.pk and NUST school accounts are permitted." };
        }
        return { type: "error" as const, text: decodeURIComponent(raw) };
    };

    const errorDisplay = getErrorDisplay(errorParam);

    const [loading, setLoading] = useState(false);
    const [runtimeError, setRuntimeError] = useState<string | null>(null);

    const handleGoogleSignIn = async () => {
        setLoading(true);
        setRuntimeError(null);
        const supabase = createClient();

        const { error } = await supabase.auth.signInWithOAuth({
            provider: "google",
            options: {
                redirectTo: `${window.location.origin}/auth/callback`,
                queryParams: {
                    prompt: "select_account",
                },
            },
        });

        if (error) {
            setRuntimeError(error.message);
            setLoading(false);
        }
    };

    return (
        <div
            className="min-h-[calc(100vh-5rem)] flex items-center justify-center p-4 md:p-6"
            style={{
                backgroundColor: "var(--cream)",
                backgroundImage: `linear-gradient(var(--nust-blue) 1px, transparent 1px), linear-gradient(90deg, var(--nust-blue) 1px, transparent 1px)`,
                backgroundSize: "100px 100px",
            }}
        >
            <div className="w-full max-w-md bg-white border-2 border-nust-blue rounded-2xl p-8 md:p-10 shadow-[6px_6px_0px_var(--nust-blue)] text-center">
                {/* Logo */}
                <Link href="/" className="inline-block mb-4">
                    <img
                        src="/android-chrome-192x192.png"
                        alt="NUST Nama"
                        className="h-20 w-20 mx-auto"
                        style={{ objectFit: "contain" }}
                    />
                </Link>

                <h1 className="font-heading text-4xl text-nust-blue mb-2">
                    SIGN IN
                </h1>
                <p className="font-display text-nust-blue/70 text-base mb-8">
                    Use your official NUST Google account to continue.
                </p>

                {/* Friendly notice if non-NUST email was used */}
                {errorDisplay?.type === "info" && (
                    <div className="mb-6 p-4 bg-nust-orange/15 border-2 border-nust-orange rounded-xl text-nust-blue text-sm font-display text-left">
                        🎓 <strong>NUST accounts only.</strong> {errorDisplay.text}
                    </div>
                )}

                {/* Error */}
                {(errorDisplay?.type === "error" || runtimeError) && (
                    <div className="mb-6 p-3 bg-red-50 border-2 border-red-300 rounded-xl text-red-600 text-xs font-display text-left">
                        ❌ {runtimeError ?? errorDisplay?.text}
                    </div>
                )}

                {/* Google Sign In Button */}
                <button
                    onClick={handleGoogleSignIn}
                    disabled={loading}
                    className="w-full flex items-center justify-center gap-3 py-3.5 px-6 rounded-xl border-2 border-nust-blue bg-white hover:bg-cream transition-all shadow-[4px_4px_0px_var(--nust-blue)] hover:shadow-[2px_2px_0px_var(--nust-blue)] hover:translate-x-[2px] hover:translate-y-[2px] disabled:opacity-50 disabled:cursor-not-allowed cursor-pointer mb-6"
                >
                    {loading ? (
                        <div className="w-5 h-5 border-2 border-nust-blue/30 border-t-nust-blue rounded-full animate-spin" />
                    ) : (
                        <GoogleIcon />
                    )}
                    <span className="font-heading text-lg text-nust-blue tracking-wide">
                        {loading ? "Redirecting..." : "Continue with Google"}
                    </span>
                </button>

                {/* Domain restriction */}
                <p className="text-xs text-nust-blue/60 font-display leading-relaxed">
                    Only <strong>@nust.edu.pk</strong> and NUST school emails (e.g. <strong>@seecs.edu.pk</strong>) are allowed.
                </p>
            </div>
        </div>
    );
}

export default function AuthPage() {
    return (
        <Suspense fallback={<div className="min-h-screen bg-cream flex items-center justify-center font-heading text-nust-blue">Loading...</div>}>
            <AuthForm />
        </Suspense>
    );
}
