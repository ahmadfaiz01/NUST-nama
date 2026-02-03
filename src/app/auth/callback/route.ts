import { createClient } from '@/lib/supabase/server';
import { NextResponse } from 'next/server';

export async function GET(request: Request) {
    const { searchParams, origin } = new URL(request.url);
    const code = searchParams.get('code');
    const token_hash = searchParams.get('token_hash');
    const type = searchParams.get('type');
    const next = searchParams.get('next') ?? '/';

    const supabase = await createClient();

    // Handle PKCE code exchange (OAuth or magic link from same browser)
    if (code) {
        const { error } = await supabase.auth.exchangeCodeForSession(code);

        if (!error) {
            return NextResponse.redirect(`${origin}${next}`);
        } else {
            console.error('Auth Callback Error (code):', error);
            return NextResponse.redirect(`${origin}/auth?error=${encodeURIComponent(error.message)}`);
        }
    }

    // Handle email confirmation token (works across browsers)
    if (token_hash && type) {
        const { error } = await supabase.auth.verifyOtp({
            token_hash,
            type: type as 'signup' | 'email' | 'recovery' | 'invite' | 'magiclink' | 'email_change',
        });

        if (!error) {
            // Email verified successfully - redirect to success page
            return NextResponse.redirect(`${origin}/auth?verified=true`);
        } else {
            console.error('Auth Callback Error (token):', error);
            return NextResponse.redirect(`${origin}/auth?error=${encodeURIComponent(error.message)}`);
        }
    }

    // No valid auth parameters found
    return NextResponse.redirect(`${origin}/auth?error=invalid_callback`);
}
