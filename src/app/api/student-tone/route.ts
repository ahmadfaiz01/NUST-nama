import { NextRequest, NextResponse } from "next/server";

export async function POST(request: NextRequest) {
    try {
        const { title, summary } = await request.json();

        if (!title && !summary) {
            return NextResponse.json({ error: "Title or summary is required" }, { status: 400 });
        }

        const apiKey = process.env.GEMINI_API_KEY;

        console.log("API Key exists:", !!apiKey);
        console.log("API Key length:", apiKey?.length);

        if (!apiKey) {
            console.error("GEMINI_API_KEY not found in environment variables");
            return NextResponse.json(
                { error: "Gemini API key not configured. Restart your dev server (Ctrl+C then npm run dev)" },
                { status: 500 }
            );
        }

        const prompt = `You're helping rewrite university news for Pakistani Gen-Z students.

VIBE CHECK:
- Keep it real and lowkey informative
- Light humor is fine, but NO cringe (no "slay", "bestie", or overdone slang)
- Pakistani uni student energy - like you're telling your friend about it
- Use emojis but don't overdo it (1-2 max)
- Keep important info intact
- Short and snappy - no essays

Original Title: "${title || 'N/A'}"
Original Summary: "${summary || 'N/A'}"

Return ONLY valid JSON (no markdown, no code blocks):
{"title": "rewritten title", "summary": "rewritten summary"}`;

        console.log("Calling Gemini API...");

        const response = await fetch(
            `https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent?key=${apiKey}`,
            {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({
                    contents: [
                        {
                            parts: [{ text: prompt }],
                        },
                    ],
                    generationConfig: {
                        temperature: 0.7,
                        maxOutputTokens: 300,
                    },
                }),
            }
        );

        console.log("Gemini response status:", response.status);

        if (!response.ok) {
            const errorData = await response.text();
            console.error("Gemini API error response:", errorData);
            
            // Parse the error to give a better message
            try {
                const errorJson = JSON.parse(errorData);
                const errorMessage = errorJson.error?.message || "Unknown API error";
                return NextResponse.json(
                    { error: `Gemini API error: ${errorMessage}` },
                    { status: 500 }
                );
            } catch {
                return NextResponse.json(
                    { error: `Gemini API error: ${response.status} ${response.statusText}` },
                    { status: 500 }
                );
            }
        }

        const data = await response.json();
        console.log("Gemini response data:", JSON.stringify(data).substring(0, 200));
        
        const generatedText = data.candidates?.[0]?.content?.parts?.[0]?.text || "";

        // Try to parse the JSON response
        try {
            // Clean up the response - remove markdown code blocks if present
            const cleanedText = generatedText
                .replace(/```json\n?/g, '')
                .replace(/```\n?/g, '')
                .trim();
            
            console.log("Cleaned text:", cleanedText);
            
            const parsed = JSON.parse(cleanedText);
            return NextResponse.json({
                title: parsed.title || title,
                summary: parsed.summary || summary
            });
        } catch {
            // If JSON parsing fails, return the original with the generated text as summary
            console.error("Failed to parse Gemini response:", generatedText);
            return NextResponse.json({
                title: title,
                summary: generatedText.trim() || summary
            });
        }
    } catch (error) {
        console.error("Student tone API error:", error);
        return NextResponse.json(
            { error: `Server error: ${error instanceof Error ? error.message : "Unknown error"}` },
            { status: 500 }
        );
    }
}
