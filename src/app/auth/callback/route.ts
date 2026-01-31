import { createClient } from '@/lib/supabase/server';
import { NextResponse } from 'next/server';

export async function GET(request: Request) {
    const { searchParams, origin } = new URL(request.url);
    const code = searchParams.get('code');
    const next = searchParams.get('next') ?? '/';

    if (code) {
        const supabase = await createClient();
        const { error } = await supabase.auth.exchangeCodeForSession(code);

        if (!error) {
            return NextResponse.redirect(`${origin}${next}`);
        } else {
            console.error('Auth Callback Error:', error);
            // Redirect with specific error message
            return NextResponse.redirect(`${origin}/auth?error=${encodeURIComponent(error.message)}`);
        }
    }

    // Return to error page if code missing
    return NextResponse.redirect(`${origin}/auth?error=no_code_provided`);
}
