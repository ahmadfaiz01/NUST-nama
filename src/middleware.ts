import { updateSession } from '@/lib/supabase/middleware';
import { NextResponse, type NextRequest } from 'next/server';
import { GUPSHUP_ENABLED } from '@/lib/flags';

export async function middleware(request: NextRequest) {
    // One gate for the whole feature. Hiding the nav link alone leaves /chatter
    // reachable by anyone who guesses the URL or has it in their history.
    if (!GUPSHUP_ENABLED && request.nextUrl.pathname.startsWith('/chatter')) {
        return NextResponse.redirect(new URL('/', request.url));
    }
    return await updateSession(request);
}

export const config = {
    matcher: [
        // Run on all routes except static files and API routes
        '/((?!_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp)$).*)',
    ],
};
