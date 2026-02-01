import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@supabase/supabase-js";

// Supabase admin client (bypasses RLS)
const supabaseAdmin = createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.SUPABASE_SERVICE_ROLE_KEY!
);

// Expected payload structure from automation tools
interface IngestEventPayload {
    title: string;
    description?: string;
    start_time: string; // ISO format
    end_time?: string; // ISO format
    venue_name?: string;
    venue_lat?: number;
    venue_lng?: number;
    tags?: string[];
    is_official?: boolean;
    registration_url?: string;
    source?: string; // e.g., "instagram", "nust_website", "facebook"
    external_id?: string; // Original ID from source
    poster_url?: string;
}

export async function POST(request: NextRequest) {
    try {
        // 1. Verify API Secret Key
        const apiKey = request.headers.get("x-api-secret");
        const expectedKey = process.env.INGEST_API_SECRET_KEY;

        if (!expectedKey) {
            console.error("INGEST_API_SECRET_KEY not configured");
            return NextResponse.json(
                { error: "Server misconfiguration" },
                { status: 500 }
            );
        }

        if (apiKey !== expectedKey) {
            return NextResponse.json(
                { error: "Unauthorized" },
                { status: 401 }
            );
        }

        // 2. Parse and validate payload
        const body: IngestEventPayload = await request.json();

        if (!body.title || !body.start_time) {
            return NextResponse.json(
                { error: "Missing required fields: title and start_time are required" },
                { status: 400 }
            );
        }

        // Validate date format
        const startTime = new Date(body.start_time);
        if (isNaN(startTime.getTime())) {
            return NextResponse.json(
                { error: "Invalid start_time format. Use ISO 8601 format." },
                { status: 400 }
            );
        }

        // 3. Check for duplicates by external_id
        if (body.external_id) {
            const { data: existing } = await supabaseAdmin
                .from("events")
                .select("id")
                .eq("external_id", body.external_id)
                .single();

            if (existing) {
                return NextResponse.json(
                    { 
                        message: "Event already exists",
                        event_id: existing.id,
                        duplicate: true 
                    },
                    { status: 200 }
                );
            }
        }

        // 4. Prepare event data
        const eventData = {
            title: body.title,
            description: body.description || null,
            start_time: startTime.toISOString(),
            end_time: body.end_time ? new Date(body.end_time).toISOString() : null,
            venue_name: body.venue_name || null,
            venue_lat: body.venue_lat || null,
            venue_lng: body.venue_lng || null,
            tags: body.tags || [],
            is_official: body.is_official ?? false,
            registration_url: body.registration_url || null,
            external_id: body.external_id || null,
            poster_url: body.poster_url || null,
            // Auto-approve events from trusted sources
            status: body.is_official ? "approved" : "pending",
            // No created_by for automated events
            created_by: null,
        };

        // 5. Insert event
        const { data, error } = await supabaseAdmin
            .from("events")
            .insert(eventData)
            .select("id")
            .single();

        if (error) {
            console.error("Error inserting event:", error);
            return NextResponse.json(
                { error: "Failed to insert event", details: error.message },
                { status: 500 }
            );
        }

        return NextResponse.json(
            { 
                message: "Event created successfully",
                event_id: data.id,
                status: eventData.status
            },
            { status: 201 }
        );

    } catch (error: any) {
        console.error("Ingest webhook error:", error);
        return NextResponse.json(
            { error: "Internal server error", details: error.message },
            { status: 500 }
        );
    }
}

// GET endpoint for health check
export async function GET() {
    return NextResponse.json({ 
        status: "ok",
        endpoint: "Event Ingestion Webhook",
        version: "1.0",
        documentation: {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
                "x-api-secret": "YOUR_SECRET_KEY"
            },
            body: {
                title: "string (required)",
                description: "string (optional)",
                start_time: "ISO 8601 datetime (required)",
                end_time: "ISO 8601 datetime (optional)",
                venue_name: "string (optional)",
                venue_lat: "number (optional)",
                venue_lng: "number (optional)",
                tags: "string[] (optional)",
                is_official: "boolean (optional, default: false)",
                registration_url: "string (optional)",
                external_id: "string (optional, for deduplication)",
                poster_url: "string (optional)",
                source: "string (optional, e.g., 'instagram', 'nust_website')"
            }
        }
    });
}
