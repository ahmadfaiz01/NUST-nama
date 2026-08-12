"use client";

import posthog from 'posthog-js';
import { PostHogProvider as PHProvider, usePostHog } from 'posthog-js/react';
import { usePathname, useSearchParams } from 'next/navigation';
import { useEffect, Suspense } from 'react';
import { createClient } from '@/lib/supabase/client';

/**
 * Query params that must never reach an analytics vendor. `code` is the OAuth
 * authorization code on /auth/callback; `error` carries the raw Supabase message,
 * which can name the address that was rejected.
 */
const REDACTED_PARAMS = ['code', 'token', 'access_token', 'refresh_token', 'error'];

export function scrubUrl(raw: string): string {
    try {
        const url = new URL(raw);
        for (const p of REDACTED_PARAMS) {
            if (url.searchParams.has(p)) url.searchParams.set(p, 'redacted');
        }
        return url.toString();
    } catch {
        return raw;
    }
}

function PostHogPageView() {
    const pathname = usePathname();
    const searchParams = useSearchParams();
    const ph = usePostHog();

    useEffect(() => {
        if (pathname && ph) {
            let url = window.origin + pathname;
            if (searchParams && searchParams.toString()) {
                url = url + `?${searchParams.toString()}`;
            }
            ph.capture('$pageview', { '$current_url': scrubUrl(url) });
        }
    }, [pathname, searchParams, ph]);

    return null;
}

/**
 * `person_profiles: 'identified_only'` means nothing is ever attributed to a
 * person until identify() is called, so without this the setting silently
 * discards every profile. Identify by Supabase user id only — never the email,
 * which is the student's real name at a NUST address.
 */
function PostHogIdentify() {
    const ph = usePostHog();

    useEffect(() => {
        if (!ph) return;
        const supabase = createClient();

        supabase.auth.getUser().then(({ data }) => {
            if (data.user) ph.identify(data.user.id);
        });

        const { data: sub } = supabase.auth.onAuthStateChange((event, session) => {
            if (event === 'SIGNED_OUT') ph.reset();
            else if (session?.user) ph.identify(session.user.id);
        });

        return () => sub.subscription.unsubscribe();
    }, [ph]);

    return null;
}

export function PostHogProvider({ children }: { children: React.ReactNode }) {
    useEffect(() => {
        const key = process.env.NEXT_PUBLIC_POSTHOG_KEY;
        // Absent in local dev and in any fork without the key. init(undefined)
        // throws and takes the rest of this effect with it.
        if (!key) return;

        posthog.init(key, {
            api_host: process.env.NEXT_PUBLIC_POSTHOG_HOST || 'https://eu.i.posthog.com',
            ui_host: 'https://eu.posthog.com',
            capture_pageview: false, // We do this manually via PostHogPageView
            capture_pageleave: true,
            // CRITICAL: Only create person profiles for identified (logged-in) users.
            // Without this, every anonymous bot/visitor burns free quota.
            person_profiles: 'identified_only',
            // Autocapture records which element was clicked, never what was typed
            // into it. These two keep it that way for text and attributes as well,
            // so a half-typed question or venue name cannot leak through a label.
            mask_all_text: true,
            mask_all_element_attributes: true,
            // Belt and braces: scrub the sensitive query params off every event,
            // not just the pageviews we send by hand. `sanitize_properties` does
            // the same job and is deprecated as of posthog-js 1.369.
            before_send: (event) => {
                if (event?.properties) {
                    for (const k of ['$current_url', '$referrer', '$pathname']) {
                        const v = event.properties[k];
                        if (typeof v === 'string') event.properties[k] = scrubUrl(v);
                    }
                }
                return event;
            },
            // Enable debug mode in development only
            loaded: (ph) => {
                if (process.env.NODE_ENV === 'development') ph.debug();
            },
        });
    }, []);

    return (
        <PHProvider client={posthog}>
            <Suspense fallback={null}>
                <PostHogPageView />
            </Suspense>
            <PostHogIdentify />
            {children}
        </PHProvider>
    );
}
