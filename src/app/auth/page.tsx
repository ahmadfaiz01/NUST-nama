"use client";

import Link from "next/link";
import { useState } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import { Suspense } from "react";
import { createClient } from "@/lib/supabase/client";

function AuthForm() {
    const searchParams = useSearchParams();
    const router = useRouter();
    const isSignup = searchParams.get("mode") === "signup";
    const errorParam = searchParams.get("error");

    const [mode, setMode] = useState<"login" | "signup">(isSignup ? "signup" : "login");
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(
        errorParam ? decodeURIComponent(errorParam) : null
    );
    const [success, setSuccess] = useState<string | null>(null);

    // Form fields
    const [name, setName] = useState("");
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [school, setSchool] = useState("");

    // Admin emails that bypass NUST email check
    const ADMIN_EMAILS = [
        "itsahmadfaiz@gmail.com",
        "rameenarshad0121@gmail.com"
    ];

    const isAdminEmail = (email: string) => {
        return ADMIN_EMAILS.includes(email.toLowerCase().trim());
    };

    const isValidNustEmail = (email: string) => {
        // Allow admin emails to bypass the check
        if (isAdminEmail(email)) return true;
        return email.endsWith(".nust.edu.pk") || email.endsWith("@nust.edu.pk") || email.endsWith("@seecs.edu.pk") || email.endsWith(".seecs.edu.pk");
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setError(null);
        setSuccess(null);

        // Validate NUST email
        if (mode === "signup" && !isValidNustEmail(email)) {
            setError("Please use your official NUST or SEECS email (e.g., xyz.bscs23seecs@seecs.edu.pk)");
            return;
        }

        setLoading(true);
        const supabase = createClient();

        try {
            if (mode === "signup") {
                const { error } = await supabase.auth.signUp({
                    email,
                    password,
                    options: {
                        data: {
                            full_name: name,
                            school: school,
                        },
                        emailRedirectTo: `${window.location.origin}/auth/callback`,
                    },
                });

                if (error) throw error;

                setSuccess("🎉 Check your email! We've sent a confirmation link to verify your account.");
            } else {
                const { error } = await supabase.auth.signInWithPassword({
                    email,
                    password,
                });

                if (error) {
                    if (error.message.includes("Email not confirmed")) {
                        throw new Error("Please verify your email first. Check your inbox for the confirmation link.");
                    }
                    throw error;
                }

                // Force hard redirect to home on successful login (faster and more reliable)
                window.location.href = "/";
                return;
            }
        } catch (err: any) {
            setError(err.message || "An error occurred. Please try again.");
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="min-h-screen bg-cream flex">
            {/* Left Panel - Form */}
            <div className="flex-1 flex items-center justify-center p-8">
                <div className="w-full max-w-md">
                    {/* Logo */}
                    <Link href="/" className="flex items-center gap-2 mb-8">
                        <div className="w-12 h-12 bg-nust-blue rounded-full border-2 border-nust-orange flex items-center justify-center shadow-[2px_2px_0px_var(--nust-orange)]">
                            <span className="font-heading text-2xl text-white">W</span>
                        </div>
                        <div className="flex flex-col leading-none">
                            <span className="font-heading text-2xl text-nust-blue">WHAT&apos;S UP</span>
                            <span className="font-display text-xs font-bold text-nust-orange tracking-widest">NUST</span>
                        </div>
                    </Link>

                    {/* Tabs */}
                    <div className="flex gap-2 mb-8">
                        <button
                            onClick={() => { setMode("login"); setError(null); setSuccess(null); }}
                            className={`flex-1 py-3 font-heading text-xl rounded-full border-2 transition-all ${mode === "login"
                                ? "bg-nust-blue text-white border-nust-blue"
                                : "bg-white text-nust-blue border-nust-blue hover:bg-nust-blue/5"
                                }`}
                        >
                            Sign In
                        </button>
                        <button
                            onClick={() => { setMode("signup"); setError(null); setSuccess(null); }}
                            className={`flex-1 py-3 font-heading text-xl rounded-full border-2 transition-all ${mode === "signup"
                                ? "bg-nust-blue text-white border-nust-blue"
                                : "bg-white text-nust-blue border-nust-blue hover:bg-nust-blue/5"
                                }`}
                        >
                            Sign Up
                        </button>
                    </div>

                    {/* Error Message */}
                    {error && (
                        <div className="mb-4 p-3 bg-red-100 border-2 border-red-400 rounded-lg text-red-700 text-sm">
                            ❌ {error}
                        </div>
                    )}

                    {/* Success Message */}
                    {success && (
                        <div className="mb-4 p-3 bg-green-100 border-2 border-green-400 rounded-lg text-green-700 text-sm">
                            {success}
                        </div>
                    )}

                    {/* Form */}
                    <form className="space-y-4" onSubmit={handleSubmit}>
                        {mode === "signup" && (
                            <div>
                                <label className="block font-display text-sm font-bold text-nust-blue mb-2 uppercase tracking-wide">
                                    Full Name
                                </label>
                                <input
                                    type="text"
                                    value={name}
                                    onChange={(e) => setName(e.target.value)}
                                    placeholder="Ahmed Khan"
                                    required
                                    className="w-full px-4 py-3 rounded-lg border-2 border-nust-blue bg-white text-nust-blue placeholder:text-nust-blue/40 focus:outline-none focus:ring-2 focus:ring-nust-orange"
                                />
                            </div>
                        )}

                        <div>
                            <label className="block font-display text-sm font-bold text-nust-blue mb-2 uppercase tracking-wide">
                                NUST Email
                            </label>
                            <input
                                name="email"
                                type="email"
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                                placeholder="xyz.bscs23seecs@seecs.edu.pk"
                                required
                                className="w-full px-4 py-3 rounded-lg border-2 border-nust-blue bg-white text-nust-blue placeholder:text-nust-blue/40 focus:outline-none focus:ring-2 focus:ring-nust-orange"
                            />
                            {mode === "signup" && (
                                <p className="text-xs text-nust-blue/60 mt-1">
                                    Only <strong>@*.nust.edu.pk</strong> and <strong>@seecs.edu.pk</strong> allowed.
                                </p>
                            )}
                        </div>

                        <div>
                            <label className="block font-display text-sm font-bold text-nust-blue mb-2 uppercase tracking-wide">
                                Password
                            </label>
                            <input
                                type="password"
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                                placeholder="••••••••"
                                required
                                minLength={6}
                                className="w-full px-4 py-3 rounded-lg border-2 border-nust-blue bg-white text-nust-blue placeholder:text-nust-blue/40 focus:outline-none focus:ring-2 focus:ring-nust-orange"
                            />
                        </div>

                        {mode === "signup" && (
                            <div>
                                <label className="block font-display text-sm font-bold text-nust-blue mb-2 uppercase tracking-wide">
                                    School/Department
                                </label>
                                <select
                                    value={school}
                                    onChange={(e) => setSchool(e.target.value)}
                                    required
                                    className="w-full px-4 py-3 rounded-lg border-2 border-nust-blue bg-white text-nust-blue focus:outline-none focus:ring-2 focus:ring-nust-orange"
                                >
                                    <option value="">Select your school</option>
                                    <option value="seecs">SEECS</option>
                                    <option value="smme">SMME</option>
                                    <option value="scme">SCME</option>
                                    <option value="sada">SADA</option>
                                    <option value="nbs">NBS</option>
                                    <option value="s3h">S3H</option>
                                    <option value="nice">NICE</option>
                                    <option value="rcms">RCMS</option>
                                    <option value="asab">ASAB</option>
                                    <option value="sns">SNS</option>
                                    <option value="other">Other</option>
                                </select>
                            </div>
                        )}

                        {mode === "login" && (
                            <div className="flex items-center justify-between">
                                <label className="flex items-center gap-2 cursor-pointer">
                                    <input type="checkbox" className="w-4 h-4 rounded border-nust-blue" />
                                    <span className="text-sm text-nust-blue/70">Remember me</span>
                                </label>
                                <Link href="/auth/forgot" className="text-sm text-nust-orange hover:underline">
                                    Forgot password?
                                </Link>
                            </div>
                        )}

                        <button
                            type="submit"
                            disabled={loading}
                            className="w-full btn bg-nust-blue text-white text-lg py-4 shadow-[4px_4px_0px_var(--nust-orange)] hover:shadow-[2px_2px_0px_var(--nust-orange)] hover:translate-y-[2px] transition-all disabled:opacity-50 disabled:cursor-not-allowed"
                        >
                            {loading ? "Please wait..." : mode === "login" ? "Sign In" : "Create Account"}
                        </button>
                    </form>

                    {/* Email confirmation notice */}
                    {mode === "signup" && !success && (
                        <div className="mt-6 p-4 bg-nust-orange/10 border-2 border-nust-orange rounded-lg">
                            <p className="text-sm text-nust-blue text-center">
                                📧 <strong>You&apos;ll receive a confirmation email</strong> to verify your NUST address before logging in.
                            </p>
                        </div>
                    )}

                    {/* Terms */}
                    {mode === "signup" && (
                        <p className="text-center text-nust-blue/50 text-sm mt-6">
                            By creating an account, you agree to our{" "}
                            <Link href="/terms" className="text-nust-orange hover:underline">Terms</Link>
                            {" "}and{" "}
                            <Link href="/privacy" className="text-nust-orange hover:underline">Privacy Policy</Link>
                        </p>
                    )}
                </div>
            </div>

            {/* Right Panel - Visual (Hidden on mobile) */}
            <div
                className="hidden lg:flex flex-1 items-center justify-center relative"
                style={{
                    backgroundColor: "var(--nust-blue)",
                    backgroundImage: `linear-gradient(var(--nust-orange) 1px, transparent 1px), linear-gradient(90deg, var(--nust-orange) 1px, transparent 1px)`,
                    backgroundSize: "60px 60px",
                }}
            >
                <div className="text-center p-12">
                    <h2 className="text-5xl text-white mb-4 drop-shadow-[4px_4px_0px_var(--nust-orange)]">
                        NEVER MISS<br />A MOMENT
                    </h2>
                    <p className="text-white/80 text-lg max-w-md">
                        Join the community of NUST students who stay connected to everything happening on campus.
                    </p>

                    {/* Floating stickers */}
                    <div className="absolute top-20 right-20 w-20 h-20 bg-nust-orange rounded-full flex items-center justify-center rotate-12 shadow-lg animate-float">
                        <span className="text-3xl">🎉</span>
                    </div>
                    <div className="absolute bottom-32 left-20 w-16 h-16 bg-white rounded-full flex items-center justify-center -rotate-6 shadow-lg animate-float" style={{ animationDelay: "0.5s" }}>
                        <span className="text-2xl">🔥</span>
                    </div>
                </div>
            </div>
        </div>
    );
}

export default function AuthPage() {
    return (
        <Suspense fallback={<div className="min-h-screen bg-cream flex items-center justify-center">Loading...</div>}>
            <AuthForm />
        </Suspense>
    );
}
