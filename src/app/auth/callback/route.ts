import { createClient } from '@/lib/supabase/server';
import { NextResponse } from 'next/server';

// ─── NUST domain allowlist ────────────────────────────────────────────────────
// Matches:  anything@nust.edu.pk
//           anything@seecs.edu.pk (and any other school domain)
//           anything@subdomain.nust.edu.pk  (e.g. sub.seecs.edu.pk)
const NUST_DOMAIN_REGEX =
    /^[^@]+@([a-z0-9.-]+\.)?(nust|seecs|smme|scme|s3h|igis|nbc|asab|sada|mcs|ceme|nice|pnec)\.edu\.pk$/i;

// Admin emails that bypass the domain restriction (your dev accounts)
const ADMIN_EMAILS = [
    'itsahmadfaiz@gmail.com',
    'rameenarshad0121@gmail.com',
];

function isAllowedEmail(email: string): boolean {
    const normalized = email.toLowerCase().trim();
    if (ADMIN_EMAILS.includes(normalized)) return true;
    return NUST_DOMAIN_REGEX.test(normalized);
}

export async function GET(request: Request) {
    const { searchParams, origin } = new URL(request.url);
    const code = searchParams.get('code');
    const next = searchParams.get('next') ?? '/';

    if (!code) {
        return NextResponse.redirect(`${origin}/auth?error=invalid_callback`);
    }

    const supabase = await createClient();

    // Exchange the OAuth code for a session
    const { data, error } = await supabase.auth.exchangeCodeForSession(code);

    if (error || !data.user) {
        console.error('[auth/callback] Code exchange error:', error?.message);
        return NextResponse.redirect(
            `${origin}/auth?error=${encodeURIComponent(error?.message ?? 'Authentication failed')}`
        );
    }

    const email = data.user.email ?? '';

    // ─── NUST domain enforcement ───────────────────────────────────────────
    if (!isAllowedEmail(email)) {
        console.warn(`[auth/callback] Blocked non-NUST email: ${email}`);

        // Sign the user out immediately so no session is persisted
        await supabase.auth.signOut();

        // Best-effort: also delete their auth record so they can't retry
        // (uses service role only if SUPABASE_SERVICE_ROLE_KEY is available server-side)
        // This is a soft attempt — even if it fails, signOut above is sufficient
        try {
            const { createClient: createServiceClient } = await import('@supabase/supabase-js');
            const serviceClient = createServiceClient(
                process.env.NEXT_PUBLIC_SUPABASE_URL!,
                process.env.SUPABASE_SERVICE_ROLE_KEY!,
                { auth: { persistSession: false } }
            );
            await serviceClient.auth.admin.deleteUser(data.user.id);
        } catch {
            // Non-fatal — the signOut above already protects the session
        }

        return NextResponse.redirect(
            `${origin}/auth?error=${encodeURIComponent(
                'Access denied. Only @nust.edu.pk and NUST school emails are allowed.'
            )}`
        );
    }

    // ─── Allowed — redirect to intended page ──────────────────────────────
    return NextResponse.redirect(`${origin}${next}`);
}
