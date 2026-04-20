"use client";

import posthog from 'posthog-js';
import { PostHogProvider as PHProvider, usePostHog } from 'posthog-js/react';
import { usePathname, useSearchParams } from 'next/navigation';
import { useEffect, Suspense } from 'react';

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
            ph.capture('$pageview', { '$current_url': url });
        }
    }, [pathname, searchParams, ph]);

    return null;
}

export function PostHogProvider({ children }: { children: React.ReactNode }) {
    useEffect(() => {
        posthog.init(process.env.NEXT_PUBLIC_POSTHOG_KEY as string, {
            api_host: process.env.NEXT_PUBLIC_POSTHOG_HOST || 'https://eu.i.posthog.com',
            ui_host: 'https://eu.posthog.com',
            capture_pageview: false, // We do this manually via PostHogPageView
            capture_pageleave: true,
            // CRITICAL: Only create person profiles for identified (logged-in) users.
            // Without this, every anonymous bot/visitor burns free quota.
            person_profiles: 'identified_only',
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
            {children}
        </PHProvider>
    );
}
