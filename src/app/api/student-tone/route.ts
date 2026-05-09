import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";

const SYSTEM_PROMPT = `You rewrite university news for Pakistani Gen-Z students.

VIBE CHECK:
- Keep it real and lowkey informative
- Light humor is fine, but NO cringe (no "slay", "bestie", or overdone slang)
- Pakistani uni student energy - like you're telling your friend about it
- Use emojis but don't overdo it (1-2 max)
- Keep important info intact
- Short and snappy - no essays

Reply with JSON only: {"title": "rewritten title", "summary": "rewritten summary"}`;

export async function POST(request: NextRequest) {
    // Admin/moderator only - this endpoint spends API credits
    const supabase = await createClient();
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

    const { data: profile } = await supabase
        .from("profiles")
        .select("role")
        .eq("id", user.id)
        .single();

    if (profile?.role !== "admin" && profile?.role !== "moderator") {
        return NextResponse.json({ error: "Forbidden" }, { status: 403 });
    }

    const { title, summary } = await request.json();
    if (!title && !summary) {
        return NextResponse.json({ error: "Title or summary is required" }, { status: 400 });
    }

    const apiKey = process.env.GROQ_API_KEY;
    if (!apiKey) {
        return NextResponse.json({ error: "GROQ_API_KEY not configured" }, { status: 500 });
    }

    const response = await fetch("https://api.groq.com/openai/v1/chat/completions", {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${apiKey}`,
        },
        body: JSON.stringify({
            model: "llama-3.3-70b-versatile",
            temperature: 0.7,
            max_tokens: 300,
            response_format: { type: "json_object" },
            messages: [
                { role: "system", content: SYSTEM_PROMPT },
                {
                    role: "user",
                    content: `Original Title: "${title || "N/A"}"\nOriginal Summary: "${summary || "N/A"}"`,
                },
            ],
        }),
    });

    if (!response.ok) {
        const detail = await response.text();
        console.error("Groq API error:", response.status, detail);
        return NextResponse.json(
            { error: `Groq API error: ${response.status}` },
            { status: 502 }
        );
    }

    const data = await response.json();
    const raw = data.choices?.[0]?.message?.content ?? "";

    try {
        const parsed = JSON.parse(raw);
        return NextResponse.json({
            title: parsed.title || title,
            summary: parsed.summary || summary,
        });
    } catch {
        console.error("Groq returned non-JSON:", raw);
        return NextResponse.json({ error: "Model returned invalid JSON" }, { status: 502 });
    }
}
